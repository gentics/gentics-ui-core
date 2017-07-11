const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { root } = require('./utils');

module.exports = merge(baseConfig, {
    module: {
        rules: [
            { test: /\.ts$/, use: [
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        transpileOnly: false,
                        configFileName: root('config/tsconfig.jit-docs.json'),
                        declaration: false
                    }
                },
                'angular2-template-loader'
            ] }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./../package.json').version),
            PROD: false
        })
    ],
    devtool: 'eval-source-map'
});
