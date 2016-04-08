'use strict';

var React = require('react-native');

var Digits = require('react-native-fabric-digits');
var { DigitsLoginButton, DigitsLogoutButton } = Digits;
var DigitsManager = require("react-native").NativeModules.DigitsManager;

var {
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

import Colors from './Colors';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY,
  },
  DigitsAuthenticateButton: {
    height: 50,
    width: 230,
    backgroundColor: Colors.GREEN,
    justifyContent: 'center',
    borderRadius: 5,
    margin: 20,
  },
  DigitsAuthenticateButtonText: {
    fontSize: 16,
    color: Colors.TEXT,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  text: {
    color: Colors.TEXT,
  },
  title: {
    fontSize: 24,
    color: Colors.TEXT,
  },
});

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      error: false,
      response: {}
    };
  }

  completion(error, response) {
    if (error && error.code !== 1) {
      this.setState({ logged: false, error: true, response: {} });
    } else if (response) {
      var logged = JSON.stringify(response) === '{}' ? false : true;
      console.log("response");
      console.log(response);

      this.props.updateLoginState();
      // The native bridge should return the userId in the completion response
      // but for now we're fetching it from the Digits session ourselves
      // to avoid having to mess with the bridge further.
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to Talking Stick
        </Text>
        {this.state.error ? <Text>An error occured.</Text> : null}
        {this.renderLoginScreen()}
      </View>
    );
  }

  renderLoginScreen() {
    return (
      <DigitsLoginButton
      options={{
        title: "Talking Stick Login",
        phoneNumber: "+1",
        appearance: {
          backgroundColor: {
            hex: Colors.GRAY,
            alpha: 1.0
          },
          accentColor: {
            hex: 'black',
            alpha: 1.0,
          },
          headerFont: {
            name: "Arial",
            size: 16,
            color: Colors.TEXT,
          },
          labelFont: {
            name: "Helvetica",
            size: 18,
            color: Colors.TEXT,
          },
          bodyFont: {
            name: "Helvetica",
            size: 16,
            color: Colors.TEXT,
          }
        }
      }}
      completion={this.completion.bind(this)}
      text="Login"
      buttonStyle={styles.DigitsAuthenticateButton}
      textStyle={styles.DigitsAuthenticateButtonText}/>
    );
  }
}
