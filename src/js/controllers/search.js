/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService', '$uibModal',
  function($scope, $rootScope, $timeout, apiService, $uibModal) {
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
      },
      firstLoad: true
    };

    $scope.onResetClick = () => {
      $scope.state.checked = {};
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
    let regionTimer = null;
    $scope.$watch('tmp.region', region => {
      if(typeof region === 'object') {
        $timeout.cancel(regionTimer);
        $scope.data.searchParamData.regioncode = region.code;
      } else {
        delete $scope.data.searchParamData.regioncode;
      }
    });
    $scope.onRegionBlur = () => {
      if (!$scope.tmp.region || !$scope.data.searchParamData.regioncode) {
        delete $scope.data.searchParamData.regioncode;
        regionTimer = $timeout(() => $scope.tmp.region = "", 100);
      }
    };
    $scope.onYearBlur = () => {
      if (!$scope.data.searchParamData.year) {
        delete $scope.data.searchParamData.year;
      }
    };
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
        PageIndex: $scope.data.pageNo - 1,
        PageSize: CONST.PAGE_SIZE
      };
      for (let o in $scope.data.searchParamData) {
        let state = $scope.state.checked[o];
        if (state && state === true ) {//只有被勾选或不需要勾选的元素才能被发送
          postData[o] = $scope.data.searchParamData[o];
        }
      }
      $scope.state.firstLoad = false;
      apiService[services[selectedDataTypeId]] && apiService[services[selectedDataTypeId]](postData).success(data=>{
        if (data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.data;
          $scope.data.totalRecords  = data.count;
        }
      });
    };


    $scope.pageChanged = () => {
      $scope.onSearchDataClick(true);
    };
    $scope.onDataDetailClick = (dataId) => {
      apiService.getDataDetail({
        DATA_ID: dataId,
        DATA_TYPE: selectedDataTypeId
      }).success(data => {
        if (data.success === CONST.API_SUCCESS) {
          $uibModal.open({
            templateUrl: 'data-detail-dialog.html',
            size: 'lg',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
              $scope.tmp = {
                type: selectedDataTypeId
              };
              $scope.data = {
                dataParam: data.Data
              };

              var getDataImg = (type = '00') => {
                return CONF.baseUrl + '/util/ShowPhoto.action?' +
                  $.param({
                    MISSION_ID: '',
                    DATA_ID: dataId,
                    DATA_TAG: type,
                    TIMES: (new Date().getTime())
                  })
              };

              $scope.tmp._img = getDataImg();
              $scope.tmp._img1 = getDataImg('01');
              $scope.tmp._img2 = getDataImg('02');

              $scope.tmp.region = data.Data.COUNTY_CODE ? {
                code: data.Data.COUNTY_CODE,
                name: data.Data.COUNTY_NAME
              } : '';

              $scope.tmp.grassBType = data.Data.GRASS_BG_TYPE ? {
                TYPE_NAME: data.Data.GRASS_BG_TYPE,
                TYPE_ID: data.Data.GRASS_BG_TYPE_ID
              } : '';
              $scope.tmp.grassSType = data.Data.GRASS_SM_TYPE ? {
                TYPE_NAME: data.Data.GRASS_SM_TYPE,
                TYPE_ID: data.Data.GRASS_SM_TYPE_ID
              } : '';
              $scope.tmp.grassBType1 = data.Data.I_GRASS_BG_TYPE ? {
                TYPE_NAME: data.Data.I_GRASS_BG_TYPE,
                TYPE_ID: data.Data.I_GRASS_BG_TYPE_ID
              } : '';
              $scope.tmp.grassSType1 = data.Data.I_GRASS_SM_TYPE ? {
                TYPE_NAME: data.Data.I_GRASS_SM_TYPE,
                TYPE_ID: data.Data.I_GRASS_SM_TYPE_ID
              } : '';
              $scope.tmp.grassBType2 = data.Data.O_GRASS_BG_TYPE ? {
                TYPE_NAME: data.Data.O_GRASS_BG_TYPE,
                TYPE_ID: data.Data.O_GRASS_BG_TYPE_ID
              } : '';
              $scope.tmp.grassSType2 = data.Data.O_GRASS_SM_TYPE ? {
                TYPE_NAME: data.Data.O_GRASS_SM_TYPE,
                TYPE_ID: data.Data.O_GRASS_SM_TYPE_ID
              } : '';

              $scope.STATES = {
                'CREATE_TASK': 0,
                'VIEW_DATA_LIST': 1,
                'VIEW_DATA': 2,
                'CREATE_DATA': 3,
                'EDIT_DATA': 4,
                'CHECK_DATA': 9
              };

              $scope.state = {
                currentDataType: selectedDataTypeId,
                workState: 2,
                currentData: dataId
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            }]
          });
        }
      });
    };
    //设置默认显示的模板
    $scope.setDataType(2);
  }]);


