import {Component, ElementRef, ViewChild} from '@angular/core';

import {IModalDialog} from '../modal/modal-interfaces';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';

/**
 * The modal powering the `DateTimePicker` component.
 */
@Component({
    selector: 'gtx-date-time-picker-modal',
    templateUrl: './date-time-picker-modal.tpl.html'
})
export class DateTimePickerModal implements IModalDialog {

    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    timestamp: number;

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    displayTime: boolean = true;

    /**
     * Set to `false` to omit the seconds of the time picker part. Defaults to `true`
     */
    displaySeconds: boolean = true;

    /**
     * Set to overwrite texts and date formatting in the modal.
     */
    formatProvider: DateTimePickerFormatProvider = new DateTimePickerFormatProvider();

    min: Date;

    max: Date;

    selectYear: boolean;

    @ViewChild('calendarContainer')
    calendarContainer: ElementRef;

    valueTimestamp: number;

    closeFn(timestamp: number): void { }

    cancelFn(val?: any): void { }

    registerCloseFn(close: (timestamp: number) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    okayClicked(): void {
        this.closeFn(this.valueTimestamp || this.timestamp);
    }
}
