var $ = require('jquery');
require('jquery-icheck');

//存放一些公用的模块
module.exports = myApp => {
  //单选多选按钮重置
  //refer: https://github.com/fronteed/iCheck/issues/62

  //做一个缓冲区，统一设置iCheck
  var icheckCache = [];
  var icheckBuildTimeout = null;
  function buildIcheck() {
    var $element = null;
    while($element = icheckCache.shift()) {
      $element.iCheck();
    }
  }
  myApp.directive('icheck', ['$timeout', '$parse', function($timeout, $parse) {
    return {
      require: 'ngModel',
      link: function($scope, element, $attrs, model) {
        var value = $attrs['value'],
          $element = $(element),
          ngModel = $attrs['ngModel'];

        icheckCache.push($element);
        clearTimeout(icheckBuildTimeout);
        icheckBuildTimeout = setTimeout(buildIcheck);


        $scope.$watch(ngModel, function (newValue, oldValue) {
          if(newValue !== oldValue) {
            $element.iCheck('update');
          }
        });
        $element.on('ifChanged', function (event) {
          if ($element.attr('type') === 'checkbox' && ngModel) {
            $scope.$apply(function () {
              return model.$setViewValue(event.target.checked);
            });
          }
          if ($element.attr('type') === 'radio' && ngModel) {
            return $scope.$apply(function () {
              return model.$setViewValue(value);
            });
          }
        });
      }
    };
  }]);


  //高度自适应
  myApp.directive('elastic', ['$timeout', function($timeout) {
    return {
      link: function($scope, element) {
        var $ele = $(element);
        $timeout(function() {
          $ele.elastic().blur();
        });
      }
    };
  }]);

  //页面切换效果
  myApp.directive('pageToggle', function() {
    return {
      link: function(scope, element, attrs) {
        var $ele = $(element);
        $ele.addClass('animated animated-zing fadeInLeft').one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
          $ele.removeClass('animated  animated-zing fadeInLeft');
        });
      }
    };
  });

  //自动选中
  myApp.directive('autoFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        $timeout(function() {
          $(element).focus();
        });
      }
    };
  }]);

  $(document).on("click", "button, a", function() {
    $(this).blur();
  });
};
