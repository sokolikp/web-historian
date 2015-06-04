var path = require('path');
var urlParser = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function(request, response){
  var parts = urlParser.parse(request.url);
  var pathname = parts.pathname;
  var asset;
  //Handle POST requests
  if(request.method === 'POST') {
    httpHelper.collectData(request, function(url) {
      archive.addUrlToList(url.substr(4), function(err) {
        if(err) throw err;
        console.log('Successfully added site to list');

        archive.isURLArchived(url, function(exists){
          if(exists) {
            asset = archive.paths.archivedSites + "/" + url;
            httpHelper.serveAssets(response, asset, 'sendResponse');
          }
          else {
            asset = archive.paths.siteAssets + '/loading.html';
            httpHelper.serveAssets(response, asset, 'sendResponse');
          }
        });


      });
    });
    // asset = archive.paths.siteAssets + '/loading.html';
    // httpHelper.serveAssets(response, asset, 'sendResponse');
  }
  //Handle GET requests (local and AJAX)
  else if(request.method === 'GET') {
    //request local index file (load page)
    if(pathname === '/') {
      asset = archive.paths.siteAssets + '/index.html';
      httpHelper.serveAssets(response, asset, 'sendResponse');
      // requestStatic(request, response, '/index.html');
    }
    //request local style sheet (load page)
    else if(pathname === '/styles.css') {
      asset = archive.paths.siteAssets + pathname;
      httpHelper.serveAssets(response, asset, 'sendResponse');
    }
    // request external page
    else {
      console.log(pathname);
      // console.log("Archived? ", archive.isURLArchived(pathname));
      archive.isURLArchived(pathname, function(exists){
        if(exists) {
          asset = archive.paths.archivedSites + pathname;
          httpHelper.serveAssets(response, asset, 'sendResponse');
        }
        else {
          httpHelper.sendResponse(response, 'error!', 404);
        }
      });
    }
    //   checkArchive(response, file);
    // }
  }
};
