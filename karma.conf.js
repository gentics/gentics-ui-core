// Karma configuration
// Generated on Thu Dec 03 2015 13:23:31 GMT+0100 (W. Europe Standard Time)
const path = require('path');
const paths = require('./build.config.js').paths;

const addModulePath = s => path.join('node_modules', s);

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            ...paths.vendorJS.map(addModulePath),
            './testing-bootstrap.js',
            // { pattern: paths.src.typescript[0], watched: false, served: false, included: false }
            { pattern: 'src/components/button/*.ts', watched: false, served: false, included: false }
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'testing-bootstrap.js': ['webpack', 'sourcemap']
        },

        webpack: {
            // karma watches the test entry points
            // (you don't need to specify the entry option)
            // webpack watches dependencies

            // webpack configuration
            resolve: {
                root: './src',
                extensions: ['', '.js', '.ts'],
                modulesDirectories: ['node_modules', 'src']
            },
            module: {
                loaders: [
                    { test: /\.ts$/, loaders: ['ts?transpileOnly=true', 'angular2-template-loader'] },
                    { test: /\.html/, loader: 'html' }
                ]
            },
            ts: {
                compilerOptions: {
                    declaration: false,
                    noEmit: false,
                    noEmitOnError: false,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true
                }
            },
            debug: true,
            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },

        plugins: [
            require('karma-webpack'),
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha-reporter',
            'karma-sourcemap-loader'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity
    });
};
