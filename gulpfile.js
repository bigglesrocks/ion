var autoprefixer = require('gulp-autoprefixer'),
  combineMq = require('gulp-combine-mq'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  livereload = require('gulp-livereload'),
  minifycss = require('gulp-minify-css'),
  order = require("gulp-order"),
  path = require('path'),
  rename = require("gulp-rename"),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch');

  // Livereload & webserver
  // ========================================

  // Tiny Webserver + Livereload
  gulp.task('webserver', function() {
   connect.server({
    root: '',
    livereload: true,
   });
  });


gulp.task('styles', function() {
  return gulp.src('assets/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded'}, {sourcemap: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(combineMq())
    .pipe(gulp.dest('assets/css'))
    .pipe(minifycss())
    .pipe(rename(function(path) {
      path.basename += "-min";
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: '/'
    }))
    .pipe(gulp.dest('assets/css'))
});

gulp.task('tStyles', function() {
  return gulp.src('demo/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded'}, {sourcemap: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(combineMq())
    .pipe(gulp.dest('demo'))
    .pipe(minifycss())
    .pipe(rename(function(path) {
      path.basename += "-min";
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: '/'
    }))
    .pipe(gulp.dest('demo'))
});

gulp.task('scripts', function() {
  // Get the files to be included
  return gulp.src("src/**/*.js")
    .pipe(concat('ion.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename('ion-min.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('tScripts', function() {
  // Get the files to be included
  return gulp.src(
    ["bower_components/jquery/dist/jquery.js",
    "bower_components/materialize/js/jquery.easing.1.3.js",
    "bower_components/materialize/extras/noUiSlider/nouislider.js", 
    "bower_components/materialize/js/global.js",
    "bower_components/materialize/js/dropdown.js",
    "bower_components/materialize/js/forms.js", 
    "src/ion.js", 
    "demo/demo.js",])
    .pipe(concat('ion-demo.js'))
    .pipe(gulp.dest('demo'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename('ion-demo-min.js'))
    .pipe(gulp.dest('demo'))
});

gulp.task('fonts', function() {
  return gulp.src(["bower_components/materialize/fonts/**/*"])
    .pipe(gulp.dest('demo/fonts'));
});

gulp.task('demo', function() {
  return gulp.src(["demo/demo.html"])
    .pipe(rename("index.html"))
    .pipe(gulp.dest(""));
});

gulp.task('watch', function() {

  gulp.start('webserver');

  livereload.listen();

  // Watch for changes in source files
  gulp.watch(['demo/*.scss'], ['tStyles']);

  gulp.watch(['src/*.js', 'demo/demo.js'], ['scripts', 'tScripts']);

  gulp.watch(["demo/demo.html"], ['demo']);

  // Watch for changes in 'compiled' files
   gulp.watch(['demo/*.{css,html}', 'demo/ion-demo.js'], function (file) {
       var relPath = '\\' + path.relative('/', file.path);
       gutil.log('File changed: ' + gutil.colors.magenta(relPath));
       livereload.changed(file.path);
       livereload();
   });

});