'use strict';

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var bower         = require('bower');
var concat        = require('gulp-concat');
var header        = require('gulp-header');
var sass          = require('gulp-sass');
var minifyCss     = require('gulp-minify-css');
var minifyHtml    = require('gulp-minify-html');
var uglify        = require('gulp-uglify');
var rename        = require('gulp-rename');
var sh            = require('shelljs');
var seq           = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var karma         = require('karma').server;
var jshint        = require('gulp-jshint');
var replace       = require('gulp-replace');
var args          = require('yargs').argv;
var fs            = require('fs');
var inject        = require('gulp-inject');
var print         = require('gulp-print');

var paths = {
  sass: ['./scss/**/*.scss'],
  app:  ['www/src/app.js'],
  html: ['www/src/**/*.html']
};

gulp.task('default', function() {
    seq('lint', 'html', 'bundle', 'constants');
});
gulp.task('run-tests', function() {
    seq('lint', 'html', 'bundle', 'test');
});

gulp.task('html', function () {
  gulp.src(paths.html)
      .pipe(minifyHtml({empty:true}))
      .pipe(templateCache('templates.js', {module: 'statracker', root: 'src/'}))
      .pipe(gulp.dest('www/dist'));
});

//gulp constants --env production
gulp.task('constants', function () {
    var env = args.env || 'local';
    var filename = env + '.json';
    var settings = JSON.parse(fs.readFileSync('www/env/' + filename, 'utf8'));
    return gulp.src(paths.app)
        //.pipe(replace('/@@\w+/', function (match, p1) { return settings[p1]; })) TODO: make a regex work
        .pipe(replace('@@apiUrl', settings.apiUrl))
        .pipe(replace('@@tokenUrl', settings.tokenUrl))
        .pipe(replace('@@clientId', settings.clientId))
        .pipe(gulp.dest('www/dist'));
});

gulp.task('bundle', function() {
  return gulp.src(['www/src/**/*.js','!www/src/app.js'])
      .pipe(concat('statracker.js'))
      .pipe(header('\'use strict\';\n'))
      .pipe(gulp.dest('www/dist'))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(uglify())
      .pipe(gulp.dest('www/dist'));
});

gulp.task('inject-src', function () {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(['./www/src/account/**/*.js','./www/src/components/**/*.js','./www/src/config/**/*.js','./www/src/rounds/**/*.js','./www/src/stats/**/*.js'], {read: false, cwd: __dirname});
    //sources.pipe(print());
    return target.pipe(inject(sources, {relative: true, addRootSlash: false})).pipe(gulp.dest('./www'));
});

gulp.task('lint', function() {
  return gulp.src(['www/src/**/*.js','!www/src/app.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.config.js',
    singleRun: true
  }, done);
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
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
