'use strict';

const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const filter = require('gulp-filter');
const gutil = require('gulp-util');
const jscs = require('gulp-jscs');
const jscsStylish = require('gulp-jscs-stylish');
const jsonlint = require('gulp-jsonlint');
const karma = require('karma');
const merge = require('merge-stream');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const tslintStylish = require('tslint-stylish');
const ts = require('gulp-typescript');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config.js');
const buildConfig = require('./build.config').config;
const paths = require('./build.config').paths;

gulp.task('clean', gulp.parallel(
    cleanDistFolder,
    cleanDocsFolder
));
gulp.task('dist:build', gulp.parallel(
    compileDistStyles,
    compileDistTypescript,
    copyDistTemplates,
    copyFontsTo(paths.out.dist.fonts)
));
gulp.task('dist:watch', gulp.series(
    'dist:build',
    watchDist
));
gulp.task('lint', lint);
gulp.task('docs:build', gulp.series(
    runWebpack,
    compileDocsSASS,
    gulp.parallel(
        copyFontsTo(paths.out.fonts),
        copyImagesToDocs
    )
));
gulp.task('docs:watch', gulp.series(
    gulp.parallel(
        compileDocsSASS,
        copyFontsTo(paths.out.fonts),
        copyImagesToDocs
    ),
    gulp.parallel(
        watchWebpack,
        watchDocs
    )
));
gulp.task('test:run', callback => runKarmaServer(false, callback));
gulp.task('test:watch', callback => runKarmaServer(true, callback));
gulp.task('package', gulp.series('clean', 'lint', 'test:run', 'dist:build'));

function cleanDistFolder() {
    return del([`${paths.out.dist.root}/**`, `!${paths.out.dist.root}`]);
}

function cleanDocsFolder() {
    return del([`${paths.out.docs}/**`, `!${paths.out.docs}`]);
}

function compileDistStyles() {
    return checkDistSASS().then(copyDistSASS);
}

let tsProject;
function compileDistTypescript() {
    if (!tsProject) {
        tsProject = ts.createProject('tsconfig.json', {
            declaration: true,
            noEmit: false,
            outDir: 'dist',
            typescript: require('typescript')
        });
    }
    let tsResult = gulp.src(paths.src.typescript.concat(paths.src.typings))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.on('error', () => process.exitCode = 1);

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.out.dist.root)),
        tsResult.js
            .pipe(sourcemaps.write('.', { includeContent: true, sourceRoot: '../src' }))
            .pipe(gulp.dest(paths.out.dist.root))
    ]);
}

function copyDistTemplates() {
    return (
        gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.out.dist.root))
    );
}

function checkDistSASS() {
    let stream = (
        gulp.src(paths.src.scssMain, { base: '.' })
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            includePaths: ['node_modules']
        }))
        .on('error', () => { process.exitCode = 1; })
        .on('error', sass.logError)
    );
    stream.pipe(gutil.noop());
    return streamToPromise(stream);
}

function copyDistSASS() {
    return Promise.all([
        streamToPromise(
            gulp.src(paths.src.scss)
            .pipe(gulp.dest(paths.out.dist.root))
        ),
        streamToPromise(
            gulp.src('node_modules/materialize-css/sass/**/*.scss')
            .pipe(gulp.dest(path.join(paths.out.dist.styles, 'materialize-css/sass')))
        )
    ]);
}

function copyFontsTo(outputFolder) {
    return function copyFonts() {
        return (
            gulp.src(paths.vendorStatics.concat(paths.src.fonts))
            .pipe(filter([
                '*.eot',
                '*.ttf',
                '*.woff',
                '*.woff2'
            ]))
            .pipe(gulp.dest(outputFolder))
        );
    };
}

function lint() {
    const files = gulp.src(paths.src.lint, { base: '.' });

    return Promise.all([
        new Promise((resolve, reject) => {
            files.pipe(filter('**/*.js'))
            .pipe(jscs())
            .on('error', reject)
            .on('end', resolve)
            .pipe(jscsStylish())
            .pipe(jscs.reporter('fail'));
        }),
        new Promise((resolve, reject) => {
            files.pipe(filter('**/*.json'))
            .pipe(jsonlint())
            .on('error', reject)
            .on('end', resolve)
            .pipe(jsonlint.reporter())
            .pipe(jsonlint.failAfterError());
        }),
        new Promise((resolve, reject) => {
            files.pipe(filter('**/*.ts'))
            .pipe(tslint())
            .pipe(tslint.report(tslintStylish, {
                emitError: true,
                summarizeFailureOutput: false
            }))
            .on('error', reject)
            .on('end', resolve);
        })
    ])
    .catch(() => { process.exitCode = 1; });
}

function copyImagesToDocs() {
    return (
        gulp.src(paths.docs.assets)
        .pipe(gulp.dest(paths.out.images))
    );
}

function compileDocsSASS() {
    return (
        gulp.src(paths.docs.scssMain, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            includePaths: ['node_modules']
        }))
        .on('error', sass.logError)
        .on('error', () => { process.exitCode = 1; })
        .pipe(autoprefixer(buildConfig.autoprefixer))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: relativeRoot(paths.out.css)
        }))
        .pipe(gulp.dest(paths.out.css))
    );
}

function watchDocs(runForever) {
    gulp.watch(paths.docs.scss, gulp.series(compileDocsSASS));
    gulp.watch(paths.src.vendorStatics, gulp.parallel(copyFontsTo(paths.out.fonts), copyImagesToDocs));
}

function watchDist(runForever) {
    gulp.watch(paths.src.scss, gulp.series(compileDistStyles));
    gulp.watch([paths.src.typescript, paths.src.typings], compileDistTypescript);
    gulp.watch(paths.src.templates, copyDistTemplates);
    gulp.watch(paths.src.fonts, copyFontsTo(paths.out.dist.fonts));
}

function runWebpack(callback) {
    devCompiler.run(webpackOnCompleted(callback));
}

function watchWebpack(callback) {
    devCompiler.watch({}, webpackOnCompleted(callback));
}

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
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: !watch,
        browsers: testBrowsers,
        reporters: ['mocha'],
        mochaReporter: {
            output: 'autowatch'
        }
    }, errors => {
        if (errors) { process.exitCode = 1; };
        callback();
    });

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
            process.exitCode = 1;
            throw new gutil.PluginError('[webpack]', err);
        }

        if (stats.hasErrors) {
            stats.toJson().errors.map(e => {
                gutil.log(gutil.colors.red(e));
            });
            process.exitCode = 1;
        }

        let duration = stats.toJson({ timings: true }).time / 1000;
        gutil.log('[webpack] bundle completed after', gutil.colors.magenta(`${duration} seconds`));

        if (!hasRun) {
            callback();
            hasRun = true;
        }
    };
}

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

/**
 * Utility function to chain stream success/fail state as promises
 */
function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('error', reject);;
        stream.on('end', resolve);
    });
}
