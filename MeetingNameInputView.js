import React, {
  Component,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import Colors from './Colors';

const {DeviceEventEmitter} = require('react-native');
const Discovery = require('react-native-discovery');

const styles =  StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.GRAY,
  },
  calendarList: {
    flex: 2,
  },
  text: {
    color: Colors.TEXT,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.TEXT,
  },
  title: {
    fontSize: 24,
    color: Colors.TEXT,
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingBottom: 20,
  },
  textInput: {
    flex: 2,
    height: 40,
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
  },
  nextButton: {
    marginTop: 5,
    padding: 15,
  },
  eventListRow: {
    padding: 20,
  },
});

export default class MeetingNameInputView extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      nameText: '',
      dataSource: dataSource.cloneWithRows(props.events),
    };

    // Initialize the Discovery object with a UUID specific for the app
    // and a user specific value for the device
    Discovery.initialize(
      "3E1180E5-222E-43E9-98B4-E6C0DD18E728",
      this.props.user.id,
    );

    // TODO add a method to stop this
    Discovery.setShouldAdvertise(true);
    Discovery.setShouldDiscover(true);

    // Listen for discovery changes
    DeviceEventEmitter.addListener(
      'discoveredUsers',
      (data) => {
        if (data.didChange || data.usersChanged) //slight callback discrepancy between the iOS and Android libraries
        console.log(data.users)
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.events),
    });
  }

  whenNextButtonPressed() {
    if (this.state.nameText !== '') {
      this.props.updateMeeting({title: this.state.nameText});
    }
  }

  whenLogoutButtonPressed() {
    this.props.logout();
  }

  render() {
    const nextButtonDisabled = this.state.nameText === '';
    const buttonTextStyle = {
      fontSize: 20,
      color: Colors.TEXT,

    };
    if (nextButtonDisabled) {
      buttonTextStyle.color = 'gray';
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pick a Meeting</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Custom Meeting Name"
            style={styles.textInput}
            onChangeText={(nameText) => this.setState({nameText})}
            text={this.state.nameText}
          />
          <TouchableHighlight style={styles.nextButton} disabled={nextButtonDisabled} onPress={this.whenNextButtonPressed.bind(this)}>
            <Text style={buttonTextStyle}>Next</Text>
          </TouchableHighlight>
        </View>

        {this.maybeRenderCalendarListView()}

        <TouchableHighlight onPress={this.whenLogoutButtonPressed.bind(this)}>
          <Text style={styles.text}>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderCalendarEventRow(event) {
    return <TouchableHighlight style={styles.eventListRow} onPress={this.props.updateMeeting.bind(this, event)}>
      <Text style={styles.text}>{event.title}</Text>
    </TouchableHighlight>;
  }

  maybeRenderCalendarListView() {
    if (this.state.dataSource.getRowCount() == 0) {
      return undefined;
    }

    return <View style={styles.calendarList}>
      <Text style={styles.subTitle}>Calendar Events</Text>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderCalendarEventRow.bind(this)}
      />
    </View>;
  }
}
