'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;
// var Meeting = require('./Meeting');

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  userInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

// function urlForQueryAndPage(key, value, pageNumber) {
//   var data = {
//       country: 'uk',
//       pretty: '1',
//       encoding: 'json',
//       listing_type: 'buy',
//       action: 'search_listings',
//       page: pageNumber
//   };
//   data[key] = value;

//   var querystring = Object.keys(data)
//     .map(key => key + '=' + encodeURIComponent(data[key]))
//     .join('&');

//   return 'http://api.nestoria.co.uk/api?' + querystring;
// };

class RootPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingString: '12345',
      sLoading: false
    };
  }

  render() {
    console.log('RootPage.render');
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
        hidden='true'
        size='large'/> ) :
      ( <View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          User ID: '1234'
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.userInput}
            value={this.state.meetingString}
            onChange={this.onMeetingTextChanged.bind(this)}
            placeholder='Meeting ID'/>
          <TouchableHighlight
            style={styles.button}
            underlayColor='#99d9f4'
            onPress={this.onModeratePressed.bind(this)}>
            <Text style={styles.buttonText}>Moderate</Text>
          </TouchableHighlight>
        </View>
        {spinner}
      </View>
    );
  }

  onMeetingTextChanged(event) {
    console.log('onMeetingTextChanged');
    this.setState({ meetingString: event.nativeEvent.text });
    console.log(this.state.meetingString);
  }

  _executeQuery(query) {
    console.log(query);
    this.setState({ isLoading: true });
  }

  onModeratePressed() {
    console.log("onModeratePressed");
    // var query = urlForQueryAndPage('place_name', this.state.meetingString, 1);
    // this._executeQuery(query);
  }
}

module.exports = RootPage;
