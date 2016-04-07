import {NativeModules} from 'react-native';
const CalendarManager = NativeModules.CalendarManager;

export default class Calendar {
  constructor() {
  }

  authorizationStatus(callback) {
    callback('authorized');
  }

  promptForAuthorization() {
    // noop
  }

  events(callback) {
    CalendarManager.queryEvents((events) => {
      callback(events);
    });
  }
}
