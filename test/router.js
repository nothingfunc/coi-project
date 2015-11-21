/**
 * Created by chenzhengguo on 2015/7/30.
 */
var args = process.argv.join('|');
var path = require('path');
var DOCUMENT_ROOT = path.resolve(/\-\-root\|(.*?)(?:\||$)/.test(args) ? RegExp.$1 : process.cwd());
var mock = require("mockjs");
var apis = require(path.join(DOCUMENT_ROOT, './test/apis.json')); //读取API

var API_ROOT = "/CYJC";

//express router with mockjs
module.exports = function(req, res, next) {
  console.log(req.query, req.params, req.files);

  var originalUrl = req.originalUrl;
  var data = "";
  for(var group in apis) {
    apis[group].some(function(reqData) {
      var resStr = JSON.stringify(reqData.res);
      if(originalUrl.indexOf(API_ROOT + reqData.url) === 0) {
        if(reqData.mock == true) {
          data = JSON.stringify(mock.mock(JSON.parse(resStr)));
        } else {
          data = resStr;
        }
        return true;
      }
    });
    if(data) {
      break;
    }
  }
  //支持callback
  var callback = req.query['callback'];
  if(callback) {
    res.contentType('application/javascript; charset=UTF-8');
    var callback = encodeURIComponent(callback);
    res.send(callback + "&&" + callback + '(' + data + ')');
  } else {
    res.contentType('application/json; charset=UTF-8');
    res.send(data);
  }
}
