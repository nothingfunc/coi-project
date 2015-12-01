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
          $scope.data.dataList = data.rows;
        } else {
          $scope.data.dataList = [];
        }
      });

      /**
       * 获取工程信息数据，该方法仅在工程样地时使用！
       */
      var getProjectList = forceReload => {
        if(!forceReload && $scope.data.projectList !== undefined) {
          return ;
        }
        apiService.getAllProjectInfo().success(res => {
          if(res.success === CONST.API_SUCCESS) {
            $scope.data.projectList = res.data;
          } else {
            $scope.data.projectList = [];
          }
        });
      };
      $scope.$watch('state.currentDataType', type => {
        console.log('watch type', type);
        if(type == 3) {
          getProjectList();
        }
      });
      //行政区部分事件
      $scope.$watch('tmp.projectRegion', region => {
        if(typeof region === 'object') {
          $scope.data.projectParam.COUNTY_CODE = region.code;
          $scope.data.projectParam.COUNTY_NAME = region.name;
          $timeout.cancel(projectRegionTimer);
        } else if($scope.data.projectParam) {
          $scope.data.projectParam.COUNTY_CODE = '';
          $scope.data.projectParam.COUNTY_NAME = '';
        }
      });
      var projectRegionTimer ;
      $scope.onRegionBlur = () => {
        if(!$scope.data.projectParam.COUNTY_CODE) {
          regionTimer = $timeout(() => $scope.tmp.projectRegion = '', 100);
        }
      }
      $scope.onSelectProjectClick = project => {
        $scope.state.projectState = STATES.VIEW_PROJECT;
        $scope.data.projectParam = project;
        $scope.tmp.projectRegion = project.COUNTY_CODE ? {
          code: project.COUNTY_CODE,
          name: project.COUNTY_NAME
        } : '';
        console.log(project);
      };
      $scope.onCreateProjectClick = () => {
        $scope.data.projectParam = {};
        $scope.state.projectState = STATES.CREATE_PROJECT;
      };
      $scope.onEditProjectClick = () => {
        $scope.state.projectState = STATES.EDIT_PROJECT;
      };
      $scope.onSaveProjectClick = () => {
        $scope.state.projectState = STATES.VIEW_PROJECT;
      };

      $scope.onSubmitTaskClick = (missionId, missionName) => {
        $rootScope.showTips({
          type: 'confirm',
          msg:
          '任务名称：' + missionName +
          '<br/>任务编号：' + missionId +
          '<br/>确定提交该任务？'
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
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentTask = missionId;
        $scope.state.currentTaskName = missionName;
        getDataList(missionId);
      };

      $scope.cancelCreateTask = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
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

      $scope.createTaskFull = () => {
        $scope.state.createTaskFull = !$scope.state.createTaskFull;
      };

      $scope.onShowTaskClick = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentData = null;
      };

      $scope.onCreateDataClick = type => {
        $scope.data.projectParam = null;
        $scope.state.projectState = STATES.NO_PROJECT;

        $scope.tmp = {};

        //子类非工程样方需要设置SAMPLE_PLOT_ID，标识父级
        if('4,5,6,7'.indexOf(type) !== -1) {
          var samplePlotId = $scope.state.currentData;
        }
        $scope.data.dataParam = {
          SAMPLE_PLOT_ID: samplePlotId
        };
        $scope.state.workState = STATES.CREATE_DATA;
        $scope.state.currentDataType = type;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
      };

      $scope.onShowDataClick = (dataId, type) => {
        $scope.tmp = {};
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

            console.log($scope.tmp);

            //获取子列表
            //$scope.getSubDataList();
          }
        })
      };

      $scope.onCancelDataClick = () => {
        if($scope.state.currentDataType == '7' || $scope.state.currentDataType == '6') {
          $scope.state.currentDataType = '3';
        }
        if($scope.state.currentDataType == '5' || $scope.state.currentDataType == '4') {
          $scope.state.currentDataType = '2';
        }
        $scope.showCurrentData();
      };

      $scope.validateData = () => {
        var checkSurveyTime = () => {
          if(!$scope.data.dataParam.SURVEY_TIME) {
            $rootScope.showTips({
              type: 'error',
              msg: '调查时间为空或格式错误'
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
        switch(parseInt($scope.state.currentDataType)) {
          case 2:
            return checkSurveyTime() && checkRegion();
          case 3:
            return checkProject() && checkSurveyTime();
          case 4:
          case 5:
          case 6:
          case 7:
            return checkSurveyTime();
          default:
            return true;
        }
      };

      $scope.onSaveDataClick = () => {
        //格式化时间
        $scope.data.dataParam.SURVEY_TIME = $rootScope.formatTime($scope.data.dataParam.SURVEY_TIME);
        $scope.data.dataParam.COMPLETE_TIME = $rootScope.formatTime($scope.data.dataParam.COMPLETE_TIME);
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

      //草地类事件
      $scope.$watch('tmp.grassBType', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_BG_TYPE = type;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = '';
        }
      });
      //草地类事件（工程区内）
      $scope.$watch('tmp.grassBType1', type => {
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
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_SM_TYPE = type;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = '';
        }
      });
      //草地型事件（工程区内）
      $scope.$watch('tmp.grassSType1', type => {
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
