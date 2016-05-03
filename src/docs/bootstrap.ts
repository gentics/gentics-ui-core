require('zone.js');
require('reflect-metadata');
require('es6-shim');
require('highlight.js/styles/atelier-estuary-light.css');

import {provide} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {App} from './app.component';

bootstrap(App, [
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
