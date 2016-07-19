/**
 * Bootstrap file for unit tests, based on the example here:
 * https://github.com/AngularClass/angular2-webpack-starter/blob/23dd27f837fd1d3f3775383beec804ffe79245bf/spec-bundle.js
 *
 * The idea is to use Webpack to dynamically require each of the `.spec.ts` files and also set the
 * test providers in a single place, allowing the testing of DOM in component tests.
 */
require('es6-shim');
require('zone.js');
require('reflect-metadata');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/async-test');

Error.stackTraceLimit = Infinity;
var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');
var forms = require('@angular/forms');

testing.setBaseTestProviders(
    browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);

beforeEach(function () {
    testing.addProviders([
        forms.disableDeprecatedForms(),
        forms.provideForms()
    ]);
});

require('./src/index.ts');

/*
  We can use the context method on webpack's require to tell
  webpack what files we actually want to require or import.
  For each .spec.ts file, require the file and load it.
 */
var testContext = require.context('./src', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
