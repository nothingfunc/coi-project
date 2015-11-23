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
        'EDIT_DATA': 4,
        'CHECK_DATA': 9
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

      var getMissions = () => apiService.getAllUnSubMission().success(data => {
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.missions = data.rows;
        } else {
          $scope.data.missions = [];
        }
      });
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
              getMissions();
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
        $scope.tmp = {};

        //子类非工程样方需要设置SAMPLE_PLOT_ID，标识父级
        $scope.data.dataParam = {SAMPLE_PLOT_ID: $scope.data.dataParam ? $scope.data.dataParam.SAMPLE_PLOT_ID : undefined};
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

            console.log($scope.tmp);

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


      var getDataImg = (type = '00') => {
        return CONF.baseUrl + '/util/ShowPhoto.action?' +
        $.param({
          MISSION_ID: $scope.state.currentTask,
          DATA_ID: $scope.state.currentData,
          DATA_TAG: type,
          TIMES: (new Date().getTime())
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
          //regionTimer = $timeout(() => $scope.tmp.region = "", 100);
        }
      }
      //行政区部分事件（工程区内）
      $scope.$watch('tmp.region1', region => {
        if(typeof region === 'object') {
          $scope.data.dataParam.I_COUNTY_CODE = region.code;
          $scope.data.dataParam.I_COUNTY_NAME = region.name;
          $timeout.cancel(regionTimer1);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.I_COUNTY_CODE = '';
          $scope.data.dataParam.I_COUNTY_NAME = '';
        }
      });
      var regionTimer1 ;
      $scope.onRegionBlur = () => {
        if(!$scope.data.dataParam.COUNTY_CODE) {
          //regionTimer2 = $timeout(() => $scope.tmp.region = "", 100);
        }
      }
      //行政区部分事件（工程区外）
      $scope.$watch('tmp.region2', region => {
        if(typeof region === 'object') {
          $scope.data.dataParam.O_COUNTY_CODE = region.code;
          $scope.data.dataParam.COUNTY_NAME = region.name;
          $timeout.cancel(regionTimer2);
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.O_COUNTY_CODE = '';
          $scope.data.dataParam.O_COUNTY_NAME = '';
        }
      });
      var regionTimer2 ;
      $scope.onRegionBlur = () => {
        if(!$scope.data.dataParam.COUNTY_CODE) {
          //regionTimer2 = $timeout(() => $scope.tmp.region = "", 100);
        }
      }

      //草地类事件
      $scope.$watch('tmp.grassBType', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_BG_TYPE = '';
          $scope.data.dataParam.GRASS_BG_TYPE_ID = '';
        }
      });
      //草地类事件（工程区内）
      $scope.$watch('tmp.grassBType1', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.I_GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.I_GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.I_GRASS_BG_TYPE = '';
          $scope.data.dataParam.I_GRASS_BG_TYPE_ID = '';
        }
      });
      //草地类事件（工程区外）
      $scope.$watch('tmp.grassBType2', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.O_GRASS_BG_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.O_GRASS_BG_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.O_GRASS_BG_TYPE = '';
          $scope.data.dataParam.O_GRASS_BG_TYPE_ID = '';
        }
      });


      //草地型事件
      $scope.$watch('tmp.grassSType', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.GRASS_SM_TYPE = '';
          $scope.data.dataParam.GRASS_SM_TYPE_ID = '';
        }
      });
      //草地型事件（工程区内）
      $scope.$watch('tmp.grassSType1', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.I_GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.I_GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.I_GRASS_SM_TYPE = '';
          $scope.data.dataParam.I_GRASS_SM_TYPE_ID = '';
        }
      });
      //草地型事件（工程区外）
      $scope.$watch('tmp.grassSType2', type => {
        if(typeof type === 'object') {
          $scope.data.dataParam.O_GRASS_SM_TYPE = type.TYPE_NAME;
          $scope.data.dataParam.O_GRASS_SM_TYPE_ID = type.TYPE_ID;
        } else if($scope.data.dataParam) {
          $scope.data.dataParam.O_GRASS_SM_TYPE = '';
          $scope.data.dataParam.O_GRASS_SM_TYPE_ID = '';
        }
      });

    }
  ]);

}
