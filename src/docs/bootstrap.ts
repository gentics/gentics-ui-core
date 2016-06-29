require('zone.js');
require('reflect-metadata');
require('es6-shim');
require('highlight.js/styles/atelier-estuary-light.css');

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {App} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
