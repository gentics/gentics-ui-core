import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./date-time-picker-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode]
})
export class DateTimePickerDemo {
    componentSource: string = require('!!raw!../../../components/date-time-picker/date-time-picker.component.ts');
    
    timestamp: number = 1457971763;
}
