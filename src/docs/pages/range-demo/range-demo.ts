import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./range-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
})
export class RangeDemo {
    componentSource: string = require('!!raw!../../../components/range/range.component.ts');
    rangeValDynamic: number = 35;
}
