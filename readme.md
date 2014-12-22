# [gulp-cwebp](https://www.npmjs.org/package/gulp-cwebp)

## About

Convert JPG and PNG images to WebP with gulp task.

[![Build Status](https://travis-ci.org/1000ch/gulp-cwebp.svg?branch=master)](https://travis-ci.org/1000ch/gulp-cwebp)
[![NPM version](https://badge.fury.io/js/gulp-cwebp.svg)](http://badge.fury.io/js/gulp-cwebp)
[![Dependency Status](https://david-dm.org/1000ch/gulp-cwebp.svg)](https://david-dm.org/1000ch/gulp-cwebp)
[![devDependency Status](https://david-dm.org/1000ch/gulp-cwebp/dev-status.svg)](https://david-dm.org/1000ch/gulp-cwebp#info=devDependencies)

## Install

```sh
$ npm install --save-dev gulp-cwebp
```

## Usage

This is `gulpfile.js` sample.

```js
var gulp = require('gulp');
var cwebp = require('../');

gulp.task('cwebp', function () {
  gulp.src('./fixtures/*')
    .pipe(cwebp())
    .pipe(gulp.dest('./dest/'));
});

gulp.task('default', ['cwebp']);
```

## License

MIT: http://1000ch.mit-license.org
