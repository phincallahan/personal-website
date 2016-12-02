var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var base = {
    debug: true,
    resolve: {
        extensions: ['', '.ts', '.tsx', '.web.js', '.js', '.jsx', '.webpack.js', '.scss']
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            // {
            //     test: /\.scss$/,
            //     loaders: ['style', 'css', 'sass']
            // },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', ['css', 'sass'], {
                    publicPath: 'assets'
                })
            }
        ],
    }
}

var client = {
    entry: './src/client/index.tsx',

    output: {
        path: path.join(process.cwd(), '/build/assets'),
        filename: 'client.js',
        publicPath: 'assets',
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true)
            }
        }),
        new ExtractTextPlugin("[name].css")
    ],
};

var nodeModules = fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  });

var server = {
    entry: [
        './src/server/index.ts',
    ],
    output: {
        path: path.join(process.cwd(), 'build'),
        filename: 'server.js',
    },
    target: 'node',
    plugins: [
        new webpack.IgnorePlugin(/\.s?css$/),
        new webpack.DefinePlugin({
            "process.env": {
                CLIENT_LOC: JSON.stringify(client.output.path)
            }
        })
    ],
    node: {
        __dirname: true,
        __filename: true
    },
    externals: [
        function (context, request, callback) {
            var pathStart = request.split('/')[0];
            if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
                return callback(null, "commonjs " + request);
            };
            callback();
        }
    ],
}

module.exports = {
    server: Object.assign(server, base),
    client: Object.assign(client, base),
}