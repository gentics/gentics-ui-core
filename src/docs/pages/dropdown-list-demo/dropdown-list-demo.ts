import {Component} from '@angular/core';

@Component({
    templateUrl: './dropdown-list-demo.tpl.html'
})
export class DropdownListDemo {
    componentSource: string = require('!!raw-loader!../../../components/dropdown-list/dropdown-list.component.ts');
}
