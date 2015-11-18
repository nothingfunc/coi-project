/**
 * Created by zhengguo.chen on 2015/11/18.
 */
const CONSTANT = {
  API_SUCCESS: '1',
  API_ERROR: '0',

  ROLE: {
    '1': {
      STATES: ['search', 'statistics'],
      DEFAULT_STATE: 'search'
    },
    '2': {
      STATES: ['search', 'statistics'],
      DEFAULT_STATE: 'search'
    },
    '3': {
      STATES: ['search', 'check', 'statistics'],
      DEFAULT_STATE: 'check'
    },
    '4': {
      STATES: ['search', 'check', 'statistics'],
      DEFAULT_STATE: 'check'
    },
    '5': {
      STATES: ['search', 'report', 'statistics'],
      DEFAULT_STATE: 'report'
    }
  }
};

module.exports = CONSTANT;
