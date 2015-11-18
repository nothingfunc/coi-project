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
      $scope.paramData = {};

      apiService.getAllUnSubMission().then(res => {
        var data = res.data;

        if(data.success === CONST.API_SUCCESS) {
          $scope.data.missions = data.rows;
        }


      });


    }
  ]);
