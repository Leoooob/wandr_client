var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify-es');
var minify = require('gulp-minify-css');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

gulp.task('default',['watch'],function(){
});

gulp.task('watch', ['browserSync', 'sass', 'css'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass', 'css']);
  // Other watchers
});

/*gulp.task('js', function(){
   gulp.src('app/js/*.js')
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/js/'));
});*/

gulp.task('css', function(){
   gulp.src('app/css/*.css')
   .pipe(concat('style.css'))
   .pipe(minify())
   .pipe(rename('style.min.css'))
   .pipe(gulp.dest('app/build/css/'))
   .pipe(browserSync.reload({
     stream: true
   }));
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    port: 3001,
    server: {
      baseDir: 'app'
    },
  });
});
