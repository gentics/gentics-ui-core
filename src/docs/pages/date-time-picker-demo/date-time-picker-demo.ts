import {Component} from '@angular/core';
import {DemoFormatProvider} from './demo-format-provider';

@Component({
    templateUrl: './date-time-picker-demo.tpl.html'
})
export class DateTimePickerDemo {
    componentSource: string = require('!!raw-loader!../../../components/date-time-picker/date-time-picker.component.ts');
    stringsInterfaceSource: string = require('!!raw-loader!../../../components/date-time-picker/date-time-picker-strings.ts');

    timestamp: number = 1457971763;
}
