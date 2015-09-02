/* constants and plugins */

const src = 'app/src/',
      sourceImages = src + 'images/',
      sourceScripts = src + 'scripts/',
      sourceStyles = src + 'styles/',
      dest = 'app/build/',
      destImages = dest + 'images/',
      destScripts = dest + 'js/',
      destStyles = dest + 'css/';

var gulp = require('gulp'),
    del = require('del'),
    loadPlugins = require('gulp-load-plugins'),
    p = loadPlugins();


/* build tasks */

gulp.task('html', function () {
  return gulp.src(src + '**/*.html')
    .pipe(p.sourcemaps.init())
      .pipe(p.minifyHtml())
    .pipe(p.sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
});

gulp.task('images', function () {
  return gulp.src([sourceImages + '**/*.png',
                  sourceImages + '**/*.jpg',
                  sourceImages + '**/*.jpeg',
                  sourceImages + '**/*.gif'])
    .pipe(p.cache(p.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(destImages));
});

gulp.task('scripts', function () {
  return gulp.src(sourceScripts + '**/*.js')
    .pipe(p.sourcemaps.init())
      .pipe(p.jshint())
      .pipe(p.jshint.reporter('default'))
      .pipe(p.concat('main.js'))
      .pipe(p.uglify())
      .pipe(p.rename({suffix: '.min'}))
    .pipe(p.sourcemaps.write('./'))
    .pipe(gulp.dest(destScripts));
});

gulp.task('styles', function () {
  return gulp.src(sourceStyles + '**/*.less')
    .pipe(p.sourcemaps.init())
      .pipe(p.less())
      .pipe(p.autoprefixer('last 2 version'))
      .pipe(p.concat('main.css'))
      .pipe(p.minifyCss({compatibility: 'ie8'}))
      .pipe(p.rename({suffix: '.min'}))
    .pipe(p.sourcemaps.write('./'))
    .pipe(gulp.dest(destStyles));
});


/* public tasks */

gulp.task('clean', function (callback) {
  return del(dest, callback);
});

gulp.task('build', ['clean'], function () {
  gulp.start('html', 'images', 'scripts', 'styles');
});

gulp.task('default', ['build']);
