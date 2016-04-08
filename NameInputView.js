import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import Colors from './Colors';

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.GRAY,
  },
  text: {
    color: Colors.TEXT,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    color: Colors.TEXT,
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
  },
  nextButton: {
    marginTop: 5,
    padding: 15,
  },
});

export default class NameInputView extends Component {
  constructor() {
    super();
    this.state = {
      nameText: '',
      emailText: '',
    };
  }

  whenNextButtonPressed() {
    if (this.state.nameText !== '') {
      this.props.updateName(this.state.nameText);
    }
    if (this.state.emailText !== '') {
      this.props.updateEmail(this.state.emailText);
    }
  }

  render() {
    const nextButtonDisabled = this.state.nameText === '' || this.state.emailText === '';
    const buttonTextStyle = {
      fontSize: 20,
      color: Colors.TEXT,
    };
    if (nextButtonDisabled) {
      buttonTextStyle.color = 'gray';
    }

    return <View style={styles.container}>
      <Text style={styles.title}>Hey! What’s your name...</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(nameText) => this.setState({nameText})}
        text={this.state.nameText}
        autoFocus={true}
      />
      <Text style={styles.title}>and email?</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(emailText) => this.setState({emailText})}
        text={this.state.emailText}
      />
      <TouchableHighlight style={styles.nextButton} disabled={nextButtonDisabled} onPress={this.whenNextButtonPressed.bind(this)}>
        <Text style={buttonTextStyle}>Next</Text>
      </TouchableHighlight>
    </View>
  }
}
