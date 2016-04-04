import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES, Button, DropdownList} from '../../../index';

@Component({
    template: require('./dropdown-list-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button, DropdownList]
})
export class DropdownListDemo {
}
