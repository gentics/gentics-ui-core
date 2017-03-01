const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const distConfig = Object.assign({}, baseConfig);

distConfig.plugins = distConfig.plugins.concat([
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./../package.json').version),
        PROD: true
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
]);
distConfig.devtool = 'source-map';

module.exports = distConfig;
