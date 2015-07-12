var gulp = require('gulp');
var cwebp = require('../');

gulp.task('cwebp', function() {
  gulp.src('./fixtures/*')
    .pipe(cwebp())
    .pipe(gulp.dest('./dest/'));
});

gulp.task('default', ['cwebp']);
