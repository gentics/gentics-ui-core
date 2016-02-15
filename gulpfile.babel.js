'use strict';

import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import filter from 'gulp-filter';
import gutil from 'gulp-util';
import jscs from 'gulp-jscs';
import jscsStylish from 'gulp-jscs-stylish';
import jsonlint from 'gulp-jsonlint';
import livereload from 'gulp-livereload';
import merge from 'merge-stream';
import path from 'path';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import tslint from 'gulp-tslint';
import tslintStylish from 'tslint-stylish';
import webserver from 'gulp-webserver';
import webpack from 'webpack';
import karma from 'karma';

const webpackConfig = require('./webpack.config.js');
import {paths} from './build.config';

gulp.task('build:demo', [
    'webpack:run',
    'styles',
    'static-files'
]);

gulp.task('clean', () => {
    return del([
        paths.out.demo + '/**',
        '!' + paths.out.demo
    ]);
});

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

gulp.task('serve', ['clean'], () => {
    gulp.start('static-files');
    gulp.start('watch');

    // LiveReload on file change
    livereload.listen({ quiet: true });
    gulp.watch([paths.out.demo + '/**', '!**/*.map', '!**/*.d.ts'])
        .on('change', console.log.bind(console))
        .on('change', file => livereload.changed(file.path));

    // Serve files from build/demo
    return gulp.src(paths.out.demo, { base: '.' })
        .pipe(webserver({
            index: 'index.html',
            open: true,
            port: process.env.PORT || 8000
        }));
});

gulp.task('static-files', () => {
    gulp.src(paths.vendorStatics)
        .pipe(filter([
            '*.eot',
            '*.ttf',
            '*.woff',
            '*.woff2'
        ]))
        .pipe(gulp.dest(paths.out.fonts));
});

gulp.task('styles', () => {
    return gulp.src(paths.src.scssMain, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['node_modules'] }))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: relativeRoot(paths.out.css)
        }))
        .pipe(gulp.dest(paths.out.css));
});

gulp.task('watch', ['styles', 'webpack:watch'], () => {
    gulp.watch(paths.src.scss, ['styles']);
    gulp.watch(paths.src.vendorStatics, ['static-files']);
});

gulp.task('test:run', callback => {
    const server = new karma.Server({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, () => callback());

    server.start();
});

gulp.task('test:watch', callback => {
    const server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, () => callback());

    server.start();
});

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
            throw new gutil.PluginError('webpack:build-dev', err);
        }

        if (stats.hasErrors) {
            stats.toJson().errors.map(e => {
                throw new gutil.PluginError('webpack:build-dev', e);
            });
        }

        let duration = stats.toJson({ timings: true }).time / 1000;
        gutil.log(`[webpack:build-dev] Webpack bundle completed after ${duration} seconds`);

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
 *    relativeRoot("build/demo/app.js") // returns "../../.."
 *    relativeRoot("src/components/example/example.js") // returns "../../../.."
 */
function relativeRoot(filepath) {
    return path.relative(filepath, '.').replace(/\\/g, '/');
}
