import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import Vinyl from 'vinyl';
import isWebP from 'is-webp';
import pEvent from 'p-event';
import cwebp from '../index.js';

test('should convert PNG images', async t => {
  const png = fileURLToPath(new URL('fixtures/test.png', import.meta.url));
  const webp = fileURLToPath(new URL('fixtures/test.webp', import.meta.url));
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(png);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.end(new Vinyl({
    path: png,
    contents: buffer,
  }));

  await pEvent(stream, 'end');
});

test('should convert JPG images', async t => {
  const jpg = fileURLToPath(new URL('fixtures/test.jpg', import.meta.url));
  const webp = fileURLToPath(new URL('fixtures/test.webp', import.meta.url));
  const stream = cwebp({lossless: true});
  const buffer = fs.readFileSync(jpg);

  stream.on('data', file => {
    t.true(isWebP(file.contents));
    t.is(file.path, webp);
  });

  stream.end(new Vinyl({
    path: jpg,
    contents: buffer,
  }));

  await pEvent(stream, 'end');
});

test('should skip unsupported images', async t => {
  const bmp = fileURLToPath(new URL('fixtures/test.bmp', import.meta.url));
  const stream = cwebp({lossless: true});

  stream.end(new Vinyl({
    path: bmp,
    contents: null,
  }));

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  await pEvent(stream, 'end');
});
