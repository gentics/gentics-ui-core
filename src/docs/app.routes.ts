import {Component} from '@angular/core';
import {Route} from '@angular/router';
import {pages} from './pageList';

export const routes: Route[] = [
    ...pages,
    { path: '', redirectTo: 'instructions', pathMatch: 'full' },
    { path: '**', redirectTo: 'instructions' }
];
