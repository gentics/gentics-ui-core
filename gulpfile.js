'use strict';

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const gutil = require('gulp-util');
const path = require('path');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');

const paths = {
    src: {
        fonts: 'src/assets/fonts/*.*',
        scss: ['src/**/*.scss', '!src/docs/**/*.scss'],
        scssMain: 'src/styles/core.scss'
    },
    out: {
        docs: {
            base: 'docs',
            css: 'docs/css',
            fonts: 'docs/fonts',
            images: 'docs/images',
        },
        dist: {
            docs: 'dist/docs/**',
            root: 'dist/gentics-ui-core',
            styles: 'dist/gentics-ui-core/styles',
            fonts: 'dist/gentics-ui-core/fonts'
        }
    },
    vendorStatics: [
        'node_modules/materialize-css/fonts/roboto/Roboto-*'
    ]
};

// Allow to versions docs
prefixDocsVersion();

gulp.task('assets', gulp.series(
    cleanDocsFolder,
    gulp.parallel(
        compileDistStyles,
        copyFontsTo(paths.out.dist.fonts),
        copyDocsFiles
    ),
));

function cleanDocsFolder() {
    return del([`${paths.out.docs.base}/**`, `!${paths.out.docs.base}/_versions`, `!${paths.out.docs.base}/_versions/**`, `!${paths.out.docs.base}`]);
}

function copyDocsFiles() {
    return streamToPromise(
        gulp.src(paths.out.dist.docs)
            .pipe(gulp.dest(paths.out.docs.base))
    );
}

function compileDistStyles() {
    return checkDistSASS().then(copyDistSASS);
}

function checkDistSASS() {
    let stream = (
        gulp.src(paths.src.scssMain, { base: '.' })
            .pipe(sass({
                errLogToConsole: true,
                outputStyle: 'expanded',
                includePaths: ['node_modules'],
                importer: tildeImporter
            }))
            .on('error', () => {
                process.exitCode = 1;
            })
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
                    '**/*.eot',
                    '**/*.ttf',
                    '**/*.woff',
                    '**/*.woff2'
                ]))
                .pipe(gulp.dest(outputFolder))
        );
    };
}

/**
 * Utility function to chain stream success/fail state as promises
 */
function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('end', resolve);
    });
}

function prefixDocsVersion() {
    const docsOutPathKeys = ['css', 'base', 'fonts', 'images'];
    if (process.env.npm_config_docsVersion !== undefined) {
        const version = process.env.npm_config_docsVersion.trim();
        for ( let i in docsOutPathKeys ) {
            paths.out.docs[docsOutPathKeys[i]] = paths.out.docs[docsOutPathKeys[i]].replace('docs', 'docs/_versions/' + version);
        }
    }

    console.log(paths.out);
}
