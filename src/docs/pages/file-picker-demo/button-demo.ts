import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./button-demo.tpl.html'),
    styles: [`gtx-button { margin-bottom: 10px; }`],
    directives: [GTX_FORM_DIRECTIVES, Button, Autodocs, DemoBlock, HighlightedCode]
})
export class ButtonDemo {

    componentSource: string = require('!!raw!../../../components/button/button.component.ts');

    clickCount: number = 0;
    constructor() {}
}
