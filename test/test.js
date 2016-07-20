'use strict';

const path = require('path');
const assert = require('assert');
const vf = require('vinyl-file');
const isWebP = require('is-webp');
const cwebp = require('../');

it('should convert PNG images', callback => {
  const png = path.join(__dirname, '/fixtures/test-png.png');
  vf.read(png).then(file => {
    const stream = cwebp();
    stream.on('data', file => {
      assert(isWebP(file.contents));
    });
    stream.on('end', callback);
    stream.end(file);
  });
});

it('should convert JPG images', callback => {
  const jpg = path.join(__dirname, '/fixtures/test-jpg.jpg');
  vf.read(jpg).then(file => {
    const stream = cwebp();
    stream.on('data', file => {
      assert(isWebP(file.contents));
    });
    stream.on('end', callback);
    stream.end(file);
  });
});

it('should skip unsupported images', callback => {
  const bmp = path.join(__dirname, '/fixtures/test-bmp.bmp');
  vf.read(bmp).then(file => {
    const stream = cwebp();
    stream.on('data', file => {
      assert.strictEqual(file.contents, null);
    });
    stream.on('end', callback);
    stream.end(file);
  });
});
