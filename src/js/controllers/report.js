/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var CONST = require('../constant');
module.exports = myApp => {
  myApp.controller('reportController', ['$scope', '$rootScope', "$timeout", "$state", '$filter', 'Upload', 'apiService',
    function($scope, $rootScope, $timeout, $state, $filter, Upload, apiService) {
      const STATES = {
        'CREATE_TASK': 0,
        'VIEW_DATA_LIST': 1,
        'VIEW_DATA': 2,
        'CREATE_DATA': 3,
        'EDIT_DATA': 4
      };

      $scope.tmp = {};
      $scope.data = {};
      $scope.STATES = STATES;

      $scope.state = {
        createTaskFull: false,
        workState: STATES.VIEW_DATA_LIST,
        currentTask: null,
        currentTaskName: '',
        currentData: null
      };

      var getMissions = () => apiService.getAllUnSubMission().then(res => {
        var data = res.data;
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.missions = data.rows;
        } else {
          $scope.data.missions = [];
        }
      });
      getMissions();

      var getDataList = missionId => apiService.getRefDataByMission({
        MISSION_ID: missionId
      }).then(res => {
        var data = res.data;
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.rows;
        } else {
          $scope.data.dataList = [];
        }
      });

      $scope.onSubmitTaskClick = (missionId, missionName) => {
        $rootScope.showTips({
          type: 'confirm',
          msg:
          '任务名称：' + missionName +
          '<small>（编号：' + missionId + '）</small>' +
          '<br/>确认提交该任务？'
        }).then(() => {
          //apiService.onSubmitTaskClick();
          getMissions();

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
        apiService.createNewMission($scope.data.taskParamData).then(res => {
          var data = res.data;
          if(data.success = CONST.API_SUCCESS) {
            $scope.cancelCreateTask();
            getMissions();
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
        //子类非工程样方需要设置SAMPLE_PLOT_ID，标识父级
        $scope.data.dataParam = {SAMPLE_PLOT_ID: $scope.data.dataParam ? $scope.data.dataParam.SAMPLE_PLOT_ID : undefined};
        $scope.state.workState = STATES.CREATE_DATA;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
      };

      $scope.onShowDataClick = (dataId, type) => {
        apiService.getDataDetail({
          DATA_ID: dataId,
          DATA_TYPE: type
        }).then(res => {
          var data = res.data;
          if(data.success === CONST.API_SUCCESS) {
            $scope.data.dataParam = {};
            $scope.state.workState = STATES.VIEW_DATA;
            $scope.state.currentData = dataId;
            $scope.state.currentDataType = type;
            $scope.state.workTemplate = 'create-data-' + type + '.html';

            $scope.data.dataParam = data.Data;
            $scope.tmp._img = getDataImg();
            $scope.tmp.region = {
              name: data.Data.COUNTRY_NAME,
              code: data.Data.COUNTRY_CODE
            };
            $scope.tmp.grassBType = {
              TYPE_NAME: data.Data.GRASS_BG_TYPE,
              TYPE_ID: data.Data.GRASS_BG_TYPE_ID
            };
            $scope.tmp.grassSType = {
              TYPE_NAME: data.Data.GRASS_SM_TYPE,
              TYPE_ID: data.Data.GRASS_SM_TYPE_ID
            };

            //获取子列表
            //$scope.getSubDataList();
          }
        })
      };

      $scope.onCancelDataClick = () => {
        $scope.showCurrentData();
      };

      $scope.onSaveDataClick = () => {
        //格式化时间
        $scope.data.dataParam.SURVEY_TIME = $rootScope.formatTime($scope.data.dataParam.SURVEY_TIME);
        $scope.data.dataParam.COMPLETE_TIME = $rootScope.formatTime($scope.data.dataParam.COMPLETE_TIME);
        var isEditing = $scope.state.workState === STATES.EDIT_DATA;
        $rootScope.loading();

        //提交表单通过这里提交
        //三种通用数据
        $scope.data.dataParam.MISSION_ID = $scope.state.currentTask;
        $scope.data.dataParam.DATA_ID = isEditing ? $scope.state.currentData : undefined;
        $scope.data.dataParam.DATA_TYPE = $scope.state.currentDataType;

        var postData = $.extend({FILENAME: $scope.tmp.file}, $scope.data.dataParam);

        Upload.upload({
          url: isEditing ? apiService.updateData.url : apiService.addData.url,
          method: 'POST',
          data: postData
        }).success(function(res, status, headers, config) {
          $rootScope.loading(false);
          $scope.state.workState = STATES.VIEW_DATA;
          if(res.success === CONST.API_SUCCESS) {
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
          $scope.onShowDataClick($scope.state.currentData, $scope.state.currentDataType);
        } else {
          getDataList($scope.state.currentTask);
          $scope.state.workTemplate = 'none.html';
        }
      }

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


      var getDataImg = type => {
        var DATA_TAG = '00';
        if('3,6,7,8'.indexOf(type) !== -1) {
          DATA_TAG = '01';
        }
        return CONF.baseUrl + '/util/ShowPhoto.action?' +
        $.param({
          MISSION_ID: $scope.state.currentTask,
          DATA_ID: $scope.state.currentData,
          DATA_TAG: DATA_TAG,
          TIMES: (new Date().getTime())
        })
      };

      $scope.onCancelCreateDataClick = () => {
        $scope.state.currentData = null;
      };

      //行政区部分事件
      $scope.$watch('tmp.region', region => {
        if(typeof region === 'object') {
          $scope.data.dataParam.COUNTRY_CODE = region.code;
          $scope.data.dataParam.COUNTRY_NAME = region.name;
          $timeout.cancel(regionTimer);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.COUNTRY_CODE = '';
          $scope.data.dataParam.COUNTRY_NAME = '';
        }
      });
      var regionTimer ;
      $scope.onRegionBlur = () => {
        if(!$scope.data.dataParam.COUNTRY_CODE) {
          //regionTimer = $timeout(() => $scope.tmp.region = "", 100);
        }
      }

      //草地类事件
      $scope.$watch('tmp.grassBType', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = type.TYPE_ID;
          $timeout.cancel(onTypeBBlur);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_BG_TYPE = '';
          $scope.data.dataParam.GRASS_BG_TYPE_ID = '';
        }
      });
      var onTypeBBlur ;
      $scope.onTypeBBlur = () => {
        if(!$scope.data.dataParam.GRASS_BG_TYPE_ID) {
          //regionTimer = $timeout(() => $scope.tmp.grassBType = "");
        }
      };

      //草地型事件
      $scope.$watch('tmp.grassSType', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = type.TYPE_ID;
          $timeout.cancel(grassSType);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_SM_TYPE = '';
          $scope.data.dataParam.GRASS_SM_TYPE_ID = '';
        }
      });
      var grassSType ;
      $scope.onTypeSBlur = () => {
        if(!$scope.data.dataParam.GRASS_SM_TYPE_ID) {
          //regionTimer = $timeout(() => $scope.tmp.grassSType = "");
        }
      };


    }
  ]);

}
