/**
 * Created by zhengguo.chen on 2015/11/18.
 */

var keyMap = arr => arr.map(v => {
  return {
    name: v,
    value: v
  }
});

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

  CHECK_STU: {
    '0': '未上报',
    '1': '待市级审核',
    '2': '市级审核驳回',
    '3': '待省级审核',
    '4': '省级审核驳回',
    '5': '审核完成'
  },

  DATA_TYPE: {
    '2': '非工程样地',
    '3': '工程样地',
    '4': '非工程草本样方',
    '5': '非工程灌木样方',
    '6': '工程草本样方',
    '7': '工程灌木样方',
    '8': '工程信息',
    '9': '返青期样地',
    '10': '返青期样方',
    '11': '分县牧户调查',
    '12': '分户牧户调查',
    '13': '自然生态调查'
  },

  OPT_PW: keyMap(['坡脚', '坡顶', '坡下部', '坡中部', '坡上部']),

  OPT_PX: keyMap(['阳坡', '半阳坡', '半阴坡', '阴坡']),

  OPT_TRZD: keyMap(['沙土', '壤土', '砾石质', '粘土']),

  OPT_DXDM: keyMap(['平原', '丘陵', '山地', '高原', '盆地']),

  OPT_LYFS: keyMap(['打草场', '冷季放牧', '暖季放牧', '春季放牧', '全年放牧', '禁放', '其他']),

  OPT_LYZK: keyMap(['未利用', '轻度利用', '合理利用', '超载', '严重超载']),

  OPT_QSYY: keyMap(['风蚀', '水蚀', '冻蚀', '超载', '其他']),

  OPT_LDMJBL: keyMap(['0~5%', '6~10%', '11~30%', '31~100%']),

  OPT_HAS: keyMap(['有', '无']),

  OPT_ZHPJ: keyMap(['好', '中', '差'])

};

module.exports = CONSTANT;
