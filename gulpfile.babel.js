'use strict';

import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import filter from 'gulp-filter';
import gutil from 'gulp-util';
import jscs from 'gulp-jscs';
import jscsStylish from 'gulp-jscs-stylish';
import jsonlint from 'gulp-jsonlint';
import karma from 'karma';
import livereload from 'gulp-livereload';
import merge from 'merge-stream';
import * as path from 'path';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import tslint from 'gulp-tslint';
import tslintStylish from 'tslint-stylish';
import webserver from 'gulp-webserver';
import webpack from 'webpack';

const webpackConfig = require('./webpack.config.js');
const buildConfig = require('./build.config').config;
const paths = require('./build.config').paths;

gulp.task('build:docs', [
    'webpack:run',
    'styles',
    'static-files'
]);

gulp.task('clean', () => del([
    paths.out.docs + '/**',
    '!' + paths.out.docs
]));

gulp.task('lint', (done) => {
    const files = gulp.src(paths.src.lint, { base: '.' });
    const linters = merge(
        files.pipe(filter('**/*.js'))
            .pipe(jscs())
            .pipe(jscsStylish())
            .pipe(jscs.reporter('fail')),
        files.pipe(filter('**/*.json'))
            .pipe(jsonlint())
            .pipe(jsonlint.reporter()),
        files.pipe(filter('**/*.ts'))
            .pipe(tslint())
            .pipe(tslint.report(tslintStylish, {
                emitError: true,
                summarizeFailureOutput: true
            }))
    );

    let errors = [];
    linters.on('error', error => errors.push(error))
        .on('end', () => done(errors.length ? errors : null));
});

gulp.task('static-files', () => {
    let fonts = gulp.src(paths.vendorStatics.concat(paths.src.fonts))
        .pipe(filter([
            '*.eot',
            '*.ttf',
            '*.woff',
            '*.woff2'
        ]))
        .pipe(gulp.dest(paths.out.fonts));

    let images = gulp.src(paths.src.docsAssets)
        .pipe(gulp.dest(paths.out.images));

    return merge(fonts, images);
});

gulp.task('styles', () => gulp.src(paths.src.scssMain, { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write('.', {
        includeContent: true,
        sourceRoot: relativeRoot(paths.out.css)
    }))
    .pipe(gulp.dest(paths.out.css)));

gulp.task('watch', ['styles', 'static-files', 'webpack:watch'], () => {
    gulp.watch(paths.src.scss, ['styles']);
    gulp.watch(paths.src.vendorStatics, ['static-files']);
});

gulp.task('test:run', callback => runKarmaServer(false, callback));

gulp.task('test:watch', callback => runKarmaServer(true, callback));

// Pass a command line argument to gulp to change browsers
// e.g. gulp test:watch --browsers=Chrome,Firefox,PhantomJS
function runKarmaServer(watch, callback) {
    let testBrowsers = ['Chrome'];
    process.argv.forEach(arg => {
        if (arg.length > 13 && arg.substr(0, 11) == '--browsers=') {
            testBrowsers = arg.substr(11).split(',');
        }
    });

    const server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !watch,
        browsers: testBrowsers
    }, callback);
    server.start();
}

// create a single instance of the compiler to allow caching
let devCompiler = webpack(webpackConfig);

/**
 * Returns a function which will be invoked upon completion of Webpack build.
 * @param callback - Gulp callback function to signify completion of the task.
 * @returns {Function}
 */
function webpackOnCompleted(callback) {
    let hasRun = false;
    return (err, stats) => {
        if (err) {
            throw new gutil.PluginError('[webpack]', err);
        }

        if (stats.hasErrors) {
            stats.toJson().errors.map(e => {
                gutil.log(gutil.colors.red(e));
            });
        }

        let duration = stats.toJson({ timings: true }).time / 1000;
        gutil.log('[webpack] bundle completed after', gutil.colors.magenta(`${duration} seconds`));

        if (!hasRun) {
            callback();
            hasRun = true;
        }
    };
}

gulp.task('webpack:watch', callback => {
    devCompiler.watch({}, webpackOnCompleted(callback));
});

gulp.task('webpack:run', callback => {
    devCompiler.run(webpackOnCompleted(callback));
});

/**
 * Helper function to get correct sourceRoot in sourcemaps on Windows with forward-slash
 * @param filepath {string} - Path relative to the project root
 * @returns {string} - Returns the path of the project root relative to filepath
 * @example
 *    relativeRoot("build/docs/app.js") // returns "../../.."
 *    relativeRoot("src/components/example/example.js") // returns "../../../.."
 */
function relativeRoot(filepath) {
    return path.relative(filepath, '.').replace(/\\/g, '/');
}
