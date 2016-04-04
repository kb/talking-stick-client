'use strict';

import { Socket } from './phoenix'

export default class MeetingClient {
  constructor(user, meetingName, updateReceivedFn) {
    const URL = 'http://localhost:4000/socket';

    this.user = user;
    this.meetingName = meetingName;
    this.updateReceivedFn = updateReceivedFn;

    // construct a socket
    this.socket = new Socket(URL);

    // configure the event handlers
    this.socket.onOpen(event => console.log('Connected.'));
    this.socket.onError(event => console.log('Cannot connect.'));
    this.socket.onClose(event => console.log('Goodbye.'));

    // open a connection to the server
    this.socket.connect();

    // configure a channel into a room - https://www.youtube.com/watch?v=vWFX4ylV_ko
    const channelName = `meetings:${meetingName}`;
    this.channel = this.socket.channel(channelName, {});

    // join the channel
    this.channel.join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp)
        let meeting = JSON.stringify({
          meeting_id: meetingName
        })
        this.channel.push("sync", meeting)
      })
      .receive("error", resp => { console.log("Unable to join", resp) })
      .receive('timeout', () => console.log('Join Timeout'));

      // add some channel-level event handlers
      this.channel.onError(event => console.log('Channel blew up.'));
      this.channel.onClose(event => console.log('Channel closed.'));

      this.channel.on("meeting", payload => {
        console.log(payload);
      });
  }

  close() {
    this.socket.disconnect()
  }

  requestStick() {
    const data = {
      user: {
        id: this.user.id,
        name: this.user.name
      },
      meeting_id: this.meetingName,
    };
    this.channel.push('request_stick', JSON.stringify(data))
      .receive('ok', (msg) => console.log('Request Stick Sent'))
      .receive('error', (reasons) => console.log('Request Stick Error', reasons));
  }
}
