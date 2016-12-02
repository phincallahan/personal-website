var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var nodemon = require('nodemon');

require('es6-promise').polyfill();

var env  = process.env.NODE_ENV || 'development';
var webpack = require('webpack');
var config = {
    dev: require('./config/webpack.dev.js'),
    prod: require('./config/webpack.prod.js')
}

var WebpackDevServer = require('webpack-dev-server');

function onBuild(res, rej) {
    return function (err, stats) {
        if (err) {
            rej(err);
        } else if (res) {
            res(stats);
        }
    }
}

gulp.task('server-watch', function(done) {
    var firedDone = false;
    webpack(config.dev.server).watch(100, function (err, stats) {
        if (!firedDone) {
            firedDone = true;
            done();
        }
        nodemon.restart();
    });
})

gulp.task('client-watch', function() {
    new WebpackDevServer(webpack(config.dev.client), {
        publicPath: config.dev.client.output.publicPath,
        hot: true,
        proxy: {
            '**': 'http://localhost:8080'
        }
    }).listen(3000, 'localhost', function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('webpack dev server listening at localhost:3000');
        }
    });
}); 

gulp.task('build', function(done) {
    var env = process.env.NODE_ENV = 'production';
    let clientBuild = new Promise((res,rej) => webpack(config.prod.client).run(onBuild(res, rej)))
    let serverBuild = new Promise((res,rej) => webpack(config.prod.server).run(onBuild(res, rej)));
    Promise.all([clientBuild, serverBuild]).then(() => done()).catch(console.log);
});

gulp.task('dev', ['client-watch', 'server-watch'], function() {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, 'build/server'),
        ignore: ['*'],
        watch: ['foo/'],
        ext: 'noop'
    }).on('restart', function () {
        console.log('Patched!');
    });
});
