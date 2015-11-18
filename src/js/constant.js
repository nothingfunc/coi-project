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
  }
};

module.exports = CONSTANT;
