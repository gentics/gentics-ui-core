import {Component} from '@angular/core';

@Component({
    template: require('./checkbox-demo.tpl.html')
})
export class CheckboxDemo {

    componentSource: string = require('!!raw!../../../components/checkbox/checkbox.component.ts');

    someBoolean: boolean = false;
    checkStates: any = {
        A: true,
        B: false,
        C: 'indeterminate'
    };
    checkText: string = 'checked';
}
