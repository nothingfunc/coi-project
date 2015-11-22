/**
 * Created by zhengguo.chen on 2015/11/17.
 */
module.exports = myApp => {
  myApp.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    // Now set up the states
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'loginController'
      })
      .state('search', {
        url: '/search',
        templateUrl: 'search.html',
        controller: 'searchController'
      })
      .state('report', {
        url: '/report',
        templateUrl: 'report.html',
        controller: 'reportController'
      })
      .state('check', {
        url: '/check',
        templateUrl: 'check.html',
        controller: 'checkController'
      })
      .state('statistics', {
        url: '/statistics',
        templateUrl: 'statistics.html'
      });
  }]);
}

