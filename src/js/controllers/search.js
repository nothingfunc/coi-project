/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp =>
  myApp.controller('searchController', ['$scope', '$rootScope', "$timeout", 'apiService',
  function($scope, $rootScope, $timeout, apiService) {
    var CONST = require('../constant'),
        selectedDataTypeId = 2;
    $scope.CONST = CONST;
    $scope.data = {};
    $scope.state = {};
    $scope.tmp = {};

    $scope.onResetClick = () => {
      $scope.state.checked = {};
      $scope.state.checked.regioncode = true;
      $scope.data.searchParamData = {};
    };
    $scope.setDataType = function(id) {
      selectedDataTypeId = id;
      $scope.data.datatype = CONST.DATA_TYPE[id];
      $scope.state.workTemplate = "search-data-" + id + ".html";
      $scope.data.dataList = [];
      $scope.data.totalRecords = 0;
      $scope.onResetClick();
    }
    $scope.state = {
      checked: {
        regioncode: true
      }
    };

    $scope.onResetClick();
    $scope.data.pageNo = 1;

    //行政区部分事件
    $scope.$watch('tmp.region', region => {
      if(typeof region === 'object') {
        $scope.data.searchParamData.regioncode = region.code;
      }
    });
    //草地类
    $scope.$watch('tmp.grassBType', grassBType => {
      if (typeof grassBType === 'object') {
        $scope.data.searchParamData.GRASS_BG_TYPE = grassBType.TYPE_NAME;
      }
    });
    $scope.data.dataList = [];
    var services = {};
    services['2'] = 'queryFpjByCondition';
    services['4'] = 'queryFwqudByCondition';
    services['5'] = 'queryFbqudByCondition';
    $scope.onSearchDataClick = notNewSearch => {
      if (!notNewSearch) {
        $scope.data.pageNo = 1;
      }
      let postData = {
        needCount: true,
        PageIndex: ($scope.data.pageNo - 1)*CONST.PAGE_SIZE,
        PageSize: CONST.PAGE_SIZE
      };
      for (let o in $scope.data.searchParamData) {
        let state = $scope.state.checked[o];
        if (state && state === true ) {//只有被勾选或不需要勾选的元素才能被发送
          postData[o] = $scope.data.searchParamData[o];
        }
      }
      apiService[services[selectedDataTypeId]] && apiService[services[selectedDataTypeId]](postData).then(res=>{
        var data = res.data;
        if (data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.data;
          $scope.data.totalRecords  = data.count;
        }
      });
    };


    $scope.pageChanged = () => {
      $scope.onSearchDataClick(true);
    };
    //设置默认显示的模板
    $scope.setDataType(2);
  }]);


