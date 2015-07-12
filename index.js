'use strict';

var fs       = require('fs');
var path     = require('path');
var gutil    = require('gulp-util');
var through  = require('through2');
var tempfile = require('tempfile');
var rimraf   = require('rimraf');
var execFile = require('child_process').execFile;
var cwebp    = require('cwebp-bin');

module.exports = function(options) {

  var options = options ? options : {};

  return through.obj(function(file, encode, callback) {

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-cwebp', 'Streaming not supported'));
      return callback();
    }

    if (['.jpg', '.jpeg', '.png'].indexOf(path.extname(file.path).toLowerCase()) === -1) {
      gutil.log('gulp-cwebp: Skipping unsupported image ' + gutil.colors.blue(file.relative));
      return callback();
    }

    var dest = tempfile();
    var args = [file.path, '-o', dest];

    Object.keys(options).forEach(function(key) {
      args.push('-' + key);
      args.push(options[key]);
    });

    execFile(cwebp, args, function(error) {

      if (error) {
        return callback(new gutil.PluginError('gulp-cwebp', error));
      }

      file.contents = fs.readFileSync(dest);
      file.path = gutil.replaceExtension(file.path, '.webp');
      this.push(file);

      rimraf(dest, function(error) {
        if (error) {
          return callback(new gutil.PluginError('gulp-cwebp', error));
        }

        callback();
      });

    }.bind(this));
  });
};
