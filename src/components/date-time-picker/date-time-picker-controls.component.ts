import {Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Subscription, of, concat, never} from 'rxjs';
import{concatMap} from 'rxjs/operators'
import {DateTimePickerStrings} from './date-time-picker-strings';
import {defaultStrings} from './date-time-picker-default-strings';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {coerceToBoolean} from '../../common/coerce-to-boolean';
import * as momentjs from 'moment';

/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 *
 * Note that Rome comes with its own (outdated) version of Moment.js, which we do not want to use.
 * Therefore we use the "standalone" distribution of Rome. However, this comes with the caveat that it
 * expects a global "moment" object to be defined (https://github.com/bevacqua/rome/issues/31)
 * So we define it, instantiate Rome, and then delete the global.
 */
(window as any).moment = momentjs;
const rome: any = require('rome/src/rome.standalone');
rome.use(momentjs);
delete (window as any).moment;

// http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
const MAX_DATE_MILLISECONDS = 8640000000000000;

export type TimeUnit = 'hours' | 'minutes' | 'seconds';

/**
 * The controls (calendar view, year & time inputs) powering the `DateTimePicker` component. Can be used as a stand-alone component.
 */
@Component({
    selector: 'gtx-date-time-picker-controls',
    templateUrl: './date-time-picker-controls.tpl.html'
})
export class DateTimePickerControls implements OnDestroy {

    private static momentLocales: [DateTimePickerStrings, string][] = [[defaultStrings, 'en']];

    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    @Input() timestamp: number;

    /**
     * Set to overwrite texts and date formatting in the modal.
     */
    @Input() formatProvider: DateTimePickerFormatProvider = new DateTimePickerFormatProvider();

    /**
     * The minimum date allowable. E.g. `new Date(2015, 2, 12)`
     */
    @Input() min: Date;

    /**
     * The maximum date allowable. E.g. `new Date(2031, 1, 30)`
     */
    @Input() max: Date;

    /**
     * If true, the year may be selected from a Select control
     */
    @Input() set selectYear(val: any) {
        this._selectYear = coerceToBoolean(val);
    }
    get selectYear(): any { return this._selectYear; }

    /**
     * Set to `true` to disable the input field and not show the date picker on click.
     */
    @Input() set disabled(val: any) {
        this._disabled = coerceToBoolean(val);
    }
    get disabled(): any { return this._disabled; }

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    @Input() set displayTime(val: any) {
        this._displayTime = coerceToBoolean(val);
    }
    get displayTime(): any { return this._displayTime; }

    /**
     * Set to `false` to omit the seconds of the time picker part. Defaults to `true`
     */
    @Input() set displaySeconds(val: any) {
        this._displaySeconds = coerceToBoolean(val);
    }
    get displaySeconds(): any { return this._displaySeconds; }

    /**
     * When `true`, the controls use the "compact" (small screen) styling for all screen sizes. Defaults to `false`
     */
    @Input() set compact(val: any) {
        this._compact = coerceToBoolean(val);
    }
    get compact(): any { return this._compact; }

    /**
     * Emits the unix timestamp of the current value on changes.
     */
    @Output() change = new EventEmitter<number>();

    @ViewChild('calendarContainer')
    calendarContainer: ElementRef;

    dateOrder: 'dmy' | 'ymd' | 'mdy' = 'mdy';

    years: number[] = [];

    _selectYear: boolean = false;
    _disabled: boolean = false;
    _displayTime: boolean = false;
    _displaySeconds: boolean = false;
    @HostBinding('class.compact')
    _compact: boolean = false;

    /** @internal */
    private value = momentjs();

    /**
     * cal is an instance of a Rome calendar, for the API see https://github.com/bevacqua/rome#rome-api
     */
    private cal: any;

    private time: any = {
        h: 0,
        m: 0,
        s: 0
    };
    private subscription: Subscription;

    ngOnInit(): void {
        this.value = momentjs.unix(Number(this.timestamp));

        // Update strings and date format when format provider emits a change
        this.subscription = of(1)
            // .concat(this.formatProvider.changed$ || Observable.never) --> RXJS 5
            .pipe(concatMap(this.formatProvider.changed$||never))
            .subscribe(() => {
                this.value.locale(this.getMomentLocale());
                this.updateTimeObject(this.value);
                this.determineDateOrder();
            });

        this.min = this.min instanceof Date ? this.min : new Date(-MAX_DATE_MILLISECONDS);
        this.max = this.max instanceof Date ? this.max : new Date(MAX_DATE_MILLISECONDS);
        // We don't want a date select which is stupidly long
        const MAX_YEAR_RANGE = 500;

        let minYear = this.min.getFullYear();
        let maxYear = this.max.getFullYear();
        const thisYear = new Date().getFullYear();
        if (MAX_YEAR_RANGE < maxYear - minYear) {
            minYear = thisYear - Math.floor(MAX_YEAR_RANGE / 2);
            maxYear = thisYear + Math.floor(MAX_YEAR_RANGE / 2);
        }

        for (let year = minYear; year <= maxYear; year ++) {
            this.years.push(year);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['timestamp']) {
            this.value = momentjs.unix(Number(this.timestamp));
            this.updateTimeObject(this.value);
            if (this.cal) {
                this.cal.setValue(this.value);
            }
        }
        if (changes['min']) {
            const currentValue = changes['min'].currentValue;
            if (currentValue && !(changes['min'].currentValue instanceof Date)) {
                throw new Error(`min must be a Date object. Got ${typeof changes['min'].currentValue}`);
            }
        }
        if (changes['max']) {
            const currentValue = changes['max'].currentValue;
            if (currentValue && !(changes['max'].currentValue instanceof Date)) {
                throw new Error(`max must be a Date object. Got ${typeof changes['max'].currentValue}`);
            }
        }
    }

    /**
     * Initialize the Rome widget instance.
     */
    ngAfterViewInit(): void {
        let calendarEl: Element = this.calendarContainer.nativeElement;
        const romeConfig: any = { time: false, initialValue: this.value };
        if (this.min) {
            romeConfig.min = this.min;
        }
        if (this.max) {
            romeConfig.max = this.max;
        }
        this.cal = rome(calendarEl, romeConfig)
            .on('data', () => {
                this.value = this.cal.getMoment();
                this.change.emit(this.value.unix());
            });
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
    updateTime(unit: TimeUnit, value: number): void {
        const newValue = this.updateByUnits(this.value.clone(), unit, value);
        if (newValue.isBefore(this.min) || newValue.isAfter(this.max)) {
            // the new year is out of the allowed range
            return;
        }

        this.updateByUnits(this.value, unit, value);
        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    }

    /**
     * Handler for the incrementing the time values when up or down arrows are pressed.
     */
    timeKeyHandler(unit: TimeUnit, e: KeyboardEvent): void {
        // UP arrow key
        if (e.keyCode === 38) {
            e.preventDefault();
            this.incrementTime(unit);
        }
        // DOWN arrow key
        if (e.keyCode === 40) {
            e.preventDefault();
            this.decrementTime(unit);
        }
    }

    incrementTime(unit: TimeUnit): void {
        this.addToTime(unit, 1);
    }

    decrementTime(unit: TimeUnit): void {
        this.addToTime(unit, -1);
    }

    formatWith(formatString: string): string {
        return this.value.format(formatString);
    }

    getUnixTimestamp(): number {
        return this.value.unix();
    }

    setYear(year: number): void {
        const newValue = this.value.clone().year(year);
        if (newValue.isBefore(this.min) || newValue.isAfter(this.max)) {
            // the new year is out of the allowed range
            return;
        }
        this.value.year(year);
        this.updateCalendar(this.value);
    }

    private updateByUnits(moment: momentjs.Moment, unit: TimeUnit, value: number): momentjs.Moment {
        switch (unit) {
            case 'hours':
                moment.hour(value);
                break;
            case 'minutes':
                moment.minute(value);
                break;
            case 'seconds':
                moment.second(value);
                break;
            default:
        }
        return moment;
    }

    /**
     * Create a momentjs locale from the (possibly localized) strings.
     * @internal
     */
    private getMomentLocale(): string {
        const localeStrings = this.formatProvider.strings;
        const momentLocales = DateTimePickerControls.momentLocales;

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
    private addToTime(unit: TimeUnit, increment: number): void {
        const newValue = this.value.clone().add(increment, unit);
        if (newValue.isBefore(this.min) || newValue.isAfter(this.max)) {
            // the new time is out of the allowed range
            return;
        }
        this.value.add(increment, unit);
        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    }

    /**
     * Update the time object based on the value of this.value.
     */
    private updateTimeObject(date: momentjs.Moment): void {
        this.time.h = date.hour();
        this.time.m = date.minute();
        this.time.s = date.second();
    }

    /**
     * Update the Rome calendar widget with the current value.
     */
    private updateCalendar(value: momentjs.Moment): void {
        if (this.cal) {
            this.cal.setValue(value);
            this.change.emit(value.unix());
        }
    }
}
