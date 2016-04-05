'use strict';

import { Socket } from './phoenix'

export default class MeetingClient {
  constructor(user, meetingName, receiveMeetingUpdateCallback) {
    const URL = 'http://localhost:4000/socket';

    // construct the meeting payload for channel push actions
    this.requestPayload = JSON.stringify({
      user: {
        id: user.id,
        name: user.name
      },
      meeting_id: meetingName,
    });

    // construct a socket
    this.socket = new Socket(URL);

    // configure the event handlers
    this.socket.onOpen(event => console.log('Connected.'));
    this.socket.onError(event => console.log('Cannot connect.'));
    this.socket.onClose(event => console.log('Goodbye.'));

    // open a connection to the server
    this.socket.connect();

    // configure a channel for the meeting
    const channelName = `meetings:${meetingName}`;
    this.channel = this.socket.channel(channelName, {});

    // join the channel
    this.channel.join()
    .receive("ok", resp => {
      console.log('Joined successfully', resp)
      let meeting = JSON.stringify({
        meeting_id: meetingName
      })
      this.channel.push("sync", meeting)
    })
    .receive("error", resp => { console.log('Unable to join', resp) })
    .receive('timeout', () => console.log('Join Timeout'));

    // add some channel-level event handlers
    this.channel.onError(event => console.log('Channel error'));
    this.channel.onClose(event => console.log('Channel closed'));

    this.channel.on("meeting", payload => {
      receiveMeetingUpdateCallback(payload);
    });
  }

  close() {
    this.socket.disconnect()
  }

  // user Actions
  requestStick() {
    this.channel.push('request_stick', this.requestPayload)
  }

  unrequestStick() {
    channel.push("unrequest_stick", this.requestPayload)
  }

  relinquishStick() {
    channel.push("relinquish_stick", this.requestPayload)
  }

  // moderator Actions
  becomeModerator() {
    channel.push("become_moderator", this.requestPayload)
  }

  relinquishModerator() {
    channel.push("relinquish_moderator", this.requestPayload)
  }

  resetSpeakerAndQueue() {
    channel.push("reset_speaker_and_queue", this.requestPayload)
  }
}
