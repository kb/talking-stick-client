import { Socket } from './phoenix'

const TIMEOUT = 10000
const URL = 'http://localhost:4000/socket'

export default (user, meetingName, updateReceivedFn) => {
  // construct a socket
  const socket = new Socket(URL)

  // configure the event handlers
  socket.onOpen(event => console.log('Connected.'))
  socket.onError(event => console.log('Cannot connect.'))
  socket.onClose(event => console.log('Goodbye.'))

  // open a connection to the server
  socket.connect()

  // configure a channel into a room - https://www.youtube.com/watch?v=vWFX4ylV_ko
  const channelName = `meetings:${meetingName}`
  const channel = socket.channel(channelName, {});

  // join the channel and listen for admittance
  // chan.join()
  //   .receive('ignore', () => console.log('Access denied.'))
  //   .receive('ok', () => console.log('Access granted.'))
  //   .receive('timeout', () => console.log('Must be a MongoDB.'))

  channel.join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp)
      let meeting = JSON.stringify({
        meeting_id: meetingName
      })
      channel.push("sync", meeting)
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  // add some channel-level event handlers
  channel.onError(event => console.log('Channel blew up.'))
  channel.onClose(event => console.log('Channel closed.'))

  channel.on("meeting", payload => {
    console.log(payload)

    // moderator.text(`${JSON.stringify(payload.meeting.moderator)}`)
    // speaker.text(`${JSON.stringify(payload.meeting.speaker)}`)
    // queue.text(`${JSON.stringify(payload.meeting.queue)}`)
  })

  // when we receive a new chat message, just trigger the appropriate callback
  // chan.on('new:msg', msg => onChat && onChat(msg))

  // you can can listen to multiple types
  // chan.on('user:entered', msg => console.log('say hello to ', msg))

  // a function to shut it all down
  const close = () => socket.disconnect()

  // a function to send a message
  const requestStick = () => {
    const data = {
      user: {
        id: user.id,
        name: user.name
      },
      meeting_id: meetingName,
    };
    channel.push('request_stick', JSON.stringify(data));
  };

  // const send = (message) => {
  //   chan.push('new:msg', {body: message, user}, TIMEOUT)
  //     .receive('ok', (msg) => console.log('sent'))
  //     .receive('error', (reasons) => console.log('flop', reasons))
  //     .receive('timeout', () => console.log('slow much?'))
  // }

  // reveal a couple ways to drive this bus
  return { close, requestStick }
}
