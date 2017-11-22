const path = require('path');

const webpack = require('webpack');

const config = {
    entry: path.resolve(__dirname, '../src/client.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
        ]
    },
    devtool: 'eval',
    devServer: {
        contentBase: '../dist',
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
}

module.exports = require('./webpack.base.js').then(base => {
    return require('deepmerge')(base, config, {
        arrayMerge: (a, b) => a.concat(b)
    });
})
