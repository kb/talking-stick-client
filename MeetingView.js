import React, {
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
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
    this.meeting = new MeetingClient(props.user, props.meeting, this.receiveMeetingUpdate);
  }

  // fires when we receive a message
  receiveMeetingUpdate(message) {
    console.log("receiveMeetingUpdate " + JSON.stringify(message));
  }

  whenNextButtonPressed() {
    this.meeting.requestStick();
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.title}>Hey! This is the meeting!</Text>

      <TouchableHighlight style={styles.nextButton} onPress={this.whenNextButtonPressed.bind(this)}>
        <Text >Next</Text>
      </TouchableHighlight>
    </View>
  }
}
