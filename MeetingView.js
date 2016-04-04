import React, {
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

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
  constructor() {
    super();
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.title}>Hey this is the meeting!</Text>
    </View>
  }
}
