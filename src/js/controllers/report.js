/**
 * Created by zhengguo.chen on 2015/11/17.
 */
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
    }
  ]);
