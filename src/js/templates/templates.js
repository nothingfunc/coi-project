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
    $templateCache.put("create-data-4.html", __inline('./create-data-4.html'));
    $templateCache.put("create-data-5.html", __inline('./create-data-5.html'));



    $templateCache.put("search-data-2.html", __inline('./search-data-2.html'));
    $templateCache.put("search-data-4.html", __inline('./search-data-4.html'));
    $templateCache.put("search-data-5.html", __inline('./search-data-5.html'));


    $templateCache.put("check-form.html", __inline('./check-form.html'));


    $templateCache.put("none.html", __inline('./none.html'));

  }]);
};
