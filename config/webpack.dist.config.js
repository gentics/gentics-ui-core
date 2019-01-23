const argv = require('yargs').argv;
const webpack = require('webpack');
const merge = require('webpack-merge');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const baseConfig = require('./webpack.base.config');
const { root } = require('./utils');

let latestBranch = true;

if (argv.docsVersion !== undefined) {
    latestBranch = false;
}

module.exports = merge(baseConfig, {
    module: {
        rules: [{
            test: /\.ts$/,
            use: '@ngtools/webpack'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./../package.json').version),
            PROD: true,
            LATESTBRANCH: latestBranch
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new AngularCompilerPlugin({
            tsConfigPath: './config/tsconfig.aot-docs.json',
            entryModule: root('src/docs/app.module#DocsModule'),
            basePath: root('./')
        })
    ],
    devtool: 'source-map'
});
