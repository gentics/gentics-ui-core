import {Directive, forwardRef} from '@angular/core';
import {DateTimePickerFormatProvider} from '../../../components/date-time-picker/date-time-picker-format-provider.service';
import {DateTimePickerStrings} from '../../../components/date-time-picker/date-time-picker-strings';

@Directive({
    selector: 'gtx-date-time-picker[demo-format-provider]',
    providers: [{ provide: DateTimePickerFormatProvider, useExisting: forwardRef(() => DemoFormatProvider) }]
})
export class DemoFormatProvider extends DateTimePickerFormatProvider {

    strings: DateTimePickerStrings = {
        hours: 'Stunde',
        minutes: 'Minute',
        seconds: 'Sekunde',
        months: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember'
        ],
        monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        cancel: 'Abbrechen',
        okay: 'Okay'
    };

    format(moment: any, showTime: boolean, showSeconds: boolean): string {
        return `Tag ${moment.date()} Monat ${moment.month() + 1} Jahr ${moment.year()}`; 
    }
}
