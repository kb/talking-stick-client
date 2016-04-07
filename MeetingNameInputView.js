import React, {
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
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextPropsevents),
    });
  }

  whenNextButtonPressed() {
    if (this.state.nameText !== '') {
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

        <Text style={styles.subTitle}>Calendar Events</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCalendarEventRow.bind(this)}
        />
    </View>
    );
  }

  renderCalendarEventRow(event) {
    return <TouchableHighlight style={styles.eventListRow} onPress={this.props.updateMeetingName.bind(this, event.title)}>
      <Text>{event.title}</Text>
    </TouchableHighlight>;
  }
}
