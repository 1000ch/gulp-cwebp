'use strict';

var fs = require('graceful-fs');
var path = require('path');

var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');

var execFile = require('child_process').execFile;
var cwebp = require('cwebp-bin').path;

module.exports = function (options) {

  var options = options ? options : {};

  return through.obj(function (file, enc, callback) {

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

    // create default args
    var dest = gutil.replaceExtension(file.path, '.webp');
    var args = [file.path, '-o', dest];

    // add options to args
    Object.keys(options).forEach(function (key) {
      args.push('-' + key);
      args.push(options[key]);
    });

    try {
      var that = this;
      execFile(cwebp, args, function (error) {
        if (error) {
          return callback(new gutil.PluginError('gulp-cwebp', error));
        }
        fs.readFile(dest, function (error, data) {
          if (error) {
            return callback(new gutil.PluginError('gulp-cwebp', error));
          }
          gutil.log(
            chalk.green('✔ ') + file.relative + ' was converted to ' + chalk.green(dest)
          );

          file.contents = data;
          file.path = dest;

          that.push(file);
          callback();
        });
      });
    } catch (error) {
      this.emit('error', new gutil.PluginError('gulp-cwebp', error));
    }
  });
};