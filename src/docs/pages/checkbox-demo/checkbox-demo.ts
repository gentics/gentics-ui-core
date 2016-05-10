import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./checkbox-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
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
