/**
 * Shared data that is used in the various build config scripts
 */

const paths = {
    src: {
        lint: ['./*.js', 'src/**/*.js', './*.json', 'src/**/*.json', 'src/**/*.ts', 'src/**/*.spec.ts'],
        scss: ['src/**/*.scss', '!src/**/_*.scss'],
        scssMain: 'src/styles/core.scss',
        typescript: ['src/**/*.ts', '!**/*.spec.ts'],
        typescriptMain: 'src/demo/bootstrap.ts',
        tests: 'src/**/*.spec.ts',
        fonts: 'src/assets/fonts/**.*'
    },
    out: {
        css: 'build/demo/css',
        demo: 'build/demo',
        fonts: 'build/demo/font',
        js: 'build/demo/js'
    },
    vendorJS: [
        'angular2/bundles/angular2-polyfills.js',
        'jquery/dist/jquery.js',
        'materialize-css/bin/materialize.js'
    ],
    vendorStatics: [
        'node_modules/materialize-css/font/roboto/Roboto-Regular.*'
    ]
};

const config = {
    autoprefixer: {
        browsers: [
            'last 2 Chrome versions',
            'last 2 Edge versions',
            'Firefox ESR',
            'IE 11',
            '> 3%'
        ],
        cascade: false
    }
};

module.exports = {
    paths,
    config
};
