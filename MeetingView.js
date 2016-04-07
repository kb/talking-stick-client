import _ from 'lodash';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MeetingClient from './MeetingClient'
import RNDimmer from 'react-native-dimmer';

import LoadingView from './LoadingView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    padding: 15,
  },
  bottomContainer: {
    padding: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  moderatorMenuContainer: {
    flex: 1,
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
  },
  moderatorButton: {
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
      showModeratorMenu: false,
    };
  }

  componentWillMount() {
    // Disable dimmer (so the screen will stay on)
    RNDimmer.set(true);
  }

  componentWillUnmount() {
    // Enable dimmer (so the screen will dim)
    RNDimmer.set(false);
    // Close the client when this component unmounts to prevent state updates in the receiveMeetingUpdate callback
    this.meetingClient.close();
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

  whenModeratorButtonPressed() {
    const moderator = this.state.meeting.moderator;
    if (moderator == null) {
      this.meetingClient.becomeModerator();
    } else if (moderator.id === this.props.user.id) {
      this.setState({showModeratorMenu: !this.state.showModeratorMenu});
    }
  }

  whenStopModeratingButtonPressed() {
    this.meetingClient.relinquishModerator()
    this.setState({showModeratorMenu: false});
  }

  whenResetQueueButtonPressed() {
    this.meetingClient.resetSpeakerAndQueue()
    this.setState({showModeratorMenu: false});
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
      return <LoadingView />;
    }

    let moderatorButtonText = 'Become Moderator';
    if (this.state.meeting.moderator != null) {
      const moderator = this.state.meeting.moderator;
      if (moderator.id === this.props.user.id) {
        if (this.state.showModeratorMenu) {
          moderatorButtonText = 'Close Moderator Menu';
        }else {
          moderatorButtonText = 'Moderator Menu';
        }
      } else {
        moderatorButtonText = `${moderator.name} is Moderator`;
      }
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.whenViewTapped.bind(this)}>
          <View style={styles.mainContainer}>
            <TouchableHighlight style={styles.backButton} onPress={this.whenBackButtonPressed.bind(this)}>
              <Text>
                Back
              </Text>
            </TouchableHighlight>
            <Text style={styles.title}>{this.props.meeting}</Text>
            {this.maybeRenderCurrentSpeaker()}
            {this.maybeRenderNextSpeaker()}
            {this.maybeRenderQueuePosition()}
          </View>
        </TouchableWithoutFeedback>

        {this.maybeRenderModeratorMenu()}
        <TouchableHighlight style={styles.bottomContainer} onPress={this.whenModeratorButtonPressed.bind(this)}>
          <Text>{moderatorButtonText}</Text>
        </TouchableHighlight>
      </View>
    );
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

  maybeRenderModeratorMenu() {
    if (!this.state.showModeratorMenu) {
      return undefined;
    }

    return <View style={styles.moderatorMenuContainer}>
      <Text style={styles.subTitle}>Moderator Menu</Text>
        <TouchableHighlight style={styles.moderatorButton} onPress={this.whenStopModeratingButtonPressed.bind(this)}>
          <Text>Stop Moderating</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.moderatorButton} onPress={this.whenResetQueueButtonPressed.bind(this)}>
          <Text>Reset Queue</Text>
        </TouchableHighlight>
    </View>
  }
}
