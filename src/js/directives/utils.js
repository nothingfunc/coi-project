var $ = require('jquery');
require('jquery-icheck');
require('jquery-mousewheel');
require('jquery-perfect-scrollbar');

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
      $element.parent().removeClass('disabled');
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

  //box-body高度撑满屏幕，并且内部滚动
  myApp.directive('boxAutoScroll', ['$timeout', function($timeout) {
    return {
      link: function($scope, element, attrs) {
        var $ele = $(element);
        var offset = attrs['boxAutoOffset'] ? parseInt(attrs['boxAutoOffset']) : 0;
        var $scrollContent = $ele.find(attrs['boxAutoChild'] || '> .box-body');
        var height = $(window).height() - 132 - 52 + offset;
        var minHeight = 400 + offset;

        $timeout(function() {
          $scrollContent.css({
            height: height,
            overflowY: 'auto',
            minHeight: minHeight
          }).perfectScrollbar({
            suppressScrollX: true
          });
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

  ////生成radio组
  //myApp.directive('radioGroup', ['$timeout', ($timeout) => {
  //  return {
  //    restrict: 'EA',
  //    link: function($scope, element, attrs) {
  //      console.log($scope);
  //    }
  //  };
  //}])

  $(document).on("click", "button, a", function() {
    $(this).blur();
  });
};
