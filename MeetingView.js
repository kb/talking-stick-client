import _ from 'lodash';

import React, {
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MeetingClient from './MeetingClient'

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 30,
  },
  nextButton: {
    marginTop: 5,
    padding: 15,
  },
});

export default class MeetingView extends Component {
  constructor(props) {
    super(props);
    console.log("MeetingView Props " + JSON.stringify(props));
    this.meetingClient = new MeetingClient(props.user, props.meeting, this.receiveMeetingUpdate.bind(this));
    this.state = {
      meeting: null,
    };
  }

  // fires when we receive a message
  receiveMeetingUpdate(payload) {
    console.log("receiveMeetingUpdate " + JSON.stringify(payload));
    this.setState({meeting: payload.meeting});
  }

  whenNextButtonPressed() {
    this.meetingClient.requestStick();
  }

  whenViewTapped() {
      const now = new Date().getTime();
      if (this.lastTapTime) {
        if (now - this.lastTapTime <= 200) {
          this.userAction();
        }
      }
      this.lastTapTime = now;
  }

  userAction() {
    const meeting = this.state.meeting;
    if (meeting) {
      if (_.find(meeting.queue, (u) => u.id === this.props.user.id)) {
        this.meetingClient.unrequestStick();
      } else if (!meeting.speaker || meeting.speaker.id !== this.props.user.id) {
        this.meetingClient.requestStick();
      } else if (meeting.speaker && meeting.speaker.id === this.props.user.id) {
        this.meetingClient.relinquishStick();
      }
    }
  }

  render() {
    return <TouchableWithoutFeedback onPress={this.whenViewTapped.bind(this)}>
      <View style={styles.container}>
        <Text style={styles.title}>Hey! This is the meeting!</Text>
      </View>
    </TouchableWithoutFeedback>
  }
}
