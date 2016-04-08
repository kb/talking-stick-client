import React, {
  Text,
  View,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
import moment from 'moment';

import Colors from './Colors';

export default React.createClass({
  mixins: [TimerMixin],

  propTypes: {
    endTimeMs: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      now: moment(),
    };
  },

  updateNow() {
    this.setState({
      now: moment(),
    });
  },

  componentDidMount() {
    this.setInterval(this.updateNow, 10 * 1000);
  },

  render() {
    const differenceMs = this.props.endTimeMs - this.state.now;
    if (differenceMs <= 0) {
      return <View>
        <Text>Meeting Over</Text>
      </View>;
    }

    const formattedTimeRemaining = moment.duration(differenceMs).humanize();
    return <View>
      <Text style={{color: Colors.TEXT}}>{formattedTimeRemaining} Remaining</Text>
    </View>
  },
});
