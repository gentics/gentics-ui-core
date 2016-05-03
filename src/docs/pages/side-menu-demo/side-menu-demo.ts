import {Component} from '@angular/core';
import {SideMenu} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./side-menu-demo.tpl.html'),
    directives: [SideMenu, Autodocs, DemoBlock, HighlightedCode]
})
export class SideMenuDemo {
    componentSource: string = require('!!raw!../../../components/side-menu/side-menu.component.ts');
} 
