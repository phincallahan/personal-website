const glob = require('glob');
const path = require('path');
const hljs = require('highlight.js');

const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
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
        new CopyWebpackPlugin([
            {
                from: `${process.env.EULER_PATH}/**/problem*.*`,
                to: 'project-euler/',
                toType: 'dir',
                ignore: ['*.pyc', '*.txt'],
                flatten: true,
                transform: (content, filePath) => {
                    let ext = path.extname(filePath).replace('.', '');
                    let code = content.toString();
                    let { value } = hljs.highlight(ext, code)
                    return value;
                }
            }
        ])
    ]
}

const createEuler = (repoPath, cb) => {
    glob(`${repoPath}/**/problem!(*.txt|*.pyc)`, (err, matches) => {
        if (err) {
            cb(err);
        } else {
            const euler = {}
            matches.forEach(m => {
                const basename = path.basename(m);
                const loc = `project-euler/${basename}`;
                const number  = basename.match(/\d+/)[0];

                euler[number] = euler[number] !== undefined 
                    ? [...euler[number], loc]
                    : [loc];
            })

            cb(null, euler);
        }
    });
}

module.exports = new Promise((res, rej) => {
    createEuler(process.env.EULER_PATH, (err, euler) => {
        if (err) {
            rej(err);
        } else {
            config.plugins = [
                ...config.plugins,
                new VirtualModulePlugin({
                    moduleName: 'src/euler.json', 
                    contents: euler
                })
            ];

            res(config);
        }
    });
});