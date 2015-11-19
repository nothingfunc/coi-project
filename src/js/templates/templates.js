/**
 * Created by zhengguo.chen on 2015/11/19.
 */
module.exports = myApp => {
  myApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("check.html", __inline('./check.html'));
    $templateCache.put("login.html", __inline('./login.html'));
    $templateCache.put("report.html", __inline('./report.html'));
    $templateCache.put("search.html", __inline('./search.html'));
    $templateCache.put("statistics.html", __inline('./statistics.html'));
    $templateCache.put("tips.html", __inline('./tips.html'));

    $templateCache.put("create-data-2.html", __inline('./create-data-2.html'));
    $templateCache.put("show-data-2.html", __inline('./show-data-2.html'));
  }]);
};
