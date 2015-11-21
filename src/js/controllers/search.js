/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService',
  function($scope, $rootScope, $timeout, apiService) {
    var CONST = require('../constant');
    $scope.CONST = CONST;
    $scope.data = {};
    $scope.state = {};
    $scope.data.searchParamData = {};
    $scope.setDataType = function(id) {
      $scope.data.datatype = CONST.DATA_TYPE[id];
      $scope.state.workTemplate = "search-data-" + id + ".html";
    }
    $scope.state = {
      yeahChecked: false,
      slopeChecked: false,
      soilTextureChecked: false,
      usePatternChecked: false,
      geomorphologyChecked: false,
      useSituationChecked: false,
      exposureChecked: false,
      checkStateChecked: false,
      hasPushChecked: false
    };
    $scope.data.searchParamData.SURVEY_TIME = (new Date()).getFullYear();
    $scope.data.searchParamData.SLOPE = CONST.OPT_PW[0].value;
    $scope.data.searchParamData.SOIL_TEXTURE = CONST.OPT_TRZD[0].value;
    $scope.data.searchParamData.USE_PATTERN = CONST.OPT_LYFS[0].value;
    $scope.data.searchParamData.GEOMORPHOLOGY = CONST.OPT_DXDM[0].value;
    $scope.data.searchParamData.USE_SITUATION = CONST.OPT_LYZK[0].value;
    $scope.data.searchParamData.EXPOSURE =  CONST.OPT_PX[0].value;
    $scope.data.searchParamData.CHECK_TAG = 0;
    $scope.setDataType(2);
  }]);


