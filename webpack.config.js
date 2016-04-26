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
        app: path.join(srcPath, 'bootstrap.ts'),
        common: paths.vendorJS
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules']
    },
    output: {
        path: path.join(__dirname, 'docs'),
        publicPath: '',
        filename: '[name].js',
        pathInfo: true
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts?transpileOnly=true' },
            { test: /\.css$/, loader: 'style!raw!autoprefixer' },
            { test: /\.scss$/, loader: 'style!raw!autoprefixer!sass' },
            { test: /\.html/, loader: 'html' },
            { test: /\.svg/, loader: 'svg-inline' }
        ],
        noParse: paths.vendorJS
    },
    ts: {
        compilerOptions: {
            noEmit: false,
            noEmitOnError: false
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(srcPath, 'index.html')
        }),
        new webpack.NoErrorsPlugin()
    ],
    debug: true,
    devtool: 'eval-source-map'
};
