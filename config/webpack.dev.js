var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = 'development';

var base = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.web.js', '.js', '.jsx', '.webpack.js', '.scss']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            },
            { 
                enforce: 'pre',
                test: /\.js$/, 
                use: "source-map-loader" 
            }
        ]
    }
}

var client = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/client/index.tsx',
    ],

    output: {
        path: path.join(process.cwd(), '/build/assets'),
        filename: 'client.js',
        publicPath: '/assets/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({quiet: true}),
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true)
            }
        }),
        new CopyWebpackPlugin([
            {from: 'node_modules/shoelace-css/dist/shoelace.css'}
        ])
    ],
};

var nodeModules = fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  });

var server = {
    entry: [
        'webpack/hot/signal.js',
        './src/server/index.ts',
    ],
    output: {
        path: path.join(process.cwd(), 'build'),
        filename: 'server.js',
    },
    target: 'node',
    plugins: [
        new webpack.IgnorePlugin(/\.s?css$/),
        // new webpack.BannerPlugin('require("source-map-support").install();',
        //     { raw: true, entryOnly: false }),
        new webpack.HotModuleReplacementPlugin({ quiet: true }),
        new webpack.DefinePlugin({
            "process.env": {
                CLIENT_LOC: JSON.stringify(client.output.path),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
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