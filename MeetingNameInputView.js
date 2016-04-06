import React, {
  AsyncStorage,
  Component,
  ListView,
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextPropsevents),
    });
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
      <Text style={styles.title}>Pick a Meeting</Text>

      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderCalendarEventRow.bind(this)}
      />

      <Text style={styles.title}>Or</Text>
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

  renderCalendarEventRow(event) {
    return <TouchableHighlight style={styles.eventListRow} onPress={this.props.updateMeetingName.bind(this, event.title)}>
      <Text>{event.title}</Text>
    </TouchableHighlight>;
  }
}
