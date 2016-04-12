import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {BaseDoc, Autodocs} from '../autodocs';
import {DemoBlock} from '../demo-block/demo-block.component';
import {HighlightedCode} from '../highlighted-code/highlighted-code.component';

@Component({
    template: require('./checkbox-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
})
export class CheckboxDemo extends BaseDoc {
 
    constructor() {
        super(require('!!raw!../../../components/checkbox/checkbox.component.ts'));
    }

    checkStates: any = {
        A: true,
        B: false,
        C: 'indeterminate'
    };
}
