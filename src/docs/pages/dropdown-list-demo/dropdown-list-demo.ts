import {Component} from '@angular/core';
import {DropdownList} from '../../../components/dropdown-list/dropdown-list.component';

@Component({
    templateUrl: './dropdown-list-demo.tpl.html',
    styles: [`
        .sticky-demo gtx-dropdown-item { 
            display: flex;
        }
        .resize-buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .resize-buttons gtx-button {
            flex: 1;
        }
    `]
})
export class DropdownListDemo {
    componentSource: string = require('!!raw-loader!../../../components/dropdown-list/dropdown-list.component.ts');
    dropdownIsDisabled = false;
    variableItems: string[] = ['Item 1', 'Item 2', 'Item 3'];

    add(dropdown: DropdownList): void {
        const count = this.variableItems.length;
        this.variableItems.push(`Item ${count + 1}`);
        dropdown.resize();
    }

    remove(dropdown: DropdownList): void {
        if (0 < this.variableItems.length) {
            this.variableItems.pop();
            dropdown.resize();
        }
    }
}
