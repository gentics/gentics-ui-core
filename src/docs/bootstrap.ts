require('es6-shim');
require('reflect-metadata');
require('zone.js');
require('highlight.js/styles/atelier-estuary-light.css');

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {App} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';
import {logTemplateErrors} from './development-tools';
import {DragStateTrackerFactory} from '../components/file-drop-area/drag-state-tracker.service';

bootstrap(App, [
    APP_ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    logTemplateErrors(),
    Title,
    DragStateTrackerFactory,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
])
.catch(err => console.error(err));
