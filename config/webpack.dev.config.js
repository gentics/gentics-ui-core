const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const devConfig = Object.assign({}, baseConfig);

devConfig.plugins = devConfig.plugins.concat([
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./../package.json').version),
        PROD: false
    }),
]);
devConfig.devtool = 'eval-source-map';

module.exports = devConfig;
