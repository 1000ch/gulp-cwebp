'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var cwebp = require('../index');

it('should convert PNG images', function (callback) {
  this.timeout(false);

  var stream = cwebp();

  stream.on('data', function (file) {
    assert.ok(fs.existsSync(file.path));
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test-png.png',
    contents: fs.readFileSync('test/fixtures/test-png.png')
  }));
});

it('should convert JPG images', function (callback) {
  this.timeout(false);

  var stream = cwebp();

  stream.on('data', function (file) {
    assert(fs.existsSync(file.path));
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test-jpg.jpg',
    contents: fs.readFileSync('test/fixtures/test-jpg.jpg')
  }));
});

it('should skip unsupported images', function (callback) {
  var stream = cwebp();

  stream.on('data', function (file) {
    assert.strictEqual(file.contents, null);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + 'fixtures/test.bmp'
  }));
});