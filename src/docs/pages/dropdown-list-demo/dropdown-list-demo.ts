import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Button, DropdownList} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./dropdown-list-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button, DropdownList, Autodocs, DemoBlock, HighlightedCode]
})
export class DropdownListDemo {
    componentSource: string = require('!!raw!../../../components/dropdown-list/dropdown-list.component.ts');
} 
