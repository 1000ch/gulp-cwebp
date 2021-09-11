import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import Vinyl from 'vinyl';
import isWebP from 'is-webp';
import cwebp from '../index.js';

test.cb('should convert PNG images', t => {
  const png = fileURLToPath(new URL('fixtures/test.png', import.meta.url));
  const webp = fileURLToPath(new URL('fixtures/test.webp', import.meta.url));
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(png);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: png,
    contents: buffer,
  }));
});

test.cb('should convert JPG images', t => {
  const jpg = fileURLToPath(new URL('fixtures/test.jpg', import.meta.url));
  const webp = fileURLToPath(new URL('fixtures/test.webp', import.meta.url));
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(jpg);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: jpg,
    contents: buffer,
  }));
});

test.cb('should skip unsupported images', t => {
  const bmp = fileURLToPath(new URL('fixtures/test.bmp', import.meta.url));
  const stream = cwebp({lossless: true});

  stream.end(new Vinyl({
    path: bmp,
    contents: null,
  }));

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.on('end', () => t.end());
});
