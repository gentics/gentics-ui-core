'use strict';

import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import gulpFilter from 'gulp-filter';
import gutil from 'gulp-util';
import jscs from 'gulp-jscs';
import jscsStylish from 'gulp-jscs-stylish';
import path from 'path';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import tslint from 'gulp-tslint';
import tslintStylish from 'tslint-stylish';
import watchify from 'watchify';

const paths = {
    src: {
        scss: ['src/**/*.scss', '!src/**/_*.scss'],
        html: 'src/demo/index.html',
        typescriptMain: 'src/demo/bootstrap.ts',
        typescript: 'src/**/*.ts'
    },
    out: {
        css: 'build/demo/css',
        demo: 'build/demo',
        fonts: 'build/demo/font/roboto',
        html: 'build/demo',
        js: 'build/demo/js'
    },
    vendorJS: [
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/jquery/dist/jquery.js',
        'node_modules/materialize-css/bin/materialize.js'
    ],
    vendorStatics: [
        'node_modules/materialize-css/font/roboto/Roboto-Regular.*'
    ]
};

gulp.task('build:demo', [
    'typescript',
    'vendor-scripts',
    'html',
    'styles',
    'static-files'
]);

gulp.task('clean', () => {
    return del([
        paths.out.demo + '/**',
        '!' + paths.out.demo
    ]);
});

gulp.task('html', () => {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.out.html));
});

gulp.task('lint', () => {
    const tsPaths = paths.src.typescript;
    const jsPaths = ['gulpfile.babel.js'];

    const jscsRunner = new Promise((resolve, reject) => {
        gulp.src(jsPaths, { base: '.' })
            .pipe(jscs())
            .pipe(jscsStylish())
            .on('error', reject)
            .on('end', resolve)
            .pipe(jscs.reporter('fail'));
    });

    const tslintRunner = new Promise((resolve, reject) => {
        gulp.src(tsPaths, { base: '.' })
            .pipe(tslint())
            .on('error', reject)
            .on('end', resolve)
            .pipe(tslint.report(tslintStylish, {
                emitError: true,
                summarizeFailureOutput: true
            }));
    });

    // Run jscs and tslint in series, pass jscs error if tslint succeeds
    return jscsRunner.then(
        tslintRunner,
        err => tslintRunner.then(() => Promise.reject(err))
    );
});

gulp.task('static-files', () => {
    gulp.src(paths.vendorStatics)
        .pipe(gulpFilter([
            '*.eot',
            '*.ttf',
            '*.woff',
            '*.woff2'
        ]))
        .pipe(gulp.dest(paths.out.fonts));
});

gulp.task('styles', () => {
    return gulp.src(paths.src.scss, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['node_modules'] }))
        .pipe(rename('app.css'))
        .pipe(sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: relativeRoot(paths.out.css)
        }))
        .pipe(gulp.dest(paths.out.css));
});

gulp.task('typescript', () => {
    return compileAndBundleTypeScript();
});

gulp.task('vendor-scripts', () => {
    return gulp.src(paths.vendorJS, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: relativeRoot(paths.out.js)
        }))
        .pipe(gulp.dest(paths.out.js));
});

gulp.task('watch', ['vendor-scripts', 'html', 'styles'], () => {
    compileAndBundleTypeScript(true);
    gulp.watch(paths.src.scss, ['styles']);
    gulp.watch(paths.src.html, ['html']);
    gulp.watch(paths.src.vendorStatics, ['static-files']);
});

/**
 * Compiles the TypeScript source and bundles it with Browserify.
 * @param watch {boolean} - When true, recompile the TS source files on change.
 */
function compileAndBundleTypeScript(watch) {
    const tsConfig = {
        module: 'commonjs',
        moduleResolution: 'node',
        target: 'es5',
        sourceMap: true,
        experimentalDecorators: true
    };

    let bundler = browserify({
        cache: {},
        packageCache: {},
        debug: true
    })
        .plugin(tsify, tsConfig)
        .add(paths.src.typescriptMain);

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', bundle);
        bundler.on('log', gutil.log);
    }

    function bundle() {
        return bundler.bundle()
            .on('error', error => gutil.log(gutil, 'Browserify Error', error))
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('.', {
                includeContent: true,
                sourceRoot: relativeRoot(paths.out.js)
            }))
            .pipe(gulp.dest(paths.out.js));
    }

    return bundle();
}

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
