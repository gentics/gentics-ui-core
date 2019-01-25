'use strict';

const gulp = require('gulp');
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
        dist: {
            root: 'dist/gentics-ui-core',
            styles: 'dist/gentics-ui-core/styles',
            fonts: 'dist/gentics-ui-core/fonts'
        }
    }
};

gulp.task('assets', gulp.series(
    gulp.parallel(
        compileDistStyles
    )
));

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
