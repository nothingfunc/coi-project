/**
 * Created by zhengguo.chen on 2015/11/17.
 */
var CONST = require('../constant');
var $ = require('jquery');

module.exports = myApp =>
  myApp.factory('apiService', ['$http', '$rootScope', '$timeout',
    ($http, $rootScope, $timeout) => {
      const makeService = request => (data, notLoading, noAlert) => {
        !notLoading && $rootScope.loading(true);
        data = data || {};
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
      //登录
      services.login = makeService({method: 'POST', url: '/util/Login.action'});
      services.getSessionInfo = makeService({method: 'POST', url: '/util/GetSessionInfo.action'});
      services.getAllUnSubMission = makeService({method: 'POST', url: '/mission/GetAllUnSubMission.action'});

      return services;
    }
  ]);
