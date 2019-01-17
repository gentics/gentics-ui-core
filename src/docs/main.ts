require('highlight.js/styles/atelier-estuary-light.css');

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DocsModule} from './app.module';
import {environment} from '../../projects/docs/environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocsModule)
    .catch((err: any) => console.error(err));
