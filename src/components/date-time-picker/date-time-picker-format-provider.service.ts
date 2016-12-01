import {Injectable} from '@angular/core';
import {DateTimePickerStrings} from './date-time-picker-strings';
import {defaultStrings} from './date-time-picker-default-strings';
import {Observable} from 'rxjs';


/**
 * Format provider to localize the DateTimePicker component.
 */
@Injectable()
export class DateTimePickerFormatProvider {

    /** Texts uses by the DateTimePicker modal. */
    strings: DateTimePickerStrings = defaultStrings;

    /** May emit a value when the translations or the date format changed. */
    changed$: Observable<any> = Observable.never();

    /** Formats a human-readable string to be displayed in the control input field. */
    format(date: moment.Moment, displayTime: boolean, displaySeconds: boolean): string {
        let formatString = displayTime ? (displaySeconds ? 'L, LTS' : 'L, LT') : 'L';
        return date.format(formatString);
    }
}
