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
    $templateCache.put("create-data-3.html", __inline('./create-data-3.html'));
    $templateCache.put("create-data-4.html", __inline('./create-data-4.html'));
    $templateCache.put("create-data-5.html", __inline('./create-data-5.html'));
    $templateCache.put("create-data-6.html", __inline('./create-data-6.html'));
    $templateCache.put("create-data-7.html", __inline('./create-data-7.html'));
    $templateCache.put("create-data-9.html", __inline('./create-data-9.html'));
    $templateCache.put("create-data-10.html", __inline('./create-data-10.html'));
    $templateCache.put("create-data-11.html", __inline('./create-data-11.html'));
    $templateCache.put("create-data-12.html", __inline('./create-data-12.html'));
    $templateCache.put("create-data-13.html", __inline('./create-data-13.html'));

    $templateCache.put("data-detail-dialog.html", __inline('./data-detail-dialog.html'));

    $templateCache.put("search-data-list.html", __inline('./search-data-list.html'));
    $templateCache.put("search-data-related-list.html", __inline('./search-data-related-list.html'));
    $templateCache.put("search-data-2.html", __inline('./search-data-2.html'));
    $templateCache.put("search-data-3.html", __inline('./search-data-3.html'));
    $templateCache.put("search-data-4.html", __inline('./search-data-4.html'));
    $templateCache.put("search-data-5.html", __inline('./search-data-5.html'));
    $templateCache.put("search-data-6.html", __inline('./search-data-6.html'));
    $templateCache.put("search-data-7.html", __inline('./search-data-7.html'));
    $templateCache.put("search-data-11.html", __inline('./search-data-11.html'));
    $templateCache.put("search-data-12.html", __inline('./search-data-12.html'));
    $templateCache.put("search-data-13.html", __inline('./search-data-13.html'));


    $templateCache.put("check-form.html", __inline('./check-form.html'));
    $templateCache.put("save-edit-buttons.html", __inline('./save-edit-buttons.html'));

    $templateCache.put("none.html", __inline('./none.html'));

  }]);
};
