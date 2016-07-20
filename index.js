'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const tempfile = require('tempfile');
const rimraf = require('rimraf');
const execFile = require('child_process').execFile;
const cwebp = require('cwebp-bin');

module.exports = function(options) {
  options = options ? options : {};

  return through.obj(function(file, encode, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-cwebp', 'Streaming not supported'));
      return callback();
    }

    const extension = path.extname(file.path).toLowerCase();

    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      gutil.log('gulp-cwebp: Skipping unsupported image ' + gutil.colors.blue(file.relative));
      return callback();
    }

    const dest = tempfile();
    const args = [file.path, '-o', dest];

    Object.keys(options).forEach(key => {
      args.push(`-${key}`);
      args.push(options[key]);
    });

    execFile(cwebp, args, error => {
      if (error) {
        return callback(new gutil.PluginError('gulp-cwebp', error));
      }

      file.contents = fs.readFileSync(dest);
      file.path = gutil.replaceExtension(file.path, '.webp');
      this.push(file);

      rimraf(dest, error => {
        if (error) {
          return callback(new gutil.PluginError('gulp-cwebp', error));
        }

        callback();
      });
    });
  });
};
