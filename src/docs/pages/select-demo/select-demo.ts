import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./select-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
})
export class SelectDemo {
    componentSource: string = require('!!raw!../../../components/select/select.component.ts');
    
    options: string[] = ['foo', 'bar', 'baz', 'quux'];
    selectMultiVal: string[] = ['bar', 'baz'];
    selectVal: string = 'bar';
}
