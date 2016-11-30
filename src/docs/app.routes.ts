import {Component} from '@angular/core';
import {Route} from '@angular/router';
import {IPageInfo, pages} from './pageList';

export const routes: Route[] = pages.map((demo: IPageInfo) => {
    return {
        path: demo.name,
        component: demo.component
    };
});

@Component({
    selector: 'default',
    template: ''
})
export class DefaultRoute {}

routes.push({ path: 'index', component: DefaultRoute });
routes.push({ path: '', redirectTo: 'index', pathMatch: 'full' });
