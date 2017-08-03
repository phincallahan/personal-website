var fs = require('fs');
var path = require('path');
var os = require('os');

var gulp = require('gulp');
var clean = require('gulp-clean')
var sass = require('gulp-sass');
var concat = require('gulp-concat');
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

gulp.task('clean', function(done) {
    return gulp.src('build/*', {read: false}).pipe(clean());
});

gulp.task('euler', function(done) {
    const reg = `^problem([0-9]+)\.([a-zA-z]+)$`;

    let eulerPath = ''
    if (os.hostname() === 'personal-website')  {
        eulerPath = '/root/project-euler/';
    } else {
        eulerPath = '/Users/phin/Code/project-euler/';
    }

    let matches = fs.readdirSync(eulerPath)
        .map(f => f.match(reg))
        .filter(f => !!f)

    let solutions = {};
    matches.forEach(m => {
        let solution = { 
            ext: m[2],
            code: fs.readFileSync(eulerPath + m.input).toString() 
        }

        if (solutions[m[1]]) {
            solutions[m[1]].push(solution)
        } else {
            solutions[m[1]] = [solution]
        }
    });

    const eulerJSONPath = path.join(process.cwd(), '/build/euler.json');
    fs.writeFileSync(eulerJSONPath, JSON.stringify(solutions));
    done();
})

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
            '**': 'http://localhost:8000'
        }
    }).listen(3000, 'localhost', function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('webpack dev server listening at localhost:3000');
        }
    });
}); 

gulp.task('build', ['euler'], function(done) {
    var env = process.env.NODE_ENV = 'production';
    
    let clientBuild = new Promise((res,rej) => webpack(config.prod.client).run(onBuild(res, rej)))
    let serverBuild = new Promise((res,rej) => webpack(config.prod.server).run(onBuild(res, rej)));
    
    Promise.all([clientBuild, serverBuild]).then(() => done()).catch(console.log);
});

gulp.task('deploy', ['build'], function(done) {
    var cred = JSON.parse(fs.readFileSync('.credentials').toString());
});

gulp.task('dev', ['euler', 'client-watch', 'server-watch'], function() {
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
