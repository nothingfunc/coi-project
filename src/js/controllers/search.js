/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService',
  function($scope, $rootScope, $timeout, apiService) {
    var CONST = require('../constant');
    console.log(CONST.DATA_TYPE);
    $scope.CONST = CONST;
    $scope.datatype = '数据类型';
    $scope.setDataType = function(id) {
      $scope.datatype = CONST[id];
    }
  }]);


