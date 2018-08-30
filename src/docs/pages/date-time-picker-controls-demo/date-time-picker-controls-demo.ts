import {Component} from '@angular/core';

const TWO_WEEKS = 60 * 60 * 24 * 14 * 1000;
const TWO_WEEKS_AGO = Date.now() - TWO_WEEKS;
const TWO_WEEKS_HENCE = Date.now() + TWO_WEEKS;

@Component({
    templateUrl: './date-time-picker-controls-demo.tpl.html'
})
export class DateTimePickerControlsDemo {
    componentSource: string = require('!!raw-loader!../../../components/date-time-picker/date-time-picker-controls.component.ts');
    demoProviderSource = (require('!!raw-loader!../date-time-picker-demo/demo-format-provider.ts') as string).split('\n').slice(3).join('\n');
    timestamp: number = Math.round(Date.now() / 1000);
    min = new Date(TWO_WEEKS_AGO);
    max = new Date(TWO_WEEKS_HENCE);
}
