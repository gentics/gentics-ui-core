import {Component} from '@angular/core';
import {Route} from '@angular/router';
import {pages} from './pageList';

@Component({
    selector: 'default',
    template: ''
})
export class DefaultRoute {}

export const routes: Route[] = [
    ...pages,
    { path: 'index', component: DefaultRoute },
    { path: '', redirectTo: 'index', pathMatch: 'full' }
];
