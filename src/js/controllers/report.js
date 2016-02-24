/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var CONST = require('../constant');
module.exports = myApp => {
  myApp.controller('reportController', ['$scope', '$rootScope', "$timeout", "$state", '$q', '$filter', 'Upload', 'apiService',
    function($scope, $rootScope, $timeout, $state, $q, $filter, Upload, apiService) {
      const STATES = {
        'CREATE_TASK': 0,
        'VIEW_DATA_LIST': 1,
        'VIEW_DATA': 2,
        'CREATE_DATA': 3,
        'EDIT_DATA': 4,
        'CHECK_DATA': 9,

        //----project state
        'CREATE_PROJECT': 100,
        'VIEW_PROJECT': 101,
        'EDIT_PROJECT': 102,
        'NO_PROJECT': 103
      };

      $scope.tmp = {};
      $scope.projectTmp = {};
      $scope.data = {};
      $scope.STATES = STATES;

      $scope.state = {
        createTaskFull: false,
        workState: STATES.VIEW_DATA_LIST,
        projectState: STATES.NO_PROJECT,
        currentTask: null,
        currentTaskName: '',
        currentData: null
      };

      var getMissions = () => {
        var deferred = $q.defer();
        apiService.getAllUnSubMission().success(data => {
          if(data.success === CONST.API_SUCCESS) {
            data.rows.map(row => {
              row.__MISSION_TYPE = '1' + row.MISSION_ID.slice(2, 4);
            });
            $scope.data.missions = data.rows;
          } else {
            $scope.data.missions = [];
          }
          deferred.resolve();
        });
        return deferred.promise;
      }
      getMissions();

      var getDataList = missionId => apiService.getRefDataByMission({
        MISSION_ID: missionId
      }).success(data => {
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = $rootScope.sortDataListByParentId(data.rows);
        } else {
          $scope.data.dataList = [];
        }
      });

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
      //行政区部分事件
      $scope.$watch('projectTmp.region', region => {
        if(region == undefined) return;
        if(typeof region === 'object') {
          $scope.data.projectParam.COUNTY_CODE = region.code;
          $scope.data.projectParam.COUNTY_NAME = region.name;
          $timeout.cancel(projectRegionTimer);
        } else if($scope.data.projectParam && region !== undefined) {
          $scope.data.projectParam.COUNTY_CODE = '';
          $scope.data.projectParam.COUNTY_NAME = '';
        }
      });
      var projectRegionTimer ;
      $scope.onProjectRegionBlur = () => {
        if(!$scope.data.projectParam.COUNTY_CODE) {
          projectRegionTimer = $timeout(() => $scope.projectTmp.region = '', 100);
        }
      }
      $scope.onSelectProjectClick = project => {
        $scope.state.projectState = STATES.VIEW_PROJECT;
        $scope.data.projectParam = project;
        $scope.projectTmp.region = project.COUNTY_CODE ? {
          code: project.COUNTY_CODE,
          name: project.COUNTY_NAME
        } : '';
        $scope.data.dataParam.PROJECT_ID = project.DATA_ID;
      };
      $scope.onCreateProjectClick = () => {
        $scope.data.projectParam = {};
        $scope.projectTmp.region = undefined;
        $scope.state.projectState = STATES.CREATE_PROJECT;
      };
      $scope.onEditProjectClick = () => {
        $scope.state.projectState = STATES.EDIT_PROJECT;
      };
      $scope.onSaveProjectClick = () => {
        $scope.data.projectParam.COMPLETE_TIME = $rootScope.formatTime($scope.data.projectParam.COMPLETE_TIME);
        var isEditing = $scope.state.projectState === STATES.EDIT_PROJECT;

        //设置通用数据
        $scope.data.projectParam.MISSION_ID = $scope.state.currentTask;
        $scope.data.projectParam.DATA_ID = isEditing ? $scope.data.projectParam.DATA_ID : undefined;
        $scope.data.projectParam.DATA_TYPE = 8;

        //工程信息校验，type为8
        if(!$scope.validateData(8)) {
          return ;
        }

        apiService[isEditing ? 'updateData' : 'addData']($scope.data.projectParam).success(res => {
          if(res.success === CONST.API_SUCCESS) {
            $scope.state.projectState = STATES.VIEW_PROJECT;
            if(!isEditing) {
              getProjectList(true).then(() => {
                setCurrentProject(res.DATA_ID);
              });
            } else {
              getProjectList(true);
            }

          }
        })


        //$scope.state.projectState = STATES.VIEW_PROJECT;
      };

      $scope.onSubmitTaskClick = (missionId, missionName) => {
        $rootScope.showTips({
          type: 'confirm',
          msg:
          '数据包名称：' + missionName +
          '<br/>数据包编号：' + missionId +
          '<br/>确定提交该数据包？'
        }).then(() => {
          apiService.submitMission({MISSION_ID: missionId}).success(res => {
            if(res.success === CONST.API_SUCCESS) {
              getMissions().then(() => {
                if(!$scope.data.missions.some(item => {
                  if($scope.state.currentTask == item.MISSION_ID) {
                    getDataList($scope.state.currentTask);
                    return true;
                  }
                })) {
                  $scope.state.currentTask = null;
                  $scope.state.currentTaskName = null;
                  $scope.state.currentData = null;
                  $scope.state.workState = STATES.VIEW_DATA_LIST;
                  $scope.data.dataList = [];
                }
              });
              //$scope.state.currentTask && getDataList($scope.state.currentTask);
            }
          });
        });
      };

      $scope.onCreateTaskClick = () => {
        $scope.data.userDepts = $rootScope.getUserDepts();
        $scope.data.taskParamData = {
          MISSION_CODE: $rootScope.getUserDepts().length ? $rootScope.getUserDepts()[0].deptCode : ""
        };
        $scope.state.workState = STATES.CREATE_TASK;
      };

      $scope.onShowDataListClick = (missionId, missionName) => {
        $scope.state.fullDataView = true;
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentTask = missionId;
        $scope.state.currentTaskName = missionName;
        getDataList(missionId);
      };

      $scope.cancelCreateTask = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
      };

      $scope.filterTaskByType = type => {
        $scope.state.currentTaskFilterType = type;
      };

      $scope.createTask = () => {
        apiService.createNewMission($scope.data.taskParamData).success(data => {
          if(data.success = CONST.API_SUCCESS) {
            $scope.cancelCreateTask();
            getMissions();
            $scope.state.currentTask && getDataList($scope.state.currentTask);
          }
        })
      };

      $scope.createTaskByType = type => {
        //if(type == '102' || type == '103') {
        //  $rootScope.showTips({
        //    type: 'error',
        //    msg: '维护中，暂时不能创建该类型数据包。'
        //  });
        //  return;
        //}

        var index = $scope.data.missions.find(mission => {
          return mission.__MISSION_TYPE == type;
        });
        if(index !== undefined) {
          $rootScope.showTips({
            type: 'error',
            msg: '您的数据包列表中已存在该类型，无法重复创建相同类型的数据包，请先完成并提交。'
          });
          return;
        }
        $rootScope.showTips({
          type: 'confirm',
          msg: '确定创建 <strong>' + CONST.MISSION_TYPE[type] + '</strong> 数据包？'
        }).then(function() {
          apiService.createNewMission({MISSION_TYPE: type}).success(data => {
            if(data.success = CONST.API_SUCCESS) {
              getMissions();
              $scope.state.currentTask && getDataList($scope.state.currentTask);
            }
          })
        });
      };

      $scope.createTaskFull = () => {
        $scope.state.createTaskFull = !$scope.state.createTaskFull;
      };

      $scope.onShowTaskClick = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentData = null;
      };

      $scope.onCreateDataClick = type => {
        $scope.state.fullDataView = true;
        console.log($scope.state.fullDataView)
        $scope.data.projectParam = null;
        $scope.state.projectState = STATES.NO_PROJECT;

        $scope.tmp = {};

        //子类非工程样方需要设置SAMPLE_PLOT_ID，标识父级
        if('4,5,6,7'.indexOf(type) !== -1) {
          var samplePlotId = $scope.state.currentData;
        }
        //子类返青期样方需要设置SIMP_ID，标识父级
        if(type === '10' || type === '16') {
          var simpId = $scope.state.currentData;
        }
        $scope.data.dataParam = {
          SAMPLE_PLOT_ID: samplePlotId,
          SIMP_ID: simpId
        };
        $scope.state.workState = STATES.CREATE_DATA;
        $scope.state.currentDataType = type;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
      };

      var setCurrentProject = projectId => {
        $scope.data.projectList.some(item => {
          if(projectId == item.DATA_ID) {
            $scope.onSelectProjectClick(item);
          }
        });
      }

      $scope.onShowDataClick = (dataId, type, checkStu) => {
        $scope.tmp = {checkStu: checkStu};
        apiService.getDataDetail({
          DATA_ID: dataId,
          DATA_TYPE: type
        }).success(data => {
          if(data.success === CONST.API_SUCCESS) {
            $scope.data.dataParam = {};
            $scope.state.workState = STATES.VIEW_DATA;
            $scope.state.currentData = dataId;
            $scope.state.currentDataType = type;
            $scope.state.workTemplate = 'create-data-' + type + '.html';

            $scope.data.dataParam = data.Data;
            $scope.tmp._img = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '00');
            $scope.tmp._img1 = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '01');
            $scope.tmp._img2 = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '02');

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
            data.Data.S_GRS_B_TYPE && ($scope.tmp.grassBTypeWK = {
              TYPE_NAME: data.Data.S_GRS_B_TYPE,
              TYPE_ID: data.Data.S_GRS_B_TYPE_ID
            });
            data.Data.S_GRS_S_TYPE && ($scope.tmp.grassSTypeWK = {
              TYPE_NAME: data.Data.S_GRS_S_TYPE,
              TYPE_ID: data.Data.S_GRS_S_TYPE_ID
            });

            //如果type是3，就设置他的工程信息
            if(type == '3') {
              if(!$scope.data.projectList) {
                $scope.$watch('data.projectList', () => {
                  $scope.data.projectList && setCurrentProject(data.Data.PROJECT_ID);
                })
              } else {
                setCurrentProject(data.Data.PROJECT_ID);
              }
            }

            //获取子列表
            //$scope.getSubDataList();
          }
        })
      };

      //墒情情况逻辑
      $scope.$watch('data.dataParam.S_SOIL_WT', value => {
        console.log(value);
        if(['好','中','差'].indexOf(value) != -1) {
          $scope.tmp.S_SOIL_WT = '';
        } else {
          $scope.tmp.S_SOIL_WT = 'else';
        }
      });
      $scope.$watch('tmp.S_SOIL_WT', value => {
        if($scope.data.dataParam && value == 'else' && ['好','中','差'].indexOf($scope.data.dataParam.S_SOIL_WT) != -1) {
          $scope.data.dataParam.S_SOIL_WT = '';
        }
      });

      $scope.onCancelDataClick = () => {
        $scope.state.fullDataView = false;

        if($scope.state.workState === STATES.CREATE_DATA) {
          if($scope.state.currentDataType == '7' || $scope.state.currentDataType == '6') {
            $scope.state.currentDataType = '3';
          }
          if($scope.state.currentDataType == '5' || $scope.state.currentDataType == '4') {
            $scope.state.currentDataType = '2';
          }
          if($scope.state.currentDataType == '10') {
            $scope.state.currentDataType = '9';
          }
          if($scope.state.currentDataType == '16') {
            $scope.state.currentDataType = '15';
          }
        }
        $scope.showCurrentData();
      };

      //校验
      $scope.validateData = (type = $scope.state.currentDataType) => {
        var checkSurveyTime = (keyName = 'SURVEY_TIME') => {
          if(!$scope.data.dataParam[keyName]) {
            $rootScope.showTips({
              type: 'error',
              msg: '调查时间为空或格式错误'
            });
            return false;
          }
          return true;
        };
        var checkGreenTime = () => {
          if(!$scope.data.dataParam.GREEN_TIME) {
            $rootScope.showTips({
              type: 'error',
              msg: '返青期为空或格式错误'
            });
            return false;
          }
          return true;
        };
        var checkRegion = () => {
          if(!$scope.data.dataParam.COUNTY_CODE) {
            $rootScope.showTips({
              type: 'error',
              msg: '所在地区不能为空'
            });
            return false;
          }
          return true;
        };
        var checkProjectRegion = () => {
          if(!$scope.data.projectParam.COUNTY_CODE) {
            $rootScope.showTips({
              type: 'error',
              msg: '所在地区不能为空'
            });
            return false;
          }
          return true;
        }
        var checkProject = () => {
          if(!$scope.data.projectParam || !$scope.data.projectParam.DATA_ID) {
            $rootScope.showTips({
              type: 'error',
              msg: '没有选择工程信息'
            });
            return false;
          }
          return true;
        };
        var checkRequire = (keyName, errorMsg) => {
          if(!$scope.data.dataParam[keyName]) {
            $rootScope.showTips({
              type: 'error',
              msg: errorMsg
            });
            return false;
          }
          return true;
        }
        var checkRange = (keyName, min, max, errorMsg) => {
          var value = parseFloat($scope.data.dataParam[keyName]);
          if(isNaN(value) || value < min || value > max) {
            $rootScope.showTips({
              type: 'error',
              msg: errorMsg
            });
            return false;
          } else {
            $scope.data.dataParam[keyName] = value;
            return true;
          }
        }
        var checkRangeInt = (keyName, min, max, errorMsg) => {
          var value = parseInt($scope.data.dataParam[keyName]);
          if(isNaN(value) || value < min || value > max) {
            $rootScope.showTips({
              type: 'error',
              msg: errorMsg
            });
            return false;
          } else {
            $scope.data.dataParam[keyName] = value;
            return true;
          }
        }
        switch(parseInt(type)) {
          case 2:
            return checkSurveyTime() &&
                checkRequire('SURVEY_PERSON', '调查人不能为空') &&
                checkRequire('SAMPLE_PLOT_NAME', '样地编号不能为空') &&
                checkRegion() &&
                checkRequire('TOWN_NAME', '乡镇不能为空') &&
                checkRequire('HAS_BUSH', '具有灌木和高大草木不能为空') &&
                checkRequire('GRASS_BG_TYPE', '草地类不能为空') &&
                checkRequire('GRASS_SM_TYPE', '草地型不能为空') &&
                checkRequire('GEOMORPHOLOGY', '地形地貌不能为空') &&
                checkRequire('SOIL_TEXTURE', '土壤质地不能为空') &&
                checkRequire('EXPOSURE', '坡向不能为空') &&
                checkRequire('SLOPE', '坡位不能为空') &&
                checkRequire('HAS_LITTER', '枯落物情况不能为空') &&
                checkRequire('HAS_SAND', '覆沙情况不能为空') &&
                checkRequire('HAS_EROSION', '地表侵蚀不能为空') &&
                checkRequire('CAUSES_EROSION', '侵蚀原因不能为空') &&
                checkRequire('HAS_SALTALKALI', '盐碱斑不能为空') &&
                checkRequire('RATIO_BARELAND_AREA', '裸地面积比例不能为空') &&
                checkRange('RATIO_BARELAND_AREA', 0, 100, '裸地面积比例范围在0~100') &&
                checkRequire('HAS_SEASONALWATER', '地表有无季节性积水不能为空') &&
                checkRequire('AVE_ANNUALRAINFALL', '年平均降水量不能为空') &&
                checkRange('AVE_ANNUALRAINFALL', 0, Infinity, '年平均降水量应大于0') &&
                checkRequire('USE_PATTERN', '利用方式不能为空') &&
                checkRequire('USE_SITUATION', '利用状况不能为空') &&
                checkRequire('ASSESSMENT', '综合评价不能为空');
          case 9:
          case 11:
          case 12:
          case 13:
            return checkSurveyTime() && checkRegion();
          case 3:
            return checkProject() && checkSurveyTime();
          case 4:
          case 5:
            return checkRange('ELEVATION', 0, 8000, '海拔范围应为0-8000') &&
                checkRange('QUADRAT_AREA', 0, Infinity, '样地面积应大于0') &&
                checkRange('COV_VEGETATION', 0, 100, '植被盖度范围应为0-100') &&
                checkRange('AVG_GRASSHEIGHT', 0, Infinity, '草群平均高度应大于0') &&
                checkRange('NUM_TYPE_PLANT', 0, 50, '植物种数范围应为0-50') &&
                checkRange('FWEIGHT_TOTALGRASS', 0, Infinity, '产草量应大于0') &&
                checkRange('DWEIGHT_TOTALGRASS', 0, Infinity, '产草量应大于0') &&
                checkRange('FWEIGHT_EATGRASS', 0, Infinity, '产草量应大于0') &&
                checkRange('DWEIGHT_EATGRASS', 0, Infinity, '产草量应大于0')
          case 6:
          case 7:
            return checkSurveyTime();
          case 8:
            return checkProjectRegion();
          case 10:
            return checkGreenTime();
          case 14:
          case 15:
            return checkSurveyTime('S_TIME') &&
                   checkRequire('S_PERSON', '调查人不能为空') &&
                   checkRequire('S_NAME', '数据编号不能为空');
          case 16:
            return checkRequire('S_NAME', '样方编号不能为空');
          default:
            return true;
        }
      };

      $scope.canEdit = () => {
        return $scope.tmp.checkStu == undefined ||
               $scope.tmp.checkStu == '未上报' ||
               $scope.tmp.checkStu == '市审核驳回' ||
               $scope.tmp.checkStu == '省审核驳回';
      };

      $scope.onSaveDataClick = () => {
        //格式化时间
        $scope.data.dataParam.SURVEY_TIME = $rootScope.formatTime($scope.data.dataParam.SURVEY_TIME);
        $scope.data.dataParam.COMPLETE_TIME = $rootScope.formatTime($scope.data.dataParam.COMPLETE_TIME);
        $scope.data.dataParam.GREEN_TIME = $rootScope.formatTime($scope.data.dataParam.GREEN_TIME);
        var isEditing = $scope.state.workState === STATES.EDIT_DATA;

        if(!$scope.validateData()) {
          return ;
        }

        $rootScope.loading();

        //提交表单通过这里提交
        //三种通用数据
        $scope.data.dataParam.MISSION_ID = $scope.state.currentTask;
        $scope.data.dataParam.DATA_ID = isEditing ? $scope.state.currentData : undefined;
        $scope.data.dataParam.DATA_TYPE = $scope.state.currentDataType;

        var fileObj = {};
        $scope.tmp.file && (fileObj.filename = $scope.tmp.file);
        $scope.tmp.file1 && (fileObj.filenamein = $scope.tmp.file1);
        $scope.tmp.file2 && (fileObj.filenameout = $scope.tmp.file2);
        var postData = $.extend(fileObj, $scope.data.dataParam);

        Upload.upload({
          url: isEditing ? apiService.updateData.url : apiService.addData.url,
          method: 'POST',
          data: postData
        }).success(function(res, status, headers, config) {
          $rootScope.loading(false);
          if(res.success === CONST.API_SUCCESS) {
            //console.log(res)
            $scope.state.workState = STATES.VIEW_DATA;
            if(!isEditing) {
              $scope.state.currentData = res.DATA_ID || null;
            }
            $scope.showCurrentData();
          } else {
            res.ErrMsg && $rootScope.showTips({
              type: 'error',
              msg: res.ErrMsg
            });
          }
        }).error(() => {
          $rootScope.loading(false);
        });
      };

      $scope.showCurrentData = () => {
        if($scope.state.currentData && $scope.state.currentDataType) {
          getDataList($scope.state.currentTask);
          $scope.onShowDataClick($scope.state.currentData, $scope.state.currentDataType);
        } else {
          getDataList($scope.state.currentTask);
          $scope.state.workTemplate = 'none.html';
        }
      };

      $scope.onEditDataClick = () => {
        $scope.state.workState = STATES.EDIT_DATA;
      };

      $scope.getSubDataList = () => {
        apiService.queryFqudBySmpId(res => {
          var data = res.data;
          if(data.success === CONST.API_SUCCESS) {
            //$rootScope.
          }
        })
      };

      $scope.onCancelCreateDataClick = () => {
        $scope.state.currentData = null;
      };

      //行政区部分事件
      $scope.$watch('tmp.region', region => {
        if(region == undefined) return;
        if(typeof region === 'object') {
          $scope.data.dataParam.COUNTY_CODE = region.code;
          $scope.data.dataParam.COUNTY_NAME = region.name;
          $timeout.cancel(regionTimer);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.COUNTY_CODE = '';
          $scope.data.dataParam.COUNTY_NAME = '';
        }
      });
      var regionTimer ;
      $scope.onRegionBlur = () => {
        if(!$scope.data.dataParam.COUNTY_CODE) {
          regionTimer = $timeout(() => $scope.tmp.region = "", 100);
        }
      }


      //草地类事件(物候期，枯黄期)
      $scope.$watch('tmp.grassBTypeWK', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.S_GRS_B_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.S_GRS_B_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.S_GRS_B_TYPE = type;
          $scope.data.dataParam.S_GRS_B_TYPE_ID = '';
        }
      });
      //草地类事件
      $scope.$watch('tmp.grassBType', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_BG_TYPE = type;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = '';
        }
      });
      //草地类事件（返青期样地）
      $scope.$watch('tmp.grassBTypeFqq', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_TYPE = type;
          $scope.data.dataParam.GRASS_TYPE_ID = '';
        }
      });
      //草地类事件（工程区内）
      $scope.$watch('tmp.grassBType1', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.I_GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.I_GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.I_GRASS_BG_TYPE = type;
          $scope.data.dataParam.I_GRASS_BG_TYPE_ID = '';
        }
      });
      //草地类事件（工程区外）
      $scope.$watch('tmp.grassBType2', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.O_GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.O_GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.O_GRASS_BG_TYPE = type;
          $scope.data.dataParam.O_GRASS_BG_TYPE_ID = '';
        }
      });


      //草地型事件
      $scope.$watch('tmp.grassSType', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_SM_TYPE = type;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = '';
        }
      });
      //草地类事件(物候期，枯黄期)
      $scope.$watch('tmp.grassSTypeWK', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.S_GRS_S_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.S_GRS_S_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.S_GRS_S_TYPE = type;
          $scope.data.dataParam.S_GRS_S_TYPE_ID = '';
        }
      });
      //草地型事件（工程区内）
      $scope.$watch('tmp.grassSType1', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.I_GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.I_GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.I_GRASS_SM_TYPE = type;
          $scope.data.dataParam.I_GRASS_SM_TYPE_ID = '';
        }
      });
      //草地型事件（工程区外）
      $scope.$watch('tmp.grassSType2', type => {
        if(type == undefined) return;
        if(typeof type === 'object') {
          $scope.data.dataParam.O_GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.O_GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.O_GRASS_SM_TYPE = type;
          $scope.data.dataParam.O_GRASS_SM_TYPE_ID = '';
        }
      });

    }
  ]);

}
