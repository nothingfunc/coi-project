/**
 * Created by zhengguo.chen on 2015/12/10.
 */
//存放一些公用的filter
module.exports = myApp => {
  myApp.filter('eclipseId', () =>
    str => str.replace(/^(\w{10})(.*)(\w{4})$/, '$1...$3')
  );
}
