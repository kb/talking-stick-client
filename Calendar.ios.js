import {NativeAppEventEmitter} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';

export default class Calendar {
  constructor() {
    this.dateFormat = "YYYY-MM-DDTHH:mm:ss.sssZ";
    this.startDate = moment().startOf('day').format(this.dateFormat);
    this.endDate = moment().endOf('day').format(this.dateFormat);
  }

  needsAuthorization(callback) {
    RNCalendarEvents.authorizationStatus(({status}) => callback(status));
  }

  promptForAuthorization(callback) {
    RNCalendarEvents.authorizeEventStore(({status}) => callback(status));
  }

  events(callback) {
    RNCalendarEvents.fetchAllEvents(this.startDate, this.endDate, (events) => {
      events = events.map((event) => {
        return {
          title: event.title,
          id: event.id,
          startDate: moment(event.startDate, this.dateFormat).toDate(),
          endDate: moment(event.endDate, this.dateFormat).toDate(),
        };
      });
      callback(events);
    });
  }
}
  /* Events look like:
  { location: '',
    allDay: false,
    endDate: '2016-04-06T23:00:00.000Z',
    startDate: '2016-04-06T15:00:00.000Z',
    notes: '',
    title: 'TEST',
    alarms: [],
    recurrence: '',
    id: '0C080FBA-F580-49D1-9341-A2697B376455',
    occurrenceDate: '2016-04-06T15:00:00.000Z',
    isDetached: false }
    */
