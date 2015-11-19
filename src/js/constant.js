/**
 * Created by zhengguo.chen on 2015/11/18.
 */
const CONSTANT = {
  API_SUCCESS: '1',
  API_ERROR: '0',

  ROLE: {
    '0': {
      states: {},
      defaultState: 'login',
      roleName: '未登录用户'
    },
    '1': {
      states: {'search':1, 'statistics':1},
      defaultState: 'search',
      roleName: '部级用户'
    },
    '2': {
      states: {'search':1, 'statistics':1},
      defaultState: 'search',
      roleName: '部级用户'
    },
    '3': {
      states: {'search':1, 'check':1, 'statistics':1},
      defaultState: 'check',
      roleName: '省级用户'
    },
    '4': {
      states: {'search':1, 'check':1, 'statistics':1},
      defaultState: 'check',
      roleName: '市级用户'
    },
    '5': {
      states: {'search':1, 'report':1, 'statistics':1},
      defaultState: 'report',
      roleName: '县级用户'
    }
  },

  DATA_TYPE: {
    '2': "非工程样地",
    '3': "工程样地",
    '4': "非工程草本样方",
    '5': "非工程灌木样方",
    '6': "工程草本样方",
    '7': "工程灌木样方",
    '8': "工程信息",
    '9': "返青期样地",
    '10': "返青期样方",
    '11': "分县牧户调查",
    '12': "分户牧户调查",
    '13': "自然生态调查"
  }
};

module.exports = CONSTANT;
