import _ from 'lodash';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';

import MeetingClient from './MeetingClient'
import RNDimmer from 'react-native-dimmer';
import gravatar from 'react-native-gravatar';
var {Gravatar, GravatarApi} = gravatar;

import CountdownDisplay from './CountdownDisplay';
import LoadingView from './LoadingView';
import Colors from './Colors';

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  mainContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  toolbar: {
    marginTop: 20,
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.TEXT,
  },
  backButton: {
    marginLeft: 10,
  },
  text: {
    color: Colors.TEXT,
  },
  speaker: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  roundedProfileImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 25,
    marginRight: 10,
  },
  bottomContainer: {
    backgroundColor: Colors.GRAY,
    padding: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  moderatorMenuContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.GRAY,
  },
  moderatorButton: {
    padding: 15,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
});

export default class MeetingView extends Component {
  constructor(props) {
    super(props);
    console.log("MeetingView Props " + JSON.stringify(props));
    this.meetingClient = new MeetingClient(props.user, props.meeting.title, this.receiveMeetingUpdate.bind(this));
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
    const newMeetingState = payload.meeting;
    console.log("receiveMeetingUpdate " + JSON.stringify(payload), this.props.user, this.state.meeting);
    const isOldSpeaker = this.state.meeting && this.state.meeting.speaker && this.state.meeting.speaker.id === this.props.user.id;
    const isNewSpeaker = newMeetingState.speaker && newMeetingState.speaker.id === this.props.user.id;
    if (!isOldSpeaker && isNewSpeaker) {
      console.log('Vibrating! bzzzzz');
      Vibration.vibrate();
    }
    this.setState({meeting: newMeetingState});
  }

  whenBackButtonPressed() {
    this.props.updateMeeting(null);
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

    const isUserSpeaker = this.state.meeting.speaker && this.state.meeting.speaker.id == this.props.user.id;
    const backgroundColor = isUserSpeaker ? Colors.GREEN : Colors.RED;

    return (
      <View style={[styles.container, {backgroundColor}]}>
        <View>
          <View style={styles.toolbar}>
            <TouchableHighlight style={styles.backButton} onPress={this.whenBackButtonPressed.bind(this)}>
              <Text style={styles.text}>
                Back
              </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.meeting.title}</Text>
            {this.maybeRenderCountdown()}
          </View>
        </View>

        <TouchableWithoutFeedback onPress={this.whenViewTapped.bind(this)}>
          <View style={styles.mainContainer} >
            {this.maybeRenderCurrentSpeaker()}
            {this.maybeRenderNextSpeaker()}
            {this.maybeRenderQueuePosition()}
          </View>
        </TouchableWithoutFeedback>

        <View>
          {this.maybeRenderModeratorMenu()}
          <TouchableHighlight style={styles.bottomContainer} onPress={this.whenModeratorButtonPressed.bind(this)}>
            <Text style={styles.text}>{moderatorButtonText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  maybeRenderCountdown() {
    if (!this.props.meeting.endTimeMs) {
      return undefined;
    }

    return <CountdownDisplay endTimeMs={this.props.meeting.endTimeMs} />;
  }

  maybeRenderCurrentSpeaker() {
    const currentSpeaker = this.state.meeting.speaker;
    if (!currentSpeaker) {
      return undefined;
    }

    return <View style={styles.speaker}>
      <Gravatar options={{
        email: this.props.user.email,
        parameters: { "size": "200", "d": "mm" },
        secure: true
        }}
        style={styles.roundedProfileImage}
      />
      <Text style={styles.text}>{currentSpeaker.name} (Current Speaker)</Text>
    </View>;
  }

  maybeRenderNextSpeaker() {
    const nextSpeaker = _.first(this.state.meeting.queue);
    if (!nextSpeaker) {
      return undefined;
    }

    return <Text style={styles.text}>Next Speaker: {nextSpeaker.name}</Text>;
  }


  maybeRenderQueuePosition() {
    const queueIndex = _.findIndex(this.state.meeting.queue, (u) => u.id === this.props.user.id);
    if (queueIndex < 1) {
      return undefined;
    }

    return <Text style={styles.text}>There are {queueIndex} speakers ahead of you</Text>;
  }

  maybeRenderModeratorMenu() {
    if (!this.state.showModeratorMenu) {
      return undefined;
    }

    return <View style={styles.moderatorMenuContainer}>
        <TouchableHighlight style={styles.moderatorButton} onPress={this.whenStopModeratingButtonPressed.bind(this)}>
          <Text style={styles.text}>Stop Moderating</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.moderatorButton} onPress={this.whenResetQueueButtonPressed.bind(this)}>
          <Text style={styles.text}>Reset Queue</Text>
        </TouchableHighlight>
    </View>
  }
}
