'use strict';

var path   = require('path');
var assert = require('power-assert');
var read   = require('vinyl-file').read;
var isWebP = require('is-webp');
var cwebp  = require('../');

it('should convert PNG images', function(callback) {

  var png = path.join(__dirname, '/fixtures/test-png.png');

  read(png, function(error, file) {
    assert(!error);
    var stream = cwebp();

    stream.on('data', function(file) {
      assert(isWebP(file.contents));
    });

    stream.on('end', callback);
    stream.end(file);
  });
});

it('should convert JPG images', function(callback) {

  var jpg = path.join(__dirname, '/fixtures/test-jpg.jpg');

  read(jpg, function(error, file) {
    assert(!error);
    var stream = cwebp();

    stream.on('data', function(file) {
      assert(isWebP(file.contents));
    });

    stream.on('end', callback);
    stream.end(file);
  });
});

it('should skip unsupported images', function(callback) {

  var bmp = path.join(__dirname, '/fixtures/test-bmp.bmp');

  read(bmp, function(error, file) {
    assert(!error);
    var stream = cwebp();

    stream.on('data', function(file) {
      assert.strictEqual(file.contents, null);
    });

    stream.on('end', callback);
    stream.end(file);
  });
});
