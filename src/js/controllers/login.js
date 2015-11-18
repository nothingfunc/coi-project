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
      apiService.login($scope.loginData).then(res => {
        var data = res.data;
        if(data && data.success == CONST.API_SUCCESS) {
          $state.go('search');
        } else {
          $rootScope.showTips({
            type: 'error',
            msg: data.ErrMsg || '帐号或密码错误'
          });
        }
      })
    };



  }]);
