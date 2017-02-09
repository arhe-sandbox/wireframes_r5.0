var gulp    = require('gulp'),
      gutil    = require('gulp-util'),
      uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');
	
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('*.scss')
        .pipe(sass())
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('*.scss', ['sass']);
})

var csslint = require('gulp-csslint');
 
gulp.task('css', function() {
  gulp.src('src/styles/*.css')
    .pipe(csslint('csslintrc.json'))
    .pipe(csslint.formatter());
});



var browserify = require('gulp-browserify');

gulp.task('browserify1', function () {
  return gulp.src(['./views/vm/browserify/*.js'])
   .pipe(browserify())
   
   .pipe(gulp.dest('./public/javascripts'));
});