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
    httpHelper.collectData(request, function(data) {
      var url = data.substr(4);
      //check whether url is in sites.txt
      archive.isUrlInList(url, function(found) {
        if(found) {
          //check whether url is archived
          archive.isUrlArchived(url, function(exists) {
            //load the page if we have it
            if(exists) {
              httpHelper.sendRedirect(response, '/' + url);
            }
            //redirect to loading page if we don't have it
            else {
              httpHelper.sendRedirect(response, '/loading.html');
            }
          });
        }
        //add to sites.txt
        else {
          archive.addUrlToList(url, function() {
            httpHelper.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
  //Handle GET requests (local and AJAX)
  else if(request.method === 'GET') {
    //request local index file (load page)
    var urlPath = pathname === '/' ? '/index.html' : pathname;
    httpHelper.serveAssets(response, urlPath, function() {
      archive.isUrlInList(urlPath.slice(1), function(found) {
        if(found) {
          httpHelper.sendRedirect(response, '/loading.html');
        }
        else {
          httpHelper.send404(response);
        }
      });
    });
  }
};
