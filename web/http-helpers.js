var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.send404 = function(response) {
  exports.sendResponse(response, '404 Page Not Found', 404);

};

exports.sendRedirect = function(response, url) {
  response.writeHead(302, {Location: url});
  // fs.readFile(archive.)
  response.end();
};

exports.serveAssets = function(response, asset, callback) {
  //check public/main folder (for index or style sheet)
  fs.readFile(archive.paths.siteAssets + asset, function(err, data) {
    //if file does not exist, look in archives
    if(err) {
      fs.readFile(archive.paths.archivedSites + asset, function(err, data) {
        //file does not exist in archives - 404 error (or callback)
        if(err) {
          callback ? callback() : exports.send404(response);
        }
        //file exists - serve it
        else {
          exports.sendResponse(response, data);
        }
      });
    }
    //file exists - serve it
    else {
      exports.sendResponse(response, data);
    }
  });
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};

// exports.serveArchive

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

// As you progress, keep thinking about what helper functions you can put here!
