const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
    entry: {
        app: path.resolve(__dirname, '../src/client.tsx'),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader?minimize", "sass-loader"]
                })
            },
        ]
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash].js',
            minChunks(module) {
                return module.context &&
                    module.context.indexOf('node_modules') >= 0 &&
                    module.context.indexOf('shoelace-css') < 0; // Ignore shoelace, so it goes into css
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin("css/main.css"),
        new VisualizerPlugin(),
        new UglifyJSPlugin({
            uglifyOptions: {
                beautify: false,
                ecma: 6,
                compress: true,
                comments: false
            }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
          })
    ]
}

module.exports = require('./webpack.base.js').then(base => {
    return require('deepmerge')(base, config, {
        arrayMerge: (a, b) => a.concat(b)
    });
})