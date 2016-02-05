'use strict';

import browserify from 'browserify';
import concat from 'gulp-concat';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import watchify from 'watchify';

const vendorScripts = [
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/materialize-css/bin/materialize.js'
];
const paths = {
    build: 'demo'
};

gulp.task('typescript', () => {
    compileAndBundleTypeScript();
});

gulp.task('index', () => {
    return gulp.src('./src/demo/index.html')
        .pipe(gulp.dest(paths.build));
});

gulp.task('vendor-scripts', () => {
    const outPath = path.join(paths.build, 'js');
    gulp.src(vendorScripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(outPath))
});

gulp.task('styles', function() {
    const outPath = path.join(paths.build, 'css');
    gulp.src('./styles/core.scss')
        .pipe(sass())
        .pipe(rename('app.css'))
        .pipe(gulp.dest(outPath));
});

gulp.task('build:demo', ['typescript', 'vendor-scripts', 'index', 'styles']);

gulp.task('watch', ['vendor-scripts', 'index', 'styles'], () => {
    compileAndBundleTypeScript(false);
    gulp.watch(['./styles/**/*.scss', './src/**/*.scss'], ['styles']);
    gulp.watch(['./src/demo/index.html'], ['index']);
});

/**
 * Compiles the TypeScript source and bundles it with Browserify.
 * @param _runOnce {boolean} - When set to false, Watchify will be used to watch the TS source files.
 */
function compileAndBundleTypeScript(_runOnce) {
    const runOnce = _runOnce === undefined ? true : _runOnce;
    const tsConfig = {
        "module": "commonjs",
        "moduleResolution": "node",
        "target": "es5",
        "sourceMap": false,
        "experimentalDecorators": true
    };

    let b = browserify({
        cache: {},
        packageCache: {},
        debug: true
    })
        .plugin(tsify, tsConfig)
        .add('./src/demo/bootstrap.ts');

    if (!runOnce) {
        b = watchify(b);
        b.on('update', bundle);
        b.on('log', gutil.log);
    }

    function bundle() {
        return b.bundle()
            // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('app.js'))
            // optional, remove if you dont want sourcemaps
            //.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
            // Add transformation tasks to the pipeline here.
            //.pipe(sourcemaps.write('./')) // writes .map file
            .pipe(gulp.dest(path.join(paths.build, 'js')));
    }

    return bundle();
}
