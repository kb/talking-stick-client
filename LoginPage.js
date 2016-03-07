'use strict';

var React = require('react-native');

var Digits = require('react-native-fabric-digits');
var { DigitsLoginButton, DigitsLogoutButton } = Digits;

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  DigitsAuthenticateButton: {
    height: 50,
    width: 230,
    backgroundColor: '#13988A',
    justifyContent: 'center',
    borderRadius: 5
  },
  DigitsAuthenticateButtonText: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold'
  }
});

class LoginPage extends Component {
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

      this.setState({ logged: logged, error: false, response: response });
    }
  }

  render() {
    var error = this.state.error ? <Text>An error occured.</Text> : null;
    var content = this.state.logged ?
      (<View>
        <Text>
          Auth Token: {this.state.response.authToken}{'\n'}
          Auth Token Secret: {this.state.response.authTokenSecret}{'\n\n'}
        </Text>
        <DigitsLogoutButton
       completion={this.completion.bind(this)}
          text="Logout"
          buttonStyle={styles.DigitsAuthenticateButton}
          textStyle={styles.DigitsAuthenticateButtonText}/>
      </View>) : (<DigitsLoginButton
        options={{
          title: "Talking Stick Login",
          phoneNumber: "+1",
          appearance: {
            backgroundColor: {
              hex: "#ffffff",
              alpha: 1.0
            },
            accentColor: {
              hex: "#43a16f",
              alpha: 0.7
            },
            headerFont: {
              name: "Arial",
              size: 16
            },
            labelFont: {
              name: "Helvetica",
              size: 18
            },
            bodyFont: {
              name: "Helvetica",
              size: 16
            }
          }
        }}
        completion={this.completion.bind(this)}
        text="Login"
        buttonStyle={styles.DigitsAuthenticateButton}
        textStyle={styles.DigitsAuthenticateButtonText}/>);
    return (
      <View style={styles.container}>
        {error}
        {content}
      </View>
    );
  }
}

module.exports = LoginPage;
