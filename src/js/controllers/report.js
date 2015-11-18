/**
 * Created by zhengguo.chen on 2015/11/17.
 */

var CONST = require('../constant');
module.exports = myApp =>
  myApp.controller('reportController', ['$scope', '$rootScope', "$timeout", 'apiService',
    function($scope, $rootScope, $timeout, apiService) {
      $scope.props = {
        fname: 'Clark',
        lname: 'Kent',
        onClick: () => {
          $scope.props.fname = 'ssss';
          $timeout();
        }
      };

      $scope.data = {};
      $scope.state = {
        createTask: false,
        createTaskFull: false,
        iconState: "expand",
        createTaskCols: 8
      };
      $scope.taskParamData = {};

      var getMissions = () => apiService.getAllUnSubMission().then(res => {
        var data = res.data;

        if(data.success === CONST.API_SUCCESS) {
          $scope.data.missions = data.rows;
        }
      });

      getMissions();

      $scope.onCreateTaskClick = () => {
        $scope.state.createTask = true;
      }

      $scope.cancelCreateTask = () => {
        $scope.taskParamData = {};
        $scope.state.createTask = false;
      }

      $scope.createTask = () => {
        console.log($scope.taskParamData);
      }
      $scope.createTaskFull = () => {
        if ($scope.state.createTaskFull === false) {
          $scope.state.createTaskFull = true;
          $scope.state.iconState = "compress";
          $scope.state.createTaskCols = 12;
        } else {
          $scope.state.createTaskFull = false;
          $scope.state.iconState = "expand";
          $scope.state.createTaskCols = 8;
        }

      };


    }
  ]);
