var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var lazy = require('lazy');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
var initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var readListOfUrls = function(callback){
  //look inside sites.txt and read each URL; return array/object of list
  fs.readFile(paths.list, function(err, data) {
    var sites = data.toString().split('\n');
    if(callback) {
      callback(sites);
    }
  });
};

var isUrlInList = function(url, callback){
  //checks whether a specific URL is contained in sites.txt; return boolean
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });
};

var addUrlToList = function(url, callback){
  //takes URL as string, appends to sites.txt
  console.log('adding to list');
  fs.appendFile(paths.list, url + '\n', function(err) {
    callback();
  });
};

var isURLArchived = function(url, callback){
  //checks whether URL is contained in sites directory
  fs.exists(paths.archivedSites +"/" + url, function(exists){
    callback(exists);
  });
};

downloadUrls = function(URLs){
  //download all URLs in archive/place them in cache
  _.each(URLs, function(url) {
    if(!url) {return; }
    request('http://' + url).pipe(fs.createWriteStrem(exports.paths.archivedSites + "/" + url));
  });
};

exports.paths = paths;
exports.initialize = initialize;
exports.readListOfUrls = readListOfUrls;
exports.isUrlInList = isUrlInList;
exports.addUrlToList = addUrlToList;
exports.isURLArchived = isURLArchived;
exports.downloadUrls = downloadUrls;
