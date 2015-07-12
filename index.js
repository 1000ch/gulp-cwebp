var spawn   = require('child_process').spawn;
var through = require('through2');
var cwebp = require('cwebp-bin');

module.exports = function (options) {

  options = options || {};

  return through.obj(function (file, encode, callback) {

    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new Error('gulp-cwebp: Streaming is not supported'));
      return;
    }

    var error  = '';
    var bytes  = [];
    var length = 0;

    var args = [];
    Object.keys(options).forEach(function (key) {
      args.push('-' + key);
      args.push(options[key]);
    });

    var childProcess = spawn(cwebp, args);

    childProcess.stderr.setEncoding('utf8');
    childProcess.stderr.on('data', function (data) {
      error += data;
    });

    childProcess.stdout.on('data', function (data) {
      bytes.push(data);
      length += data.length;
    });

    childProcess.on('error', function (error) {
      error.fileName = file.path;
      callback(error);
      return;
    });

    childProcess.on('close', function (code) {
      if (code) {
        error = new Error(error);
        error.fileName = file.path;
        callback(error);
        return;
      }

      if (length < file.contents.length) {
        file.contents = Buffer.concat(bytes, length);
      }

      callback(null, file);
    });

    childProcess.stdin.on('error', function (stdinError) {
      if (!error) {
        error = stdinError;
      }
    });

    childProcess.stdin.end(file.contents);
  });
};