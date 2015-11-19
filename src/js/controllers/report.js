/**
 * Created by zhengguo.chen on 2015/11/17.
 */

var CONST = require('../constant');
module.exports = myApp => {
  myApp.controller('reportController', ['$scope', '$rootScope', "$timeout", "$state", 'apiService',
    function($scope, $rootScope, $timeout, $state, apiService) {
      $scope.data = {};
      $scope.state = {
        createTask: false,
        createData: false,
        createTaskFull: false,
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
        $scope.taskParamData = {
          MISSION_CODE: $rootScope.getUserDepts().length ? $rootScope.getUserDepts()[0].deptCode : ""
        };
        $scope.state.createTask = true;
      };

      $scope.onShowDataListClick = missionId => {
        $scope.state.createTask = false;
        $scope.state.currentTask = missionId;
        getDataList(missionId);
      };

      $scope.cancelCreateTask = () => {
        $scope.taskParamData = {};
        $scope.state.createTask = false;
      };

      $scope.createTask = () => {
        apiService.createNewMission($scope.taskParamData).then(res => {
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

      $scope.onCreateDataClick = type => {
        $scope.state.createData = true;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
        //$scope.data.
        $scope.data.createTaskData = {
          hello: 'world'
        };
      };

      $scope.onShowTaskClick = () => {
        $scope.state.createTask = false;
        $scope.state.createData = false;
        $scope.state.currentData = null;
      }

      $scope.onShowDataClick = (dataId, type) => {
        $scope.state.currentData = dataId;
        $scope.state.workTemplate = 'show-data-' + type + '.html';
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
      }

      var getDataImg = type => {
        var DATA_TAG = '00';
        if('3,6,7,8'.indexOf(type) !== -1) {
          DATA_TAG = '01';
        }
        return CONF.baseUrl + '/util/ShowPhoto.action' +
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
