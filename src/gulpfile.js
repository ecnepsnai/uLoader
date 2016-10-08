var gulp = require('gulp'),
    data = require('gulp-data'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify');

var BUILD_DIRECTORY_BASE = './../uLoader';

gulp.task('js', function() {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/js'));
});

gulp.task('contrib', function() {
    return gulp.src('./contrib/*.js')
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/js'));
});

gulp.task('html', function() {
    return gulp.src('./html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './include'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/'));
});

gulp.task('styl', function() {
    return gulp.src('./css/*.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/css'));
});

gulp.task('css', function() {
    return gulp.src('./css/*.css')
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/css'));
});

gulp.task('watch', function() {
    watch('./js/*.js', batch(function(events, done) {
        gulp.start('js', done);
    }));
    watch('./css/*.styl', batch(function(events, done) {
        gulp.start('css', done);
    }));
    watch(['./html/*.html', './include/*.html'], batch(function(events, done) {
        gulp.start('html', done);
    }));
    watch('./img/*', batch(function(events, done) {
        gulp.start('img', done);
    }));
});

gulp.task('fonts', function() {
    return gulp.src('./fonts/*.woff2')
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/fonts'));
});

gulp.task('img', function() {
    return gulp.src('./img/*')
        .pipe(gulp.dest(BUILD_DIRECTORY_BASE + '/assets/img'));
});

gulp.task('clean', function() {
    return gulp.src(BUILD_DIRECTORY_BASE + '/', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('default', ['styl', 'css', 'js', 'contrib', 'html', 'fonts', 'img']);
