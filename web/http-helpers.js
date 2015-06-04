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

exports.serveAssets = function(response, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  var ext = asset.substr(asset.indexOf('.') + 1, asset.length);
  var exts = {
    'html':  "text/html",
    'css': "text/css",
    'gif': "image/gif",
    'js': "application/javascript",
    'ico': "image/x-icon"
  };
  headers['Content-Type'] = exts[ext];
  // console.log('asset: ', asset);
  fs.readFile(asset, function (err, data) {
    if (err) throw err;
    exports[callback](response, data);
  });
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

// As you progress, keep thinking about what helper functions you can put here!
