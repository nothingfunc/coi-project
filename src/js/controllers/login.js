/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var CONST = require('../constant');
module.exports = myApp =>
  myApp.controller('loginController', ['$scope', '$rootScope', '$state', 'apiService',
  function($scope, $rootScope, $state, apiService) {
    $scope.loginData = {
      USERNAME: '',
      USERPWD: ''
    };

    $scope.login = () => {
      apiService.login($scope.loginData).success(data => {
        if(data && data.success == CONST.API_SUCCESS) {
          $rootScope.goHome();
        }
      })
    };



  }]);
