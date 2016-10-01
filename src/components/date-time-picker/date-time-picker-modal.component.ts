import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';

import {InputField} from '../input/input.component';
import {Button} from '../button/button.component';
import {IModalDialog} from '../modal/modal-interfaces';

/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
const rome: any = require('rome');
const momentjs: moment.MomentStatic = rome.moment;


/**
 * The modal powering the `DateTimePicker` component.
 */
@Component({
    selector: 'gtx-date-time-picker-modal',
    template: require('./date-time-picker-modal.tpl.html'),
    directives: [InputField, Button],
})
export class DateTimePickerModal implements IModalDialog, OnDestroy {

    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    @Input() timestamp: number;

    /**
     * A [moment.js](http://momentjs.com/)-compatible format string which determines how the
     * date/time will be displayed in the input field.
     * See [the moment docs](http://momentjs.com/docs/#/displaying/format/) for valid strings.
     */
    @Input() format: string;

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    @Input() displayTime: boolean = true;

    /**
     * Set to `false` to omit the seconds of the time picker part. Defaults to `true`
     */
    @Input() displaySeconds: boolean = true;


    value: moment.Moment = momentjs();

    /**
     * cal is an instance of a Rome calendar, for the API see https://github.com/bevacqua/rome#rome-api
     */
    private cal: any;
    private time: any = {
        h: 0,
        m: 0,
        s: 0
    };

    @ViewChild('calendarContainer')
    private calendarContainer: ElementRef;

    ngOnInit(): void {
        this.value = momentjs.unix(Number(this.timestamp));
        this.updateTimeObject(this.value);
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
        this.cal.off('data');
        this.cal.destroy();
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

    closeFn(timestamp: number): void { }

    cancelFn(): void { }

    registerCloseFn(close: (timestamp: number) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: () => void): void {
        this.cancelFn = cancel;
    }

    private okayClicked(): void {
        this.closeFn(this.value.unix());
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
    private updateTimeObject(date: moment.Moment): void {
        this.time.h = date.hour();
        this.time.m = date.minute();
        this.time.s = date.second();
    }

    /**
     * Update the Rome calendar widget with the current value.
     */
    private updateCalendar(value: moment.Moment): void {
        if (this.cal) {
            this.cal.setValue(value);
        }
    }
}
