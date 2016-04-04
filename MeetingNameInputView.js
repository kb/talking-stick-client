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

export default class MeetingNameInputView extends Component {
  constructor() {
    super();
    this.state = {
      nameText: '',
    };
  }

  whenNextButtonPressed() {
    if (this.state.nameText !== '') {
      console.log('Setting Meeting Name to', this.state.nameText)
      this.props.updateMeetingName(this.state.nameText);
    }
  }

  render() {
    const nextButtonDisabled = this.state.nameText === '';
    const buttonTextStyle = {
      fontSize: 20,
      color: 'black',
    };
    if (nextButtonDisabled) {
      buttonTextStyle.color = 'gray';
    }

    return <View style={styles.container}>
      <Text style={styles.title}>What’s the name of your meeting?</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(nameText) => this.setState({nameText})}
        text={this.state.nameText}
        autoFocus={true}
      />
      <TouchableHighlight style={styles.nextButton} disabled={nextButtonDisabled} onPress={this.whenNextButtonPressed.bind(this)}>
        <Text style={buttonTextStyle}>Next</Text>
      </TouchableHighlight>
    </View>
  }
}
