import {Component} from '@angular/core';

@Component({
    templateUrl: './dropdown-list-demo.tpl.html',
    styles: [`
        .sticky-demo gtx-dropdown-item { 
            display: flex;
        }
    `]
})
export class DropdownListDemo {
    componentSource: string = require('!!raw-loader!../../../components/dropdown-list/dropdown-list.component.ts');
    dropdownIsDisabled = false;
}
