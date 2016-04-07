// TODO
export default class Calendar {
  constructor() {

  }

  needsAuthorization(callback) {
    callback('authorized');
  }

  promptForAuthorization() {

  }

  events(callback) {
    callback([]);
  }
}
