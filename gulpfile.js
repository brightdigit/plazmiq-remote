var gulp = require('gulp');
var async = require('async');
var glob = require('glob');
var path = require('path');

var dirpath = path.join(__dirname, "gulp", "**", "*.js");

glob.sync(dirpath).forEach(function (file) {
  require(file)(gulp);
});
