/**
 * Created by zhengguo.chen on 2015/11/17.
 */

//rootController，负责公共方法，所有controller的通信和数据共享
var CONST = require("../constant");
module.exports = myApp =>
  myApp.controller('rootController', ['$scope', '$rootScope', '$state', '$timeout', '$q', '$uibModal', 'apiService',
  function($scope, $rootScope, $state, $timeout, $q, $uibModal, apiService) {
    $rootScope.data = {
      states: {},
      user: null
    };
    $rootScope.state = {
      isPageLoaded: true,
      isLoading: false
    };

    $rootScope.resetState = () => {
      $scope.state = {
        sidebarCollapse: false,
        userDropdown: false,
        activeNav: '',
        isLoginPage: true
      };
    };

    $rootScope.loading = toggle => $rootScope.state.isLoading = toggle!==undefined?toggle : true;
    $rootScope.getUser = noAlert => {
      var deferred = $q.defer();
      apiService.getSessionInfo().then(res => {
        var data = res.data;
        if(data.success === CONST.API_SUCCESS) {
          $rootScope.data.user = data;
          deferred.resolve(data);
          CONST.ROLE[data.userRole].STATES.map(state => {
            $rootScope.data.states[state] = 1;
          });
        } else {
          !noAlert && $rootScope.showTips({
            type: 'error',
            msg: data.ErrMsg || '获取用户信息失败'
          });
          deferred.reject();
        }
      })
      return deferred.promise;
    };

    $rootScope.resetState();
    $rootScope.checkSession = noAlert => {
      !$rootScope.data.user && ($rootScope.state.isPageLoaded = false);
      //拉取用户
      return $rootScope.getUser(noAlert).then(
        () => {
          $rootScope.state.isPageLoaded = true;
        },
        () => {
          $rootScope.state.isPageLoaded = true;
          $rootScope.resetState();
          $state.go('login');
        }
      );
    }

    var $modalInstanceErr = null;
    $rootScope.showTips = obj => {
      var type = obj.type || 'info';
      var deferred = $q.defer();
      //临时改动，提示信息用若提示显示
      if(type == "info") {
        $rootScope.showMes(obj.msg);
        return false;
      }
      var modalInstance = $uibModal.open({
        template: __inline('/src/js/templates/tips.html'),
        size: type=="prompt"?"":"sm",
        windowClass: "modal-tips",
        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
          $scope.data = {type:type};
          if(type=='error') {
            //错误窗口只报一个
            if($modalInstanceErr) {
              try{$modalInstanceErr.close()}catch(e){;}
            }
            $modalInstanceErr = $uibModalInstance;
            $scope.data.title = obj.title || '出错了';
            $scope.data.msg = obj.msg || '您的请求失败了，请重试或联系管理员';
            $scope.data.btnOkTitle = "确认";
          } else if(type=='info') {
            $scope.data.title = obj.title || '提示';
            $scope.data.btnOkTitle = "确认";
            $scope.data.msg = obj.msg;
            return false;
          } else if(type=='confirm') {
            $scope.data.title = obj.title || '确认';
            $scope.data.msg = obj.msg || '是否继续?';
            $scope.data.btnOkTitle = obj.btnCancelTitle || "确认";
            $scope.data.btnCancelTitle = obj.btnCancelTitle || "取消";
            $scope.data.cancelBtn = true;
          } else if(type=='prompt') {
            $scope.data.title = obj.title || '请输入';
            $scope.data.msg = obj.msg;
            $scope.data.cancelBtn = true;
            $scope.data.promptInput = obj.promptInput || "";
          }
          modalInstance.result.then(function (result) {
          }, function (reason) {
            if(reason == 'backdrop click' || reason == "escape key press") {
              deferred.reject();
            }
          });
          $scope.ok = function () {
            deferred.resolve($scope.data.promptInput);
            $uibModalInstance.close();
          };
          $scope.cancel = function () {
            deferred.reject();
            $uibModalInstance.dismiss('cancel');
          };
        }]
      });
      return deferred.promise;
    };

    //页面事件
    $scope.onSidebarCollapseClick = () => $scope.state.sidebarCollapse = !$scope.state.sidebarCollapse;
    $scope.onUserDropdownClick = () => $scope.state.userDropdown = !$scope.state.userDropdown;
    $scope.onLogoutClick = () => {
      //ajax @todo
      $rootScope.loading();
      $timeout(() => {
        $rootScope.loading(false);
        $state.go('login');
      }, 100);
    }

    //路由改变时修改activeNav
    $scope.$on("$stateChangeStart", function(event, toState, toStateParam, fromState) {
      $scope.state.activeNav = toState.name;
      $scope.state.isLoginPage = toState.name === 'login'

      //session检查
      if(toState.name !== 'login' && (!fromState.name || fromState.name === 'login')) {
        if(!fromState.name) {
          $rootScope.checkSession(true);
        } else if(fromState.name === 'login') {
          $rootScope.checkSession().then(() => {
            var role = $rootScope.data.user.userRole;
            $state.go(CONST.ROLE[role].DEFAULT_STATE);
          })
        }
      } else if(toState.name === 'login') {
        $rootScope.state.isPageLoaded = true;
        $rootScope.resetState();
      } else {
        if(!$rootScope.data.states[toState.name]) {
          console.log('xxx');
          event.stopPropagation();

        }
      }

    });

  }]);
