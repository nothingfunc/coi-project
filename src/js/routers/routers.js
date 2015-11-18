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
        template: __inline('/src/js/templates/login.html'),
        controller: 'loginController'
      })
      .state('search', {
        url: '/search',
        template: __inline('/src/js/templates/search.html'),
        controller: 'searchController'
      })
      .state('report', {
        url: '/report',
        template: __inline('/src/js/templates/report.html'),
        controller: 'reportController'
      })
      .state('check', {
        url: '/check',
        template: __inline('/src/js/templates/check.html'),
      })
      .state('statistics', {
        url: '/statistics',
        template: __inline('/src/js/templates/statistics.html'),
      })

      ////ui router demo
      //.state('demo', {
      //  url: "/demo",
      //  templateUrl: __uri("src/js/templates/demo.html")
      //})
      //.state('demo.childpage', {
      //  url: "/childpage",
      //  template: "<br/><h2>Child page</h2><a ui-sref='demo'>Back</a>"
      //})
  }]);
}

