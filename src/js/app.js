/**
 * main
 */

//======三方组件依赖======
//require('ngReact');
require('angular-bindonce');
require('angular-sanitize');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-ui-select');
require('angular-file-upload');
require('angular-bootstrap-lightbox');

var myApp = angular.module('grassland-project',
  [ /*'react',*/
    'pasvaz.bindonce', 'ui.router',
    'ui.bootstrap', 'ui.select',
    'ngFileUpload', 'bootstrapLightbox'
  ]
);

//======自身组件依赖======
//templates
require('./templates/templates')(myApp);
//router
require('./routers/routers')(myApp);
//directives
require('./directives/utils')(myApp);
//controllers
require('./controllers/root')(myApp);
require('./controllers/login')(myApp);
require('./controllers/search')(myApp);
require('./controllers/report')(myApp);
require('./controllers/check')(myApp);
//services
require('./services/api')(myApp);
//react components
//require('./components/about')(myApp);
//require('./components/home')(myApp);

angular.bootstrap(document, [myApp.name]);
