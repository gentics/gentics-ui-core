const webpack = require('webpack');
const path = require('path');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const baseConfig = require('./webpack.base.config');
const distConfig = Object.assign({}, baseConfig);
const _root = path.resolve(__dirname, '..');

distConfig.module.rules[0] = {
    test: /\.ts$/,
    use: '@ngtools/webpack'
};

distConfig.plugins = distConfig.plugins.concat([
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./../package.json').version),
        PROD: true
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new AotPlugin({
        tsConfigPath: './config/tsconfig.aot-docs.json',
        entryModule: root('src/docs/app.module#DocsModule'),
        basePath: root('./')
    })
]);
distConfig.devtool = 'source-map';

module.exports = distConfig;

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}
