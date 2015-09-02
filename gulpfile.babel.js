import pkg        from './package';
import gulp       from 'gulp';
import loader     from 'gulp-load-plugins';
import {exec}     from 'child_process';
import assign     from 'object-assign';
import buffer     from 'vinyl-buffer';
import source     from 'vinyl-source-stream';
import watchify   from 'watchify';
import browserify from 'browserify';

const $ = loader();
let bundleOpts = assign({}, watchify.args, {entries: ['lib/skewSlider.js'], debug: true, standalone: 'SkewSlider'});
let bundler    = watchify(browserify(bundleOpts));
let bundle     = () => {
  return bundler
    .bundle()
    .on('error', err => $.util.log(err.message))
    .pipe(source('skewslider.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
};

let banner = `/*!
 * skewslider.js v${pkg.version}
 * ${pkg.repository.url}
 *
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author}
 * Licensed under the MIT license.
 */

`;

gulp.task('default', () => {
  exec('tsc src/skewSlider.ts --outDir lib --watch --module commonjs', {}, function (err, stdout, stderr) {
    $.util.log('compiled');
  });

  bundler.on('update', bundle);
  bundler.on('log', $.util.log);

  bundle();
});

gulp.task('build', () => {
  gulp.src('skewSlider.js')
    .pipe($.header(banner))
    .pipe(gulp.dest('./'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('./'))
});
