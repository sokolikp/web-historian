var path = require('path');
var urlParser = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
// require more modules/folders here!


var requestsStatic = function (req, res, file) {
  var asset = archive.paths.siteAssets + file;
  httpHelper.serveAssets(res, asset, 'sendResponse');
};

var routes = {
  '/': requestsStatic,
  '/styles.css': requestsStatic
};

exports.handleRequest = function(request, response){
  var parts = urlParser.parse(request.url);
  var file = parts.pathname;
  var route = routes[file];
  console.log("rouuuuuutesss: ", routes, file);
  file = file === '/' ? '/index.html' : file;
  if(route){
    route(request, response, file);
  } else {
    httpHelper.sendResponse(response, "Not Found", 404);
  }
};
