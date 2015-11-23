/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService',
  function($scope, $rootScope, $timeout, apiService) {
    let CONST = require('../constant'),
        selectedDataTypeId = 2;
    $scope.CONST = CONST;
    $scope.data = {};
    const titlesArr = {
      //非工程start
      "2":[
        {
          "title": "年份",
          "relatedField": "SUVEY_TIME"
        },
        {
          "title": "样地名称",
          "relatedField": "SAMPLE_PLOT_NAME"
        },
        {
          "title": "调查人",
          "relatedField": "SUVEY_PERSON"
        },
        {
          "title": "灌木和高大草本",
          "relatedField": "HAS_BUSH"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        },
        {
          "title": "关联样方",
          "relatedField": "ck_true"
        }
      ],
      "4":[
        {
          "title": "年份",
          "relatedField": "SURVER_TIME"
        },
        {
          "title": "植物盖度",
          "relatedField": "COV_VEGETATION"
        },
        {
          "title": "总产草量鲜重",
          "relatedField": "FWEIGHT_TOTALGRASS"
        },
        {
          "title": "总产草量风干重",
          "relatedField": "DWEIGHT_TOTALGRASS"
        },
        {
          "title": "可食产草量鲜重",
          "relatedField": "FWEIGHT_EATGRASS"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "可食产草量风干重",
          "relatedField": "DWEIGHT_EATGRASS"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      "5":[
        {
          "title": "样方名称",
          "relatedField": "QUADRAT_NAME"
        },
        {
          "title": "年份",
          "relatedField": "SURVER_TIME"
        },
        {
          "title": "总盖度",
          "relatedField": "TOTAL_VEGETATION"
        },
        {
          "title": "总产草量鲜重",
          "relatedField": "FWEIGHT_TOTALGRASS"
        },
        {
          "title": "总产草量风干重",
          "relatedField": "DWEIGHT_TOTALGRASS"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      //非工程end
      //工程start
      "3":[
        {
          "title": "年份",
          "relatedField": "SUVEY_TIME"
        },
        {
          "title": "样地名称",
          "relatedField": "SAMPLE_PLOT_NAME"
        },
        {
          "title": "调查人",
          "relatedField": "SUVEY_PERSON"
        },
        {
          "title": "灌木和高大草本",
          "relatedField": "HAS_BUSH"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        },
        {
          "title": "关联样方",
          "relatedField": "ck_true"
        }
      ],
      "6":[
        {
          "title": "年份",
          "relatedField": "SURVER_TIME"
        },
        {
          "title": "植物盖度",
          "relatedField": "COV_VEGETATION"
        },
        {
          "title": "总产草量鲜重",
          "relatedField": "FWEIGHT_TOTALGRASS"
        },
        {
          "title": "总产草量风干重",
          "relatedField": "DWEIGHT_TOTALGRASS"
        },
        {
          "title": "可食产草量鲜重",
          "relatedField": "FWEIGHT_EATGRASS"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "可食产草量风干重",
          "relatedField": "DWEIGHT_EATGRASS"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      "7":[
        {
          "title": "样方名称",
          "relatedField": "QUADRAT_NAME"
        },
        {
          "title": "年份",
          "relatedField": "SURVER_TIME"
        },
        {
          "title": "总盖度",
          "relatedField": "TOTAL_VEGETATION"
        },
        {
          "title": "总产草量鲜重",
          "relatedField": "FWEIGHT_TOTALGRASS"
        },
        {
          "title": "总产草量风干重",
          "relatedField": "DWEIGHT_TOTALGRASS"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECK_STU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ]
      //工程end
    };
    $scope.data.titles = titlesArr['2'];
    $scope.state = {
      checked: {
        regioncode: true
      },
      firstLoad: true
    };

    $scope.onResetClick = () => {
      $scope.state.checked = {};
      $scope.state.checked.regioncode = true;
      $scope.data.searchParamData = {};
      $scope.tmp = {};
    };
    $scope.setDataType = function(id) {
      selectedDataTypeId = id;
      $scope.data.datatype = CONST.DATA_TYPE[id];
      $scope.state.workTemplate = "search-data-" + id + ".html";
      $scope.data.dataList = [];
      $scope.data.totalRecords = 0;
      $scope.onResetClick();
      $scope.data.titles = titlesArr[id];
      $scope.state.firstLoad = true;
    }

    $scope.onResetClick();
    $scope.data.pageNo = 1;

    //行政区部分事件
    $scope.$watch('tmp.region', region => {
      if(typeof region === 'object') {
        $scope.data.searchParamData.regioncode = region.code;
      }
    });
    //草地类
    $scope.$watch('tmp.grassBType', grassBType => {
      if (typeof grassBType === 'object') {
        $scope.data.searchParamData.GRASS_BG_TYPE = grassBType.TYPE_NAME;
      }
    });
    $scope.data.dataList = [];
    var services = {};
    services['2'] = 'queryFpjByCondition';
    services['3'] = 'queryFpjByCondition';
    services['4'] = 'queryFwqudByCondition';
    services['5'] = 'queryFbqudByCondition';
    services['6'] = 'queryFwqudByCondition';
    services['7'] = 'queryFbqudByCondition';
    $scope.onSearchDataClick = notNewSearch => {
      if (!notNewSearch) {
        $scope.data.pageNo = 1;
      }
      let postData = {
        needCount: true,
        PageIndex: ($scope.data.pageNo - 1)*CONST.PAGE_SIZE,
        PageSize: CONST.PAGE_SIZE
      };
      for (let o in $scope.data.searchParamData) {
        let state = $scope.state.checked[o];
        if (state && state === true ) {//只有被勾选或不需要勾选的元素才能被发送
          postData[o] = $scope.data.searchParamData[o];
        }
      }
      $scope.state.firstLoad = false;
      apiService[services[selectedDataTypeId]] && apiService[services[selectedDataTypeId]](postData).then(res=>{
        var data = res.data;
        if (data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.data;
          $scope.data.totalRecords  = data.count;
        }
      });
    };


    $scope.pageChanged = () => {
      $scope.onSearchDataClick(true);
    };
    //设置默认显示的模板
    $scope.setDataType(2);
  }]);


