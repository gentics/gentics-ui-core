/**
 * Shared data that is used in the various build config scripts
 */

const paths = {
    src: {
        lint: ['./*.js', 'src/**/*.js', './*.json', 'src/**/*.json', 'src/**/*.ts', 'src/**/*.spec.ts'],
        scss: ['src/**/*.scss', '!src/**/_*.scss'],
        scssMain: 'src/docs/app.scss',
        typescript: ['src/**/*.ts', '!**/*.spec.ts'],
        typescriptMain: 'src/docs/bootstrap.ts',
        tests: 'src/**/*.spec.ts',
        fonts: 'src/assets/fonts/*.*',
        docsAssets: 'src/docs/assets/**/*.*'
    },
    out: {
        css: 'docs/css',
        docs: 'docs',
        fonts: 'docs/fonts',
        images: 'docs/images',
        js: 'docs/js'
    },
    vendorJS: [
       /* 'node_modules/reflect-metadata/Reflect.js',
        'node_modules/zone.js/dist/zone.js'*/
    ],
    vendorStatics: [
        'node_modules/materialize-css/fonts/roboto/Roboto-*'
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
