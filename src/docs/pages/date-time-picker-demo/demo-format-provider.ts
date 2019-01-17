import {Directive, forwardRef} from '@angular/core';
import {DateTimePickerFormatProvider, DateTimePickerStrings} from 'gentics-ui-core';

@Directive({
    selector: '[demo-format-provider]',
    providers: [{ provide: DateTimePickerFormatProvider, useExisting: forwardRef(() => DemoFormatProvider) }]
})
export class DemoFormatProvider extends DateTimePickerFormatProvider {

    strings: DateTimePickerStrings = {
        hours: 'Stunde',
        minutes: 'Minute',
        seconds: 'Sekunde',
        months: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
        monthsShort: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ],
        weekdays: [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],
        weekdaysShort: [ 'Son', 'Mon', 'Die', 'Mit', 'Don', 'Fri', 'Sam' ],
        weekdaysMin: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
        cancel: 'Abbrechen',
        okay: 'Okay'
    };

    format(moment: any, showTime: boolean, showSeconds: boolean): string {
        return `Tag ${moment.date()} Monat ${moment.month() + 1} Jahr ${moment.year()}`;
    }
}
