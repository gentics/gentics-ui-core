/**
 * Shared data that is used in the various build config scripts
 */

const paths = {
    src: {
        scss: ['src/**/*.scss', '!src/**/_*.scss'],
        typescriptMain: 'src/demo/bootstrap.ts',
        typescript: 'src/**/!(*.spec).ts',
        tests: 'src/**/*.spec.ts'
    },
    out: {
        css: 'build/demo/css',
        demo: 'build/demo',
        fonts: 'build/demo/font/roboto',
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

module.exports = {
    paths
};
