const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const tsify = require('tsify');
const sass = require('gulp-sass');

const vendorScripts = [
    'node_modules/angular2/bundles/angular2-polyfills.js'
];
const paths = {
    build: 'demo'
};

gulp.task('typescript', () => {
    var config = {
        debug: true
    };
    var tsConfig = {
        "module": "commonjs",
        "moduleResolution": "node",
        "target": "es5",
        "sourceMap": true,
        "experimentalDecorators": true
    };
    var b = browserify(config)
        .plugin(tsify, tsConfig)
        .add('./src/demo/bootstrap.ts');

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(paths.build));
});

gulp.task('index', () => {
    return gulp.src('./src/demo/index.html')
        .pipe(gulp.dest(paths.build));
});

gulp.task('scripts', () => {
    gulp.src(vendorScripts)
    .pipe(gulp.dest(paths.build))
});

gulp.task('build:demo', ['typescript', 'scripts', 'index']);