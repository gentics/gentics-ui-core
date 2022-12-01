'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const del = require('del');
const filter = require('gulp-filter');
const gutil = require('gulp-util');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const tildeImporter = require('node-sass-tilde-importer');
const npmArgs = JSON.parse(process.env.npm_config_argv);

const paths = {
    src: {
        jekyll: 'projects/docs/jekyll.yaml',
        fonts: 'src/assets/fonts/*.*',
        scss: ['src/**/*.scss', '!src/docs/**/*.scss'],
        scssMain: 'src/styles/core.scss',
        readme: '*.md'
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
            lib: 'dist/gentics-ui-core'
        }
    },
    vendorStatics: []
};

// Allow to versions docs
prefixDocsVersion();

gulp.task('assets', gulp.series(
    buildUiCoreTasks,
    buildDocsTasks
));

// Run only when gentics-ui-core is building
function buildDocsTasks() {
    if(npmArgs.remain.indexOf('gentics-ui-core') === -1) {
        return new Promise(gulp.series(
            cleanDocsFolder,
            copyDocsFiles,
            copyJekyllConfig
        ));
    }
    return resolvePromiseDummy();
}

// Run only when gentics-ui-core is not building
function buildUiCoreTasks() {
    if(npmArgs.remain.indexOf('gentics-ui-core') !== -1) {
        return new Promise(gulp.series(compileDistStyles, copyDistReadme));
    }
    return resolvePromiseDummy();
}

function cleanDocsFolder() {
    return del([`${paths.out.docs.base}/**`, `!${paths.out.docs.base}/_versions`, `!${paths.out.docs.base}/_versions/**`, `!${paths.out.docs.base}`]);
}

function copyDocsFiles() {
    return streamToPromise(
        gulp.src(paths.out.dist.docs)
            .pipe(gulp.dest(paths.out.docs.base))
    );
}

// Copy GH Pages publish configuration
function copyJekyllConfig() {
    return streamToPromise(
        gulp.src(paths.src.jekyll)
            .pipe(rename('_config.yaml'))
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
    return streamToPromise(
            gulp.src(paths.src.scss)
                .pipe(gulp.dest(paths.out.dist.lib))
        );
}

function copyDistReadme() {
    return streamToPromise(
            gulp.src(paths.src.readme)
                .pipe(gulp.dest(paths.out.dist.lib))
        );
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

function resolvePromiseDummy() {
    return new Promise(function(resolve, reject) {
      resolve();
    })
}

function prefixDocsVersion() {
    const docsOutPathKeys = ['css', 'base', 'fonts', 'images'];
    if (process.env.npm_config_docsVersion !== undefined) {
        const version = process.env.npm_config_docsVersion.trim();
        for ( let i in docsOutPathKeys ) {
            paths.out.docs[docsOutPathKeys[i]] = paths.out.docs[docsOutPathKeys[i]].replace('docs', 'docs/_versions/' + version);
        }
    }
}
