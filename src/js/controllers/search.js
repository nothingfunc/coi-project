/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService',
  function($scope, $rootScope, $timeout, apiService) {
    $scope.states = {fname: 'Clark', lname: 'Kent'};
    $scope.actions = {
      onClick: () => {
        $scope.person.fname = 'ssss';
        $timeout();
      }
    }
  }]);


