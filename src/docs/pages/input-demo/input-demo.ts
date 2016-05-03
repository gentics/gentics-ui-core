import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./input-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
})
export class InputDemo {
    componentSource: string = require('!!raw!../../../components/input/input.component.ts');

    name: string = 'Foo';
}
