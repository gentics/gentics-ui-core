'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src', 'demo');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'bootstrap.ts')
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules', 'src']
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
                loader: 'ts',
                query: {
                    'ignoreDiagnostics': [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375  // 2375 -> Duplicate string index signature
                    ]
                },
                compilerOptions: {
                    noEmit: false,
                    noEmitOnError: false
                }
            },
            {test: /\.css$/, loader: "style!raw!autoprefixer" },
            {test: /\.scss$/, loader: "style!raw!autoprefixer!sass"},
            {test: /\.html/, loader: "html"}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(srcPath, 'index.html')
        }),
        new webpack.NoErrorsPlugin()
    ],

    //debug: true,
    //devtool: 'eval-cheap-module-source-map'
};
