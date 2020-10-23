'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const Vinyl = require('vinyl');
const isWebP = require('is-webp');
const cwebp = require('..');

test.cb('should convert PNG images', t => {
  const png = path.join(__dirname, 'fixtures/test.png');
  const webp = path.join(__dirname, 'fixtures/test.webp');
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(png);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: png,
    contents: buffer
  }));
});

test.cb('should convert JPG images', t => {
  const jpg = path.join(__dirname, 'fixtures/test.jpg');
  const webp = path.join(__dirname, 'fixtures/test.webp');
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(jpg);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: jpg,
    contents: buffer
  }));
});

test.cb('should skip unsupported images', t => {
  const bmp = path.join(__dirname, 'fixtures/test.bmp');
  const stream = cwebp({lossless: true});

  stream.end(new Vinyl({
    path: bmp,
    contents: null
  }));

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.on('end', () => t.end());
});
