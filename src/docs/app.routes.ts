import {Component} from '@angular/core';
import {Route, provideRouter} from '@angular/router';
import {IPageInfo, pages} from './pageList';

const routes: Route[] = pages.map((demo: IPageInfo) => {
    return {
        path: demo.name,
        component: demo.component
    };
});

@Component({
    selector: 'default',
    template: ''
})
class DefaultRoute {}

routes.push({ path: 'index', component: DefaultRoute });
routes.push({ path: '', redirectTo: 'index', pathMatch: 'full' });

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
