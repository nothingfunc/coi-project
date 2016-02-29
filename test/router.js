/**
 * Created by chenzhengguo on 2015/7/30.
 * Modified by chenzhengguo on 2016/2/29
 */
var args = process.argv.join('|');
var path = require('path');
var DOCUMENT_ROOT = path.resolve(/\-\-root\|(.*?)(?:\||$)/.test(args) ? RegExp.$1 : process.cwd());
var mock = require("mockjs");
var API_FILE = path.join(DOCUMENT_ROOT, './test/apis.json'); //API路径

var API_ROOT = "/CYJC";
var fs = require('fs');

//express router with mockjs
module.exports = function(req, res, next) {
  fs.readFile(API_FILE, 'utf-8', function(err, content) {
    var apis = JSON.parse(content);
    var data = undefined;
    for(var group in apis) {
      if(apis[group].find(function(reqData) {
          if(req.originalUrl.indexOf(API_ROOT + reqData.url) !== 0) {
            return false;
          }
          var apiRes = reqData.res;
          data = reqData.mock ? mock.mock(apiRes) : apiRes;
          return true;
        }) !== undefined) {
        break;
      }
    }
    data !== undefined ? res.jsonp(data) : res.sendStatus(404);
  });
}
