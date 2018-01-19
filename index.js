'use strict';

const fs = require('fs');
const path = require('path');
const PluginError = require('plugin-error');
const colors = require('ansi-colors');
const log = require('fancy-log');
const replaceExtension = require('replace-ext');
const through = require('through2');
const execBuffer = require('exec-buffer');
const cwebp = require('cwebp-bin');

module.exports = options => through.obj(function(file, encode, callback) {
  if (file.isNull()) {
    this.push(file);
    return callback();
  }

  if (file.isStream()) {
    this.emit('error', new PluginError('gulp-cwebp', 'Streaming not supported'));
    return callback();
  }

  const extension = path.extname(file.path).toLowerCase();

  if (['.jpg', '.jpeg', '.png'].indexOf(extension) === -1) {
    log('gulp-cwebp: Skipping unsupported image ' + colors.blue(file.relative));
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
    file.path = replaceExtension(file.path, '.webp');
    this.push(file);
    callback();
  }).catch(error => {
    callback(new PluginError('gulp-cwebp', error));
  });
});
