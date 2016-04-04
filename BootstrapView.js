import _ from 'lodash';

import React, {
  AsyncStorage,
  NativeModules,
  Navigator,
  Text,
  View,
} from 'react-native';

import LoginPage from './LoginPage';
import NameInputView from './NameInputView';
import MeetingNameInputView from './MeetingNameInputView';
import MeetingView from './MeetingView';

export default class BootstrapView extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCheckedSession: false,
    };
  }
  
  updateFromSession() {
    NativeModules.DigitsManager.session((session) => {
      console.log("Digits session", session);
      const newState = {
        hasCheckedSession: true,
      };
      
      if (session) {
        newState.user = {
          logged: !!session,
          id: session.userId,
        };
        
        AsyncStorage.getItem('userName', (error, userName) => {
          if (!error) {
            console.log('Found user name', userName);
            newState.user.name = userName;
          }
          
          this.setState(newState);
        });
      } else {
        this.setState(newState);
      }
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
  
  updateMeetingName(newMeetingName) {
    console.log('Updating Meeting Name to', newMeetingName);
    AsyncStorage.setItem('meetingName', newMeetingName, (error) => {
      if (!error) {
        console.log('Updated meeting name, setting state', _.extend(this.state, {meeting: newMeetingName}));
        this.setState({meeting: _.extend(this.state, {meeting: newMeetingName})});
      }
    });
  }
  
  componentWillMount() {
    this.updateFromSession();
  }
  
  renderScene(route, navigator) {
    console.log(`renderScene for ${route.name}`);
    if (route.component) {
      const props = route.props || {};
      props.navigator = navigator;
      return React.createElement(route.component, {...props});
    } else {
      throw new Error("No component passed in route " + JSON.stringify(route));
    }
  }
  
  render() {
    let route = null;
    if (this.state.user) {
      if (this.state.user.name) {
        console.log(`this.state ${JSON.stringify(this.state)}`);
        if (this.state.meeting) {
          route = {
            name: 'Meeting View',
            component: MeetingView,
            props: {
            },
          };
        } else {
          route = {
            name: 'Meeting Name Input View',
            component: MeetingNameInputView,
            props: {
              user: this.state.user,
              updateMeetingName: this.updateMeetingName.bind(this),
            },
          };
        }
      } else {
        route = {
          name: 'Name Input View',
          component: NameInputView,
          props: {
            user: this.state.user,
            updateName: this.updateName.bind(this),
          }
        }
      }
    } else {
      route = {
        name: 'Login Page',
        component: LoginPage,
        props: {
          user: null,
          updateLoginState: this.updateFromSession.bind(this),
        },
      };
    }
    
    return this.state.hasCheckedSession ?
    this.renderScene(route) :
    this.renderLoading();
  }
  
  renderLoading() {
    return <View>
    <Text>Loading Talking Stick</Text>
    </View>
  }
}
