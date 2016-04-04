import React, {
  AsyncStorage,
  NativeModules,
  Navigator,
  Text,
  View,
} from 'react-native';

import LoginPage from './LoginPage';

export default class BootstrapView extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  updateFromSession() {
    NativeModules.DigitsManager.session((session) => {
      console.log("Digits session", session);
      this.setState({
        user: {
          logged: !!session,
          userId: session ? session.userId : null,
        },
      });
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
    // TODO skip login if logged in
    const initialRoute = {
       name: 'Login Page',
       component: LoginPage,
       props: {
         user: this.state.user,
       },
     };

     return this.state.user ?
       <Navigator
         initialRoute={initialRoute}
         renderScene={this.renderScene}
       /> :
       this.renderLoading()
  }

  renderLoading() {
    return <View>
      <Text>Loading Talking Stick</Text>
    </View>
  }
}
