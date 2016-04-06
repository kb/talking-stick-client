import _ from 'lodash';

import React, {
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
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
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
  backButton: {
    paddingTop: 25,
    paddingLeft: 10,
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

  whenBackButtonPressed() {
    this.props.updateMeetingName(null);
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
    if (!this.state.meeting) {
      return <View>
        <Text style={styles.title}>Loading</Text>
      </View>;
    }

    return <View>
      <TouchableHighlight style={styles.backButton} onPress={this.whenBackButtonPressed.bind(this)}>
        <Text>
          Back
        </Text>
      </TouchableHighlight>
      <TouchableWithoutFeedback onPress={this.whenViewTapped.bind(this)}>
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.meeting}</Text>
          {this.maybeRenderCurrentSpeaker()}
          {this.maybeRenderNextSpeaker()}
          {this.maybeRenderQueuePosition()}
        </View>
      </TouchableWithoutFeedback>
    </View>
  }

  maybeRenderCurrentSpeaker() {
    const currentSpeaker = this.state.meeting.speaker;
    if (!currentSpeaker) {
      return undefined;
    }

    return <Text>Speaker: {currentSpeaker.name}</Text>;
  }

  maybeRenderNextSpeaker() {
    const nextSpeaker = _.first(this.state.meeting.queue);
    if (!nextSpeaker) {
      return undefined;
    }

    return <Text>Next Speaker: {nextSpeaker.name}</Text>;
  }


  maybeRenderQueuePosition() {
    const queueIndex = _.findIndex(this.state.meeting.queue, (u) => u.id === this.props.user.id);
    if (queueIndex < 1) {
      return undefined;
    }

    return <Text>There are {queueIndex} speakers ahead of you</Text>;
  }
}
