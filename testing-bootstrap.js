/**
 * Bootstrap file for unit tests, based on the example here:
 * https://github.com/AngularClass/angular2-webpack-starter/blob/23dd27f837fd1d3f3775383beec804ffe79245bf/spec-bundle.js
 *
 * The idea is to use Webpack to dynamically require each of the `.spec.ts` files and also set the
 * test providers in a single place, allowing the testing of DOM in component tests.
 */
require('core-js');
require('reflect-metadata/Reflect');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

Error.stackTraceLimit = 1;

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

require('./src/index.ts');

/*
  We can use the context method on webpack's require to tell
  webpack what files we actually want to require or import.
  For each .spec.ts file, require the file and load it.
 */
const testContext = require.context('./src', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
