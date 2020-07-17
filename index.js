'use strict';
const path = require('path');
const PluginError = require('plugin-error');
const replaceExt = require('replace-ext');
const through = require('through2');
const execBuffer = require('exec-buffer');
const cwebp = require('cwebp-bin');

module.exports = (options = {}) => through.obj(async (file, encode, callback) => {
  if (file.isNull()) {
    callback(null, file);
    return;
  }

  if (file.isStream()) {
    callback(new PluginError('gulp-cwebp', 'Streaming not supported'));
    return;
  }

  const extension = path.extname(file.path).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
    callback(null, file);
    return;
  }

  const args = ['-o', execBuffer.output, execBuffer.input];
  Object.keys(options).forEach(key => {
    args.push(`-${key}`);
    args.push(options[key]);
  });

  try {
    const buffer = await execBuffer({
      input: file.contents,
      bin: cwebp,
      args
    });

    file.contents = buffer;
    file.path = replaceExt(file.path, '.webp');
    callback();
  } catch (error) {
    callback(new PluginError('gulp-cwebp', error));
  }
});
