import _ from 'lodash';

import React, {
  AsyncStorage,
  NativeModules,
} from 'react-native';

var DigitsManager = require("react-native").NativeModules.DigitsManager;

import Calendar from './Calendar';
import LoginPage from './LoginPage';
import NameInputView from './NameInputView';
import MeetingNameInputView from './MeetingNameInputView';
import MeetingView from './MeetingView';
import LoadingView from './LoadingView';

export default class BootstrapView extends React.Component {
  constructor() {
    super();
    this.calendar = new Calendar();
    this.state = {
      hasCheckedSession: false,
      meeting: null,
    };
  }

  // TODO refactor this pls
  updateFromSession() {
    this.calendar.authorizationStatus((calendarAuthorizationStatus) => {
      NativeModules.DigitsManager.session((session) => {
        const newState = {
          hasCheckedSession: true,
          calendarAuthorizationStatus,
        };

        if (!session) {
          this.setState(newState);
          return;
        }

        newState.user = {
          logged: !!session,
          id: session.userId,
        };

        AsyncStorage.multiGet(['userName', 'userEmail'], (error, results) => {
          if (_.isEmpty(error)) {
            results.forEach((pair) => {
              const [k, v] = pair;
              if (k === 'userName') {
                newState.user.name = v;
              } else if (k === 'userEmail') {
                newState.user.email = v;
              }
            });
          }

          if (calendarAuthorizationStatus !== 'authorized') {
            this.setState(newState);
            return;
          }

          this.calendar.events((events) => {
            // TODO filter out events that have already elapsed, or been declined
            newState.events = events;
            this.setState(newState);
          });
        });
      });
    });
  }

  updateName(newName) {
    console.log('Updating Name to', newName);
    AsyncStorage.setItem('userName', newName, (error) => {
      if (!error) {
        console.log('Updated name, setting state', _.extend(this.state.user, {name: newName}));
        this.setState({user: _.extend(this.state.user, {name: newName})});
      }
    });
  }

  updateEmail(newEmail) {
    console.log('Updating Email to', newEmail);
    AsyncStorage.setItem('userEmail', newEmail, (error) => {
      if (!error) {
        console.log('Updated email, setting state', _.extend(this.state.user, {email: newEmail}));
        this.setState({user: _.extend(this.state.user, {email: newEmail})});
      }
    });
  }

  updateMeeting(newMeeting) {
    if (newMeeting) {
      newMeeting.title = newMeeting.title.trim();
    }
    console.log('Updating Meeting to', newMeeting);
    this.setState({meeting: newMeeting});
  }

  logout() {
    console.log("LOGGING OUT");
    DigitsManager.logout();
    AsyncStorage.multiRemove(['userName', 'userEmail'], (errors) => {
      if (_.isEmpty(errors)) {
        this.setState({user: null});
      }
    });
  }

  componentWillMount() {
    this.updateFromSession();
  }

  render() {
    if (!this.state.hasCheckedSession) {
      return this.renderLoading();
    }

    if (this.state.calendarAuthorizationStatus !== 'authorized') {
      this.calendar.promptForAuthorization((calendarAuthorizationStatus) => {
        this.setState({calendarAuthorizationStatus});
      });
      return this.renderLoading();
    }

    if (!this.state.user) {
      return <LoginPage user={null} updateLoginState={this.updateFromSession.bind(this)} />;
    }

    if (!this.state.user.name || !this.state.user.email) {
      return <NameInputView
        user={this.state.user}
        updateName={this.updateName.bind(this)}
        updateEmail={this.updateEmail.bind(this)}
      />;
    }

    if (!this.state.meeting) {
      return <MeetingNameInputView
        user={this.state.user}
        events={this.state.events}
        logout={this.logout.bind(this)}
        updateMeeting={this.updateMeeting.bind(this)}
      />;
    }

    return <MeetingView
      user={this.state.user}
      meeting={this.state.meeting}
      updateMeeting={this.updateMeeting.bind(this)}
    />;
  }

  renderLoading() {
    return <LoadingView />;
  }
}
