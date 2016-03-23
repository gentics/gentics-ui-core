import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';

@Component({
    template: require('./checkbox-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES]
})
export class CheckboxDemo {
    checkStates: any = {
        A: true,
        B: false,
        C: 'indeterminate',
        D: true
    };
}
