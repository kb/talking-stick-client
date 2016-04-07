import {NativeModules} from 'react-native';
const CalendarManager = NativeModules.CalendarManager;

export default class Calendar {
  constructor() {
  }

  needsAuthorization(callback) {
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
