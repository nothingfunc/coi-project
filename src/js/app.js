//var angular = require('angular');

//======三方组件依赖======
require('ngReact');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-ui-select');

var myApp = angular.module('grassland-project', ['react', 'ui.router', 'ui.bootstrap', 'ui.select']);

//======自身组件依赖======
//router
require('./routers/routers')(myApp);
//directives
require('./directives/utils')(myApp);
//controllers
require('./controllers/root')(myApp);
require('./controllers/login')(myApp);
require('./controllers/search')(myApp);
require('./controllers/report')(myApp);
//services
require('./services/api')(myApp);
//page components
require('./components/about')(myApp);
require('./components/home')(myApp);

angular.bootstrap(document, [myApp.name]);
