import {Component} from '@angular/core';

@Component({
    template: require('./dropdown-list-demo.tpl.html')
})
export class DropdownListDemo {
    componentSource: string = require('!!raw!../../../components/dropdown-list/dropdown-list.component.ts');
}
