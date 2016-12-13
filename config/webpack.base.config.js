'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath = path.join(__dirname, '../', 'src', 'docs');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'main.ts'),
        common: [
            'core-js',
            'reflect-metadata',
            'zone.js'
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        modules: ['node_modules']
    },
    output: {
        path: path.join(__dirname, '..', 'docs'),
        publicPath: '',
        filename: '[name].js',
        pathinfo: true
    },

    module: {
        loaders: [
            { test: /\.ts$/, loaders: ['awesome-typescript-loader?transpileOnly=false&configFileName=tsconfig.json', 'angular2-template-loader'] },
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
        new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js' }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(srcPath, 'index.html')
        }),
        new webpack.NoErrorsPlugin(),
        new CheckerPlugin()
    ],
    devtool: 'eval-source-map'
};
