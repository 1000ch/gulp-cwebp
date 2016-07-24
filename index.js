'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const execBuffer = require('exec-buffer');
const cwebp = require('cwebp-bin');

module.exports = options => through.obj(function(file, encode, callback) {
  if (file.isNull()) {
    this.push(file);
    return callback();
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError('gulp-cwebp', 'Streaming not supported'));
    return callback();
  }

  const extension = path.extname(file.path).toLowerCase();

  if (['.jpg', '.jpeg', '.png'].indexOf(extension) === -1) {
    gutil.log('gulp-cwebp: Skipping unsupported image ' + gutil.colors.blue(file.relative));
    return callback();
  }

  const args = [];
  Object.keys(Object.assign({}, options)).forEach(key => {
    args.push(`-${key}`);
    args.push(options[key]);
  });
  args.push('-o', execBuffer.output, execBuffer.input);

  execBuffer({
    input : file.contents,
    bin   : cwebp,
    args  : args
  }).then(buffer => {
    file.contents = buffer;
    file.path = gutil.replaceExtension(file.path, '.webp');
    this.push(file);
    callback();
  }).catch(error => {
    callback(new gutil.PluginError('gulp-cwebp', error));
  });
});
