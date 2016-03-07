'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';
var RootPage = require('./RootPage');

var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

class TalkingStickClient extends Component {
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Talking Stick',
          component: RootPage,
        }}/>
    );
  }
}

AppRegistry.registerComponent('TalkingStickClient', () => TalkingStickClient);
