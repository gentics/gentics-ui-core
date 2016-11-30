import {Component} from '@angular/core';

@Component({
    template: require('./side-menu-demo.tpl.html'),
    styles: [
        `.demo-container {
            height: 300px; 
            position: relative; 
            border: 1px solid #333; 
            overflow: hidden;
            background-color: #eee;
        }
        .my-menu-content {
            text-align: center;
        }`
    ]
})
export class SideMenuDemo {
    componentSource: string = require('!!raw!../../../components/side-menu/side-menu.component.ts');
    displayMenu1: boolean = false;
    displayMenu2: boolean = false;
    menuPosition: string = 'left';
    menuWidth: string = '400px';
}
