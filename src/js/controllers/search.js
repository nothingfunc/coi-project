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
          "title": "样地名称",
          "relatedField": "YDNAME"
        },
        {
          "title": "灌木和高大草本",
          "relatedField": "HAS_BUSH"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECKSTU"
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
          "title": "建设时间",
          "relatedField": "PROJECTTIME"
        },
        {
          "title": "样方名称",
          "relatedField": "YFNAME"
        },
        {
          "title": "工程名称",
          "relatedField": "PROJECTNAME"
        },
        {
          "title": "工程面积",
          "relatedField": "PROJECTAREA"
        },
        {
          "title": "项目投资",
          "relatedField": "PROJECTFINANCE"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECKSTU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      "7":[
        {
          "title": "建设时间",
          "relatedField": "PROJECTTIME"
        },
        {
          "title": "样方名称",
          "relatedField": "YFNAME"
        },
        {
          "title": "工程名称",
          "relatedField": "PROJECTNAME"
        },
        {
          "title": "工程面积",
          "relatedField": "PROJECTAREA"
        },
        {
          "title": "项目投资",
          "relatedField": "PROJECTFINANCE"
        },
        {
          "title": "审核结果",
          "relatedField": "CHECKSTU"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      //工程end
      //返青春 start
      '9': [
        {
          "title": "调查时间",
          "relatedField": "SURVEY_TIME"
        },
        {
          "title": "调查人",
          "relatedField": "SURVEY_PERSON"
        },
        {
          "title": "样地编号",
          "relatedField": "SIMP_NAME"
        },
        {
          "title": "草地类",
          "relatedField": "GRASS_TYPE"
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
      '10': [
        {
          "title": "返青期",
          "relatedField": "GREEN_TIME"
        },
        {
          "title": "样方编号",
          "relatedField": "NAME"
        },
        {
          "title": "东经",
          "relatedField": "LONGITUDE"
        },
        {
          "title": "北纬",
          "relatedField": "LATITUDE"
        },
        {
          "title": "海拔",
          "relatedField": "ELEVATION"
        },
        {
          "title": "主要牧草名称",
          "relatedField": "NAME_MAINGRASS"
        }
      ],
      //返青春 end
      //分县牧户补饲调查 start
      '11': [
        {
          "title": "年份",
          "relatedField": "SURVEY_TIME"
        },
        {
          "title": "调查人",
          "relatedField": "SURVEY_PERSON"
        },
        {
          "title": "家庭承包面积",
          "relatedField": "AREA_FAMILYHOLD"
        },
        {
          "title": "人工草地产草总量",
          "relatedField": "WEIGHT_MENTALG"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      //分县牧户补饲调查 end
      //分户牧户补饲调查 start
      '12': [
        {
          "title": "年份",
          "relatedField": "SURVEY_TIME"
        },
        {
          "title": "调查人",
          "relatedField": "SURVEY_PERSON"
        },
        {
          "title": "户主姓名",
          "relatedField": "HERDSMAN_NAME"
        },
        {
          "title": "家庭承包面积",
          "relatedField": "AREA_FAMILYHOLD"
        },
        {
          "title": "人工草地产草总量",
          "relatedField": "WEIGHT_MENTALG"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ],
      //分户牧户补饲调查 end
      //生态环境调查 start
      '13': [
        {
          "title": "调查时间",
          "relatedField": "SURVEY_TIME"
        },
        {
          "title": "县名称",
          "relatedField": "COUNTY_NAME"
        },
        {
          "title": "草原退化区域",
          "relatedField": "REGION_DEGRA"
        },
        {
          "title": "草原沙化区域",
          "relatedField": "REGION_DESERT"
        },
        {
          "title": "草原盐渍化区域",
          "relatedField": "REGION_SALIN"
        },
        {
          "title": "草原石漠化区域",
          "relatedField": "REGION_ROCK"
        },
        {
          "title": "详细",
          "relatedField": "xx_true"
        }
      ]
      //生态环境调查 end
    };
    $scope.data.titles = titlesArr['2'];
    $scope.state = {
      checked:{},
      firstLoad: true
    };
    var setSomeField = () => {
      if (selectedDataTypeId == '3' || selectedDataTypeId == '6' || selectedDataTypeId == '7') {
        $scope.state.checked.IsInside = true;
        $scope.data.searchParamData.IsInside = "true";
      } else if( selectedDataTypeId == '11') {
        $scope.state.checked.filType = true;
        $scope.state.checked.filValue = true;
        $scope.state.checked.filMinval = true;
        $scope.state.checked.filMaxval = true;
      }
    };
    setSomeField();
    $scope.$watch('state.checked.filFieldName', value => {
        $scope.state.checked.filType = !!value;
        $scope.state.checked.filValue = !!value;
        $scope.state.checked.filMinval = !!value;
        $scope.state.checked.filMaxval = !!value;
    });
    $scope.$watch('state.checked.degra', value => {
      $scope.state.checked.degrafilType = !!value;
      $scope.state.checked.degrafilValue = !!value;
      $scope.state.checked.degrafilMinval = !!value;
      $scope.state.checked.degrafilMaxval = !!value;
    });
    $scope.$watch('state.checked.desert', value => {
      $scope.state.checked.desertfilType = !!value;
      $scope.state.checked.desertfilValue = !!value;
      $scope.state.checked.desertfilMinval = !!value;
      $scope.state.checked.desertfilMaxval = !!value;
    });
    $scope.$watch('state.checked.salin', value => {
      $scope.state.checked.salinfilType = !!value;
      $scope.state.checked.salinfilValue = !!value;
      $scope.state.checked.salinfilMinval = !!value;
      $scope.state.checked.salinfilMaxval = !!value;
    });
    $scope.$watch('state.checked.rock', value => {
      $scope.state.checked.rockfilType = !!value;
      $scope.state.checked.rockfilValue = !!value;
      $scope.state.checked.rockfilMinval = !!value;
      $scope.state.checked.rockfilMaxval = !!value;
    });
    $scope.onResetClick = () => {
      $scope.state.checked = {};
      $scope.data.searchParamData = {year: new Date().getFullYear()};
      setSomeField();
      $scope.tmp = {};
    };
    $scope.setDataType = function(id) {
      selectedDataTypeId = id;
      $scope.data.selectedDataTypeId = id;
      $scope.data.datatype = CONST.DATA_TYPE[id];
      $scope.state.workTemplate = "search-data-" + id + ".html";
      $scope.data.dataList = [];
      $scope.data.totalRecords = 0;
      $scope.onResetClick();
      $scope.data.titles = titlesArr[id];
      $scope.state.firstLoad = true;
    }
    $scope.setDataRelatedType = type => {
      $scope.data.selectedDataRelatedTypeId = type;
      $scope.data.dataRelatedType = CONST.DATA_TYPE[type];
      $scope.state.workRelatedTemplate = "search-data-" + type + ".html";
      $scope.data.dataRelatedList = [];
      $scope.data.titlesRelated = titlesArr[type];
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
    services['3'] = 'QueryPjByCondition';
    services['4'] = 'queryFwqudByCondition';
    services['5'] = 'queryFbqudByCondition';
    services['6'] = 'QueryPwqudByCondition';
    services['7'] = 'QueryPbqudByCondition';
    services['9'] = 'QueryGreenSampleByCondition';
    services['10'] = 'QueryGreenqudBySmpId';
    services['11'] = 'QuerySupfeedCouByCondition';
    services['12'] = 'QuerySupfeedPerByCondition';
    services['13'] = 'QueryEnvsurvByCondition';
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
        } else {
          $scope.data.dataList = [];
          $scope.data.totalRecords  = 0;
        }
      });
    };


    $scope.pageChanged = () => {
      $scope.onSearchDataClick(true);
    };
    $scope.onDataDetailClick = (missionId, dataId, dataType) => {
      apiService.getDataDetail({
        DATA_ID: dataId,
        DATA_TYPE: dataType
      }).success(data => {
        if (data.success === CONST.API_SUCCESS) {
          $uibModal.open({
            templateUrl: 'data-detail-dialog.html',
            size: 'lg',
            controller: ['$scope', '$uibModalInstance', '$q', function($scope, $uibModalInstance, $q) {
              var STATES = {
                'CREATE_TASK': 0,
                'VIEW_DATA_LIST': 1,
                'VIEW_DATA': 2,
                'CREATE_DATA': 3,
                'EDIT_DATA': 4,
                'CHECK_DATA': 9,

                //----project state
                'VIEW_PROJECT': 101,
                'NO_PROJECT': 103
              };

              $scope.STATES = STATES;

              $scope.state = {};
              $scope.tmp = {
                type: dataType
              };
              $scope.projectTmp = {};

              /**
               * 获取工程信息数据，该方法仅在工程样地时使用！
               */
              var getProjectList = forceReload => {
                var deferred = $q.defer();
                if(!forceReload && $scope.data.projectList !== undefined) {
                  return ;
                }
                apiService.getAllProjectInfo().success(res => {
                  if(res.success === CONST.API_SUCCESS) {
                    $scope.data.projectList = res.data;
                  } else {
                    $scope.data.projectList = [];
                  }
                  deferred.resolve();
                });
                return deferred.promise;
              };
              $scope.$watch('state.currentDataType', type => {
                if(type == 3) {
                  getProjectList();
                }
              });
              $scope.onSelectProjectClick = project => {
                $scope.state.projectState = STATES.VIEW_PROJECT;
                $scope.data.projectParam = project;
                $scope.projectTmp.region = project.COUNTY_CODE ? {
                  code: project.COUNTY_CODE,
                  name: project.COUNTY_NAME
                } : '';
                $scope.data.dataParam.PROJECT_ID = project.DATA_ID;
              };
              var setCurrentProject = projectId => {
                console.log(projectId, $scope.state.projectState)
                $scope.data.projectList.some(item => {
                  if(projectId == item.DATA_ID) {
                    $scope.onSelectProjectClick(item);
                  }
                });
              }

              $scope.data = {
                dataParam: data.Data
              };
              $scope.tmp._img = $rootScope.getDataImg(missionId, dataId, '00');
              $scope.tmp._img1 = $rootScope.getDataImg(missionId, dataId, '01');
              $scope.tmp._img2 = $rootScope.getDataImg(missionId, dataId, '02');

              data.Data.COUNTY_CODE && ($scope.tmp.region = {
                code: data.Data.COUNTY_CODE,
                name: data.Data.COUNTY_NAME
              });
              data.Data.GRASS_BG_TYPE && ($scope.tmp.grassBType = {
                TYPE_NAME: data.Data.GRASS_BG_TYPE,
                TYPE_ID: data.Data.GRASS_BG_TYPE_ID
              });
              data.Data.GRASS_SM_TYPE && ($scope.tmp.grassSType = {
                TYPE_NAME: data.Data.GRASS_SM_TYPE,
                TYPE_ID: data.Data.GRASS_SM_TYPE_ID
              });
              data.Data.GRASS_TYPE && ($scope.tmp.grassBTypeFqq = {
                TYPE_NAME: data.Data.GRASS_TYPE,
                TYPE_ID: data.Data.GRASS_TYPE_ID
              });
              data.Data.I_GRASS_BG_TYPE && ($scope.tmp.grassBType1 = {
                TYPE_NAME: data.Data.I_GRASS_BG_TYPE,
                TYPE_ID: data.Data.I_GRASS_BG_TYPE_ID
              });
              data.Data.I_GRASS_SM_TYPE && ($scope.tmp.grassSType1 = {
                TYPE_NAME: data.Data.I_GRASS_SM_TYPE,
                TYPE_ID: data.Data.I_GRASS_SM_TYPE_ID
              });
              data.Data.O_GRASS_BG_TYPE && ($scope.tmp.grassBType2 = {
                TYPE_NAME: data.Data.O_GRASS_BG_TYPE,
                TYPE_ID: data.Data.O_GRASS_BG_TYPE_ID
              });
              data.Data.O_GRASS_SM_TYPE && ($scope.tmp.grassSType2 = {
                TYPE_NAME: data.Data.O_GRASS_SM_TYPE,
                TYPE_ID: data.Data.O_GRASS_SM_TYPE_ID
              });

              $scope.state = {
                currentDataType: dataType,
                workState: 2,
                currentData: dataId
              };

              //如果type是3，就设置他的工程信息
              if(dataType == '3') {
                if(!$scope.data.projectList) {
                  $scope.$watch('data.projectList', () => {
                    $scope.data.projectList && setCurrentProject(data.Data.PROJECT_ID);
                  })
                } else {
                  setCurrentProject(data.Data.PROJECT_ID);
                }
              }

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


    //获取非关联样方cancel
    $scope.toggleRelatedData = (open, item) => {
      if(!open) {
        return false;
      }
      var dataRelatedType = '4';
      if(selectedDataTypeId == '2') {
        dataRelatedType = item.HAS_BUSH === '无' ? '4' : '5';
      } else if (selectedDataTypeId == '3') {
        dataRelatedType = item.HAS_BUSH === '无' ? '6' : '7';
      } else if (selectedDataTypeId == '9') {
        dataRelatedType = '10';
      }
      $scope.setDataRelatedType(dataRelatedType);
      if (selectedDataTypeId == '2') {
        apiService.queryFqudBySmpId({
          HAS_BUSH: item.HAS_BUSH,
          DATA_ID: item.DATA_ID
        }).success(res => {
          $scope.data.dataRelatedList = res.data;
        });
      } else if (selectedDataTypeId == '9') {
        apiService.QueryGreenqudBySmpId({
          SIMP_ID: item.DATA_ID
        }).success(res => {
          $scope.data.dataRelatedList = res.data;
        });
      } else {
        apiService.QueryPqudBySmpId({
          HAS_BUSH: item.HAS_BUSH=='有'?true:false,
          DATA_ID: item.YDH
        }).success(res => {
          $scope.data.dataRelatedList = res.data;
        });
      }


    }

  }]);


