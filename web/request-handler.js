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

var checkArchive = function (res, file) {
  var asset = archive.paths.archivedSites + file;
  console.log(asset);
  fs.readFile(asset, function (err, data) {
    if (err) {
      throw err;
    }
    httpHelper.sendResponse(res, data);
  });
};

var routes = {
  '/': requestsStatic,
  '/styles.css': requestsStatic
  //everything else
};

exports.handleRequest = function(request, response){
  var parts = urlParser.parse(request.url);
  var file = parts.pathname;
  if(request.method === 'POST') {
    console.log("I'm in post with parts ", request, 'and file ', file);
  }
  else if(request.method === 'GET') {
    var route = routes[file];
    file = file === '/' ? '/index.html' : file;
    if(route){
      route(request, response, file);
    } else {
      // console.log(file);
      checkArchive(response, file);
      // httpHelper.sendResponse(response, "Not Found", 404);
    }
  }
};
