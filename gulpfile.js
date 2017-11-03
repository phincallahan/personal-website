require('dotenv').config()

var gulp = require('gulp');

gulp.task('html', function() {
    gulp.src('src/*.html').pipe(gulp.dest(process.env.NGINX_STATIC));
});

var sass = require('gulp-sass');


gulp.task('sass', function() {
    gulp.src('src/stylesheets/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(process.env.NGINX_STATIC + '/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/stylesheets/*.scss', ['sass']);
});

gulp.task('css', ['sass'], function() {
    shoelace = 'node_modules/shoelace-css/source/css/*.css'
    gulp.src(shoelace).pipe(gulp.dest(process.env.NGINX_STATIC + '/css'))
});

var merge = require('merge2');
var through = require('through2');
var Vinyl = require('vinyl');

gulp.task('euler.json', function() {
    const euler = {}

    merge(gulp.src(process.env.EULER_PATH + '/!(assets)*/problem*.*'))
        .pipe(through.obj(
                (s, e, cb) => {
                    code = s.contents.toString();
                    [prob, ext] = s.history[0].match(/.*?problem(.*)\.(.*)/).slice(1, 3);
                    euler[prob] = euler[prob] 
                        ? [...euler[prob], { ext, code }] 
                        : [{ ext, code }];
                    cb(); 
                },
                cb => {
                   v = new Vinyl({
                       path: 'euler.json',
                       contents: new Buffer(JSON.stringify(euler))
                    });
                   cb(null, v);
               }
        )).pipe(gulp.dest(process.env.NGINX_STATIC + '/assets'))
});

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

gulp.task('ts', function() {
    return browserify()
        .add('src/client.tsx')
        .plugin(tsify)
        .bundle()
        .pipe(source('client.js'))
        .pipe(gulp.dest(process.env.NGINX_STATIC + '/js'));
});

gulp.task('build', ['css', 'euler.json', 'ts', 'html']);
gulp.task('dev', ['euler.json', 'sass:watch', 'html', 'ts']);