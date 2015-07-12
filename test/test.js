'use strict';

var fs     = require('fs');
var path   = require('path');
var assert = require('power-assert');
var gutil  = require('gulp-util');
var cwebp  = require('../index');
var isWebp = require('is-webp');
var read   = require('vinyl-file').read;


it('should convert PNG images', function (callback) {

  this.timeout(false);
  var p = path.join(__dirname, '/fixtures/test-png.png');

  read(p, function (error, file) {
    assert(!error, error);
    console.log(2);
    var stream = cwebp();

    stream.on('data', function (data) {
      assert(isWebp(data.contents));
    });

    stream.on('end', callback);

    stream.end(file);
  });
});

it('should convert JPG images', function (callback) {

  this.timeout(false);
  var p = path.join(__dirname, '/fixtures/test-jpg.jpg');
  var stream = cwebp();

  stream.on('data', function (data) {
    assert(isWebp(data.contents));
    callback();
  });

  stream.write(new gutil.File({
    path: p,
    contents: fs.readFileSync(p)
  }));
});

it('should skip unsupported images', function (callback) {

  var p = path.join(__dirname, '/fixtures/test.bmp');
  var stream = cwebp();

  stream.on('data', function (data) {
    assert.equal(data.contents, null);
    callback();
  });

  stream.write(new gutil.File({
    path: p
  }));
});