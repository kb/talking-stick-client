import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
});

export default class LoadingView extends Component {
  render() {
    return <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>;
  }
}
