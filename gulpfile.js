'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
//var ignore = require('gulp-ignore');

var paths = {
  sass: ['./scss/**/*.scss'],
  source: ['www/js/**/*.js']
};

gulp.task('default', ['lint', 'html', 'bundle']);

gulp.task('html', function () {
  gulp.src('www/templates/**/*.html')
      .pipe(templateCache('templates.js', {module: 'statracker', root: 'templates/'}))
      .pipe(gulp.dest('www/js'));
});

gulp.task('bundle', function() {
  return gulp.src('www/js/**/*.js')
      .pipe(concat('statracker.js'))
      .pipe(gulp.dest('www/dist'))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(uglify())
      .pipe(gulp.dest('www/dist'));
});

gulp.task('lint', function() {
  return gulp.src(paths.source)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.config.js',
    singleRun: true
  }, done);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
