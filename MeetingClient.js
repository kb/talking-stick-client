'use strict';

import { Socket } from './phoenix'

export default class MeetingClient {
  constructor(user, meetingName, receiveMeetingUpdateCallback) {
    // construct the meeting payload for channel push actions
    this.requestPayload = JSON.stringify({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      meeting_id: meetingName.toLowerCase(),
    });

    // construct a socket
    this.socket = new Socket("wss://talking-stick-service.herokuapp.com/socket")

    // configure the event handlers
    this.socket.onOpen(event => console.log('Connected.'));
    this.socket.onError(event => console.log('Cannot connect.'));
    this.socket.onClose(event => console.log('Goodbye.'));

    // open a connection to the server
    this.socket.connect();

    // configure a channel for the meeting
    const channelName = `meetings:${meetingName}`;
    this.channel = this.socket.channel(channelName, {});

    // listen for server messages on the 'meeting' channel
    this.channel.on("meeting", payload => {
      receiveMeetingUpdateCallback(payload);
    });

    // join the channel
    this.channel.join()
    .receive("ok", resp => {
      console.log('Joined successfully', resp)
      let meeting = JSON.stringify({
        meeting_id: meetingName
      })
      this.channel.push("sync", meeting)
    })
    .receive("error", resp => { console.log('Unable to join', resp) });

    // add some channel-level event handlers
    this.channel.onError(event => console.log('Channel error'));
    this.channel.onClose(event => console.log('Channel closed'));
  }

  close() {
    this.socket.disconnect()
  }

  // user Actions
  requestStick() {
    console.log("requestStick");
    this.channel.push('request_stick', this.requestPayload);
  }

  unrequestStick() {
    console.log("unrequestStick");
    this.channel.push("unrequest_stick", this.requestPayload);
  }

  relinquishStick() {
    console.log("relinquishStick");
    this.channel.push("relinquish_stick", this.requestPayload);
  }

  // moderator Actions
  becomeModerator() {
    console.log("becomeModerator");
    this.channel.push("become_moderator", this.requestPayload);
  }

  relinquishModerator() {
    console.log("relinquishModerator");
    this.channel.push("relinquish_moderator", this.requestPayload);
  }

  resetSpeakerAndQueue() {
    console.log("resetSpeakerAndQueue");
    this.channel.push("reset_speaker_and_queue", this.requestPayload);
  }
}
