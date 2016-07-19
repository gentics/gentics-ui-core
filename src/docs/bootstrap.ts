require('zone.js');
require('reflect-metadata');
require('es6-shim');
require('highlight.js/styles/atelier-estuary-light.css');

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {App} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    Title,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
