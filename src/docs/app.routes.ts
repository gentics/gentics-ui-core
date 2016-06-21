import {Component} from '@angular/core';
import {Router, RouterConfig, Route, provideRouter} from '@angular/router';
import {IPageInfo, pages} from './pageList';

const routes: Route[] = pages.map((demo: IPageInfo) => {
   return {
       path: demo.name,
       component: demo.component
   };
});

routes.push({
    path: 'index',
    component: DefaultRoute
});

@Component({
    selector: 'default',
    template: ''
})
class DefaultRoute {}

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
