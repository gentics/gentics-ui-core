import {Component} from '@angular/core';

@Component({
    templateUrl: './checkbox-demo.tpl.html'
})
export class CheckboxDemo {

    componentSource: string = require('!!raw-loader!../../../components/checkbox/checkbox.component.ts');

    readonly: boolean = false;
    someBoolean: boolean = false;
    booleanVariable: boolean = true;
    checkStates: any = {
        A: true,
        B: false,
        C: 'indeterminate'
    };
    checkText: string = 'checked';
    statelessIsChecked: boolean = false;
}
