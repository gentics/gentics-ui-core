import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./radio-button-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
}) 
export class RadioButtonDemo {
    componentSource: string = require('!!raw!../../../components/radio-button/radio-button.component.ts');
}
