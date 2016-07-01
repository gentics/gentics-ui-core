require('zone.js');
require('reflect-metadata');
require('es6-shim');
require('highlight.js/styles/atelier-estuary-light.css');

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {App} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';

bootstrap(App, [
    disableDeprecatedForms(),
    provideForms(),
    APP_ROUTER_PROVIDERS,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
