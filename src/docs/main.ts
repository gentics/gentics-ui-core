require('highlight.js/styles/atelier-estuary-light.css');

import {DocsModule} from './app.module';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

declare const PROD: boolean;
if (PROD) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocsModule)
    .catch((err: any) => console.error(err));
