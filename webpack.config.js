'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath = path.join(__dirname, 'src', 'demo');
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
        path: path.join(__dirname, 'build', 'demo'),
        publicPath: '',
        filename: '[name].js',
        pathInfo: true
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts?transpileOnly=true',
                query: {
                    ignoreDiagnostics: [

                        // There are several TS compiler errors that seem to be related to the way Angular2 incorporates
                        // its own ambient type definition files. The following list squashes those errors, but should be
                        // reviewed and eventually removed. See https://github.com/angular/angular/issues/5807
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2420, // 2420 -> Class x incorrectly implements interface Ix
                        2502  // 2502 -> 'X' is referenced directly or indirectly in its own type annotation.
                    ]
                },
                compilerOptions: {
                    noEmit: false,
                    noEmitOnError: false
                }
            },
            { test: /\.css$/, loader: 'style!raw!autoprefixer' },
            { test: /\.scss$/, loader: 'style!raw!autoprefixer!sass' },
            { test: /\.html/, loader: 'html' }
        ],
        noParse: paths.vendorJS
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
