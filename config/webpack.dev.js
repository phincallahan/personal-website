require('dotenv').config();
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProjectEulerPlugin = require('./project-euler-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/client.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'eval',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devServer: {
        contentBase: '../dist',
        hot: true
    },
    module: {
        rules: [
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '../'
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.tsx?$/,
                use: ['react-hot-loader/webpack', 'ts-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/index.html'),
        }),
        new ProjectEulerPlugin(process.env.EULER_PATH),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}