'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
} from 'react-native';

import BootstrapView from './BootstrapView';

var styles = StyleSheet.create({

});

class TalkingStickClient extends Component {
  render() {
    return (
      <BootstrapView />
    );
  }
}

AppRegistry.registerComponent('TalkingStickClient', () => TalkingStickClient);
