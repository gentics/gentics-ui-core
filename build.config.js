/**
 * Shared data that is used in the various build config scripts
 */

const paths = {
    src: {
        fonts: 'src/assets/fonts/*.*',
        lint: ['./*.js', 'src/**/*.js', './*.json', 'src/**/*.json',
            'src/**/*.ts', 'src/**/*.spec.ts'],
        scss: ['src/**/*.scss', '!src/docs/**/*.scss'],
        scssMain: 'src/styles/core.scss',
        typescript: ['src/**/*.ts', '!**/*.spec.ts', '!src/docs/**/*.ts'],
        typings: 'typings/*.d.ts',
        tests: 'src/**/*.spec.ts',
        templates: ['src/**/*.tpl.html', '!src/docs/**/*.tpl.html']
    },
    docs: {
        scss: ['src/**/*.scss'],
        scssMain: 'src/docs/app.scss',
        typescriptMain: 'src/docs/bootstrap.ts',
        assets: 'src/docs/assets/**/*.*'
    },
    out: {
        css: 'docs/css',
        docs: 'docs',
        fonts: 'docs/fonts',
        images: 'docs/images',
        js: 'docs/js',
        dist: {
            root: 'dist',
            styles: 'dist/styles',
            fonts: 'dist/fonts'
        }
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
