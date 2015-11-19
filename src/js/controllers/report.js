/**
 * Created by zhengguo.chen on 2015/11/17.
 */

var CONST = require('../constant');
module.exports = myApp => {
  myApp.controller('reportController', ['$scope', '$rootScope', "$timeout", "$state", 'apiService',
    function($scope, $rootScope, $timeout, $state, apiService) {
      const STATES = {
        'CREATE_TASK': 0,
        'VIEW_DATA_LIST': 1,
        'VIEW_DATA': 2,
        'CREATE_DATA': 3,
        'EDIT_DATA': 4
      };

      $scope.data = {};
      $scope.STATES = STATES;

      $scope.state = {
        createTask: false,
        createData: false,
        createTaskFull: false,
        workState: STATES.VIEW_DATA_LIST,
        currentTask: null,
        currentDataList: null,
        currentData: null
      };

      var getMissions = () => apiService.getAllUnSubMission().then(res => {
        var data = res.data;
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.missions = data.rows;
        }
      });
      getMissions();

      var getDataList = missionId => apiService.getRefDataByMission({
        MISSION_ID: missionId
      }).then(res => {
        var data = res.data;
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.rows;
        }
      });

      $scope.onSubmitTaskClick = missionId => {
        $rootScope.showTips({
          type: 'confirm',
          msg: '任务编号：' + missionId + '<br/>确认提交该任务？'
        }).then(() =>
          console.log(id)
        );
      };

      $scope.onCreateTaskClick = () => {
        $scope.data.userDepts = $rootScope.getUserDepts();
        $scope.data.taskParamData = {
          MISSION_CODE: $rootScope.getUserDepts().length ? $rootScope.getUserDepts()[0].deptCode : ""
        };
        $scope.state.workState = STATES.CREATE_TASK;
      };

      $scope.onShowDataListClick = missionId => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentTask = missionId;
        getDataList(missionId);
      };

      $scope.cancelCreateTask = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
      };

      $scope.createTask = () => {
        $scope.data.taskParamData = {};
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
        $scope.data.dataParam = {};
        $scope.state.workState = STATES.CREATE_DATA;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
      };

      $scope.onShowDataClick = (dataId, type) => {
        $scope.state.workState = STATES.VIEW_DATA;
        $scope.state.currentData = dataId;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
        apiService.getDataDetail({
          DATA_ID: dataId,
          DATA_TYPE: type
        }).then(res => {
          var data = res.data;
          if(data.success === CONST.API_SUCCESS) {
            $scope.data.dataDetail = data.Data;
            $scope.data.dataDetail._img = getDataImg();
          }
        })
      };

      $scope.onCancelDataClick = () => {
        if($scope.state.currentData) {
          $scope.state.workState = STATES.VIEW_DATA;
        } else {
          $scope.state.workState = STATES.VIEW_DATA_LIST
        }
      };

      $scope.onSaveDataClick = () => {
        console.log('save');
      };

      $scope.onEditDataClick = () => {
        $scope.state.workState = STATES.EDIT_DATA;
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
      }

      $scope.onCancelCreateDataClick = () => {
        $scope.state.createData = false;
        $scope.state.currentData = null;
      }

    }
  ]);

}
