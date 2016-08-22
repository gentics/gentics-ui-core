require('es6-shim');
require('zone.js');
require('reflect-metadata');
require('highlight.js/styles/atelier-estuary-light.css');

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {App} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';
import {logTemplateErrors} from './development-tools';

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    logTemplateErrors(),
    Title,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
])
.catch(err => console.error(err));
