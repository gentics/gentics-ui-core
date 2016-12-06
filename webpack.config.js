'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath = path.join(__dirname, 'src', 'docs');
const paths = require('./build.config.js').paths;

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'main.ts'),
        common: [
            'es6-shim',
            'reflect-metadata',
            'zone.js'
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        modules: ['node_modules']
    },
    output: {
        path: path.join(__dirname, 'docs'),
        publicPath: '',
        filename: '[name].js',
        pathinfo: true
    },

    module: {
        loaders: [
            { test: /\.ts$/, loaders: ['ts-loader?transpileOnly=false&configFileName=tsconfig.json', 'angular2-template-loader'] },
            { test: /\.css$/, loader: 'style-loader!raw-loader!autoprefixer-loader' },
            { test: /\.scss$/, loader: 'style-loader!raw-loader!autoprefixer-loader!sass-loader' },
            { test: /\.html/, loader: 'raw-loader' },
            { test: /\.svg/, loader: 'svg-inline-loader' },
            { test: /\.json/, loader: 'json-loader' },
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                ts: {
                    files: [
                        'src/index.ts',
                        'src/docs/main.ts',
                        'typings/index.d.ts'
                    ],
                    compilerOptions: {
                        declaration: false,
                        noEmit: false,
                        noEmitOnError: false
                    },
                },
                // work around: https://github.com/TypeStrong/ts-loader/issues/283#issuecomment-249414784
                resolve: {}
            }
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./package.json').version),
            PROD: false
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js' }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(srcPath, 'index.html')
        }),
        new webpack.NoErrorsPlugin()
    ],
    devtool: 'eval-source-map'
};
