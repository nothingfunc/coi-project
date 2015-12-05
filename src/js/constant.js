/**
 * Created by zhengguo.chen on 2015/11/18.
 */

var keyMap = arr => arr.map(v => {
  return {
    name: v,
    value: v
  }
});

var arrMap = arr => arr.map((v, i) => {
  return {
    value: i,
    name: v
  }
});
var objKeyValue = obj => {
  let arr = [];
  for (let o in obj) {
    arr.push({
      name: obj[o],
      value: o
    });
  }
  return arr;
};

let years = [],
    curYear = (new Date()).getFullYear();
for (let y=1977; y<=curYear; y++) {
  years.push(y);
}
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
  YEARS: years,

  DATA_TYPE: {
    '2': '非工程样地',
    '4': '非工程草本样方',
    '5': '非工程灌木样方',
    '3': '工程样地',
    '6': '工程草本样方',
    '7': '工程灌木样方',
    '8': '工程信息',
    '9': '返青期样地',
    '10': '返青期样方',
    '11': '分县牧户调查',
    '12': '分户牧户调查',
    '13': '自然生态调查'
  },

  DATA_ZXD: objKeyValue({
    'AREA_FAMILYHOLD' : '家庭承包面积',
    'AREA_MENTALG' : '人工草地面积',
    'WEIGHT_MENTALG' : '人工草地产草总量',
    'WEIGHT_STRAW' : '补饲秸秆等总量',
    'WEIGHT_SILAGE' : '青贮饲料总量',
    'WEIGHT_GRAIN' : '粮食补饲量',
    'DAYS_SUPFEED' : '补饲总天数',
    'DAYS_HERD' : '放牧总天数',
    'NUM_SHEEP' : '绵羊数量',
    'NUM_GOAT' : '山羊数量',
    'NUM_CATTLE' : '牛数量',
    'NUM_HORSE' : '马数量',
    'NUM_CAMEL' : '骆驼数量',
    'NUM_MULE' : '骡数量',
    'NUM_DONKEY' : '驴数量',
    'NUM_ELSEANIMAL' : '其它草食家畜数量'
  }),

  PAGE_SIZE: 20,
  CHECK_STU: arrMap(['未上报', '待市级审核', '市级审核驳回', '待省级审核', '省级审核驳回', '审核完成']),

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
