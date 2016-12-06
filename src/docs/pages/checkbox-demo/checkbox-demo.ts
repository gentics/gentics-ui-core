import {Component} from '@angular/core';

@Component({
    templateUrl: './checkbox-demo.tpl.html'
})
export class CheckboxDemo {

    componentSource: string = require('!!raw-loader!../../../components/checkbox/checkbox.component.ts');

    someBoolean: boolean = false;
    checkStates: any = {
        A: true,
        B: false,
        C: 'indeterminate'
    };
    checkText: string = 'checked';
    statelessIsChecked: boolean = false;
}
