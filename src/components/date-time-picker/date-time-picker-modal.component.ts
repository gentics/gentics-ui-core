import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';

import {IModalDialog} from '../modal/modal-interfaces';
import {DateTimePickerStrings} from './date-time-picker-strings';
import {defaultStrings} from './date-time-picker-default-strings';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {MomentStatic, Moment} from './moment-types';

/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
const rome: any = require('rome');
const momentjs: MomentStatic = rome.moment;

/**
 * The modal powering the `DateTimePicker` component.
 */
@Component({
    selector: 'gtx-date-time-picker-modal',
    templateUrl: './date-time-picker-modal.tpl.html'
})
export class DateTimePickerModal implements IModalDialog, OnDestroy {

    private static momentLocales: [DateTimePickerStrings, string][] = [[defaultStrings, 'en']];

    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    @Input() timestamp: number;

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    @Input() displayTime: boolean = true;

    /**
     * Set to `false` to omit the seconds of the time picker part. Defaults to `true`
     */
    @Input() displaySeconds: boolean = true;

    /**
     * Set to overwrite texts and date formatting in the modal.
     */
    formatProvider: DateTimePickerFormatProvider = new DateTimePickerFormatProvider();

    @ViewChild('calendarContainer')
    calendarContainer: ElementRef;

    /** @internal */
    private value: Moment = momentjs();

    /**
     * cal is an instance of a Rome calendar, for the API see https://github.com/bevacqua/rome#rome-api
     */
    private cal: any;

    private time: any = {
        h: 0,
        m: 0,
        s: 0
    };
    private dateOrder: 'dmy' | 'ymd' | 'mdy' = 'mdy';
    private subscription: Subscription;

    ngOnInit(): void {
        this.value = momentjs.unix(Number(this.timestamp));

        // Update strings and date format when format provider emits a change
        this.subscription = Observable.of(1)
            .concat(this.formatProvider.changed$ || Observable.never)
            .subscribe(() => {
                this.value.locale(this.getMomentLocale());
                this.updateTimeObject(this.value);
                this.determineDateOrder();
            });
    }

    /**
     * Initialize the Rome widget instance.
     */
    ngAfterViewInit(): void {
        let calendarEl: Element = this.calendarContainer.nativeElement;
        this.cal = rome(calendarEl, { time: false, initialValue: this.value })
            .on('data', () => this.value = this.cal.getMoment());
    }

    ngOnDestroy(): void {
        if (this.cal) {
            this.cal.off('data');
            this.cal.destroy();
            this.cal = undefined;
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Update the this.value in accordance with the input of one of the
     * time fields (h, m, s).
     */
    updateTime(segment: string, value: number): void {
        switch (segment) {
            case 'hours':
                this.value.hour(value);
                break;
            case 'minutes':
                this.value.minute(value);
                break;
            case 'seconds':
                this.value.second(value);
                break;
            default:
        }

        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    }

    /**
     * Handler for the incrementing the time values when up or down arrows are pressed.
     */
    timeKeyHandler(segment: string, e: KeyboardEvent): void {
        // UP arrow key
        if (e.keyCode === 38) {
            e.preventDefault();
            this.incrementTime(segment);
        }
        // DOWN arrow key
        if (e.keyCode === 40) {
            e.preventDefault();
            this.decrementTime(segment);
        }
    }

    incrementTime(segment: string): void {
        this.addToTime(segment, 1);
    }

    decrementTime(segment: string): void {
        this.addToTime(segment, -1);
    }

    formatWith(formatString: string): string {
        return this.value.format(formatString);
    }

    getUnixTimestamp(): number {
        return this.value.unix();
    }

    closeFn(timestamp: number): void { }

    cancelFn(): void { }

    registerCloseFn(close: (timestamp: number) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: () => void): void {
        this.cancelFn = cancel;
    }

    public okayClicked(): void {
        this.closeFn(this.value.unix());
    }

    /**
     * Create a momentjs locale from the (possibly localized) strings.
     * @internal
     */
    private getMomentLocale(): string {
        const localeStrings = this.formatProvider.strings;
        const momentLocales = DateTimePickerModal.momentLocales;

        for (let [strings, locale] of momentLocales) {
            if (strings === localeStrings) {
                return locale;
            }
        }

        const newLocale = momentjs.locale('x-gtx-date-picker-' + momentLocales.length, {
            months: localeStrings.months,
            monthsShort: localeStrings.monthsShort ||
                (localeStrings.months &&
                localeStrings.months.map(month => month.substr(0, 3))),
            weekdays: localeStrings.weekdays,
            weekdaysMin: localeStrings.weekdaysMin ||
                (localeStrings.weekdays &&
                localeStrings.weekdays.map(weekday => weekday.substr(0, 2)))
        });
        momentLocales.push([localeStrings, newLocale]);
        return newLocale;
    }

    private determineDateOrder(): void {
        // Stringify 1999-08-22 with the dateProvider to determine the date order (D-M-Y, M-D-Y or Y-M-D).
        const time: string = this.formatProvider.format(momentjs(935272800000), false, false);
        const yearPos = time.indexOf('99');
        const monthPos = time.indexOf('8');
        const dayPos = time.indexOf('22');

        if (dayPos < monthPos && monthPos < yearPos) {
            this.dateOrder =  'dmy';
        } else if (monthPos < dayPos) {
            this.dateOrder =  'mdy';
        } else {
            this.dateOrder =  'ymd';
        }
    }

    /**
     * Increment or decrement the value and update the time object.
     */
    private addToTime(segment: string, increment: number): void {
        this.value.add(increment, segment);
        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    }

    /**
     * Update the time object based on the value of this.value.
     */
    private updateTimeObject(date: Moment): void {
        this.time.h = date.hour();
        this.time.m = date.minute();
        this.time.s = date.second();
    }

    /**
     * Update the Rome calendar widget with the current value.
     */
    private updateCalendar(value: Moment): void {
        if (this.cal) {
            this.cal.setValue(value);
        }
    }
}
