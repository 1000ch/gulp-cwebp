# gulp-cwebp ![GitHub Actions Status](https://github.com/1000ch/gulp-cwebp/workflows/test/badge.svg)

Convert JPG and PNG images to WebP with gulp task.

## Install

```sh
$ npm install --save-dev gulp-cwebp
```

## Usage

This is `gulpfile.js` sample.

```js
const gulp  = require('gulp');
const cwebp = require('gulp-cwebp');

gulp.task('cwebp', function () {
  gulp.src('./fixtures/*')
    .pipe(cwebp())
    .pipe(gulp.dest('./dest/'));
});

gulp.task('default', ['cwebp']);
```

## License

[MIT](https://1000ch.mit-license.org) © [Shogo Sensui](https://github.com/1000ch)
