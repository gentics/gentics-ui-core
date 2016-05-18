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

gulp.task('lib:clean', cleanDirectory(paths.out.dist.root));
gulp.task('lib:typescript', compileLibTypescript);
gulp.task('lib:templates', copyTemplates);
gulp.task('lib:styles', compileLibStyles);
gulp.task('lib:fonts', copyFontsTo(paths.out.dist.fonts));
gulp.task('lib:build', gulp.parallel('lib:typescript', 'lib:templates', 'lib:styles', 'lib:fonts'));
gulp.task('lib:rebuild', gulp.series('lib:clean', 'lib:build'));
gulp.task('lint', lint);
gulp.task('webpack:watch', watchWebpack);
gulp.task('webpack:run', runWebpack);
gulp.task('docs:clean', cleanDirectory(paths.out.docs));
gulp.task('docs:static-files', gulp.parallel(copyFontsTo(paths.out.fonts), copyImagesToDocs));
gulp.task('docs:styles', compileDocsSASS);
gulp.task('docs:build', gulp.series('webpack:run', 'docs:styles', 'docs:static-files'));
gulp.task('docs:rebuild', gulp.series('docs:clean', 'docs:build'));
gulp.task('docs:watch', gulp.series(
    gulp.parallel('docs:styles', 'docs:static-files'),
    gulp.parallel('webpack:watch', watchDocs)
));
gulp.task('clean', gulp.parallel('lib:clean', 'docs:clean'));
gulp.task('test:run', callback => runKarmaServer(false, callback));
gulp.task('test:watch', callback => runKarmaServer(true, callback));

function cleanDirectory(directory) {
    return function clean() {
        return del([`${directory}/**`, `!${directory}`]);
    };
}

function compileLibTypescript() {
    let tsResult = gulp.src(paths.src.typescript.concat(paths.src.typings))
        .pipe(ts({
            noImplicitAny: true,
            outDir: 'dist',
            module: 'commonjs',
            target: 'es5',
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            sourceMap: true,
            moduleResolution: 'node',
            declaration: true
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.out.dist.root)),
        tsResult.js.pipe(gulp.dest(paths.out.dist.root))
    ]);
}

function copyTemplates() {
    return (
        gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.out.dist.root))
    );
}

function compileLibStyles() {
    return merge([
        gulp.src(paths.src.scss)
            .pipe(gulp.dest(paths.out.dist.root)),
        gulp.src('node_modules/materialize-css/sass/**/*.scss')
            .pipe(gulp.dest(path.join(paths.out.dist.styles, 'materialize-css/sass')))
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

function lint(doneCallback) {
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
        .on('end', () => doneCallback(errors.length ? errors : null));
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
        }).on('error', sass.logError))
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
    gulp.watch(paths.docs.scss, gulp.parallel('docs:styles'));
    gulp.watch(paths.src.vendorStatics, gulp.parallel('docs:static-files'));
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
