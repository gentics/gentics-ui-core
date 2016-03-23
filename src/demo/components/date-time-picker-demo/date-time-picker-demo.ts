import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';

@Component({
    template: require('./date-time-picker-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES]
})
export class DateTimePickerDemo {
    timestamp: number = 1457971763;
}
