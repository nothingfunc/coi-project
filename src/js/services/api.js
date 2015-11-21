/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var CONST = require('../constant');
var $ = require('jquery');

module.exports = myApp =>
  myApp.factory('apiService', ['$http', '$rootScope', '$timeout',
    ($http, $rootScope, $timeout) => {
      const makeService = request => (data={}, notLoading, noAlert) => {
        !notLoading && $rootScope.loading(true);
        var promise = $http({
          method: request.method,
          url: CONF.baseUrl + request.url,
          cache: false,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          //GET防止缓存
          params: request.method == 'GET' ? (data ? $.extend({'_':new Date().getTime()}, data): null): null,
          data:  request.method == 'POST' ? (data ? $.param(data): null) : null
        }).success(res => {
          !notLoading && $rootScope.loading(false);
          //if(res.success == CONST.API_ERROR) {
          //  if(!noAlert) {
          //    $rootScope.showTips({
          //      type: 'error',
          //      msg: res.msg
          //    });
          //  }
          //  res.data = null;
          //} else if(res.data === null) {
          //  res.data = {};
          //}
        }).error(res => {
          //passport session out
          if(res === 'InvalidSession') {
            top.location.reload();
          } else {
            !notLoading && $rootScope.loading(false);
            $rootScope.showTips({
              type: 'error'
            });
          }
        });

        return promise;
      }

      var services = {};

      //======初始化各个服务接口======

      //登录------
      services.login = makeService({method: 'POST', url: '/util/Login.action'});
      services.getSessionInfo = makeService({method: 'POST', url: '/util/GetSessionInfo.action'});

      //任务------
      services.getAllUnSubMission = makeService({method: 'POST', url: '/mission/GetAllUnSubMission.action'});
      services.createNewMission = makeService({method: 'POST', url: '/mission/CreateNewMission.action'});
      services.getRefDataByMission = makeService({method: 'POST', url: '/mission/GetRefDataByMission.action'});

      //数据------
      services.getDataDetail = makeService({method: 'POST', url: '/data/GetDataDetail.action'});
      services.addData = makeService({method: 'POST', url: '/data/AddData.action'});
      services.updateData = makeService({method: 'POST', url: '/data/UpdateData.action'});
      //获取非工程样方关联
      services.queryFqudBySmpId = makeService({method: 'POST', url: '/data/QueryFqudBySmpId.action'});
      //获取非工程草本样方列表，w是草本
      services.queryFwqudByCondition = makeService({method: 'POST', url: '/data/QueryFwqudByCondition.action'});
      //获取非工程灌木样方列表，b是灌木
      services.queryFbqudByCondition = makeService({method: 'POST', url: '/data/QueryFbqudByCondition.action'});

      //获取行政区------
      services.regionAutoComp = makeService({method: 'POST', url: '/util/RegionAutoComp.action'});



      return services;
    }
  ]);
