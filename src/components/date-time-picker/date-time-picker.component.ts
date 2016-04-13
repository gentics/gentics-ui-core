import {Component, Input, Output, EventEmitter, ElementRef, Optional, Self} from 'angular2/core';
import {ControlValueAccessor, NgControl} from 'angular2/common';
import {InputField} from '../input/input.component';
import {Modal} from '../modal/modal.component';
import {Button} from '../button/button.component';

/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
const rome: any = require('rome');
const momentjs: moment.MomentStatic = rome.moment;

/**
 * A form control for selecting a date and (optionally) a time. Depends on [Modal](#/modal).
 *
 * ```
 * <gtx-date-time-picker [(ngModel)]="dateOfBirth"
 *                         label="Date of Birth"
 *                         displayTime="false"
 *                         format="Do MMMM YYYY">
 * </gtx-date-time-picker>
 * ```
 */
@Component({
    selector: 'gtx-date-time-picker',
    template: require('./date-time-picker.tpl.html'),
    directives: [InputField, Modal, Button]
})
export class DateTimePicker implements ControlValueAccessor {

    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    @Input() timestamp: number;

    /**
     * A label for the control
     */
    @Input() label: string = '';

    /**
     * A [moment.js](http://momentjs.com/)-compatible format string which determines how the
     * date/time will be displayed in the input field.
     * See [the moment docs](http://momentjs.com/docs/#/displaying/format/) for valid strings.
     */
    @Input() format: string;

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    @Input() set displayTime(val: any): boolean {
        this._displayTime = val === true || val === 'true';
    }

    /**
     * Fires when the "okay" button is clicked to close the picker.
     */
    @Output() change: EventEmitter<number> = new EventEmitter();

    value: moment.Moment = momentjs();

    // ValueAccessor members
    onChange: any = () => {};
    onTouched: any = () => {};

    /**
     * cal is an instance of a Rome calendar, for the API see https://github.com/bevacqua/rome#rome-api
     */
    private cal: any;
    private showModal: boolean = false;
    private uid: string = 'calendar_' + Math.random().toString(16).slice(2);
    private _displayTime: boolean = true;
    private displayValue: string = ' ';
    private time: any = {
        h: 0,
        m: 0,
        s: 0
    };

    constructor(@Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    /**
     * If a timestamp has been passed in, initialize the value to that time.
     */
    ngOnInit(): void {
        if (this.timestamp) {
            this.value = momentjs.unix(Number(this.timestamp));
            this.displayValue = this.getTimeString(this.value, this._displayTime);
            this.updateTimeObject(this.value);
        }
    }

    /**
     * Initialize the Rome widget instance.
     */
    ngAfterViewInit(): void {
        let calendarEl: Element = document.querySelector('#' + this.uid);
        this.cal = rome(calendarEl, { time: false, initialValue: this.value })
            .on('data', () => this.value = this.cal.getMoment());
    }

    ngOnDestroy(): void {
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
     * If the input is focused and the Enter key is pressed, we want this to
     * open the picker modal.
     */
    inputKeyHandler(e: KeyboardEvent): void {
        // Enter key
        if (e.keyCode === 13) {
            this.showModal = true;
        }
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

    /**
     * Update the displayed value and close the modal.
     */
    confirm(modal: Modal): void {
        this.displayValue = this.getTimeString(this.value, this._displayTime);
        this.change.emit(this.value.unix());
        this.onChange();
        modal.closeModal();
    }

    /**
     * Close the picker widget without updating the displayed value or emitting a change event.
     */
    cancel(modal: Modal): void {
        modal.closeModal();
    }

    writeValue(value: number): void {
        if (value) {
            this.value = momentjs.unix(Number(value));
            this.displayValue = this.getTimeString(this.value, this._displayTime);
            this.updateTimeObject(this.value);
            this.updateCalendar(this.value);
        }
    }

    registerOnChange(fn: Function): void {
        this.onChange = () => fn(this.value.unix());
    }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

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

    /**
     * Returns a human-readable string to be displayed in the control input field.
     */
    private getTimeString(date: moment.Moment, displayTime: boolean): string {
        if (this.format) {
            return date.format(this.format);
        }
        let formatString: string = 'DD/MM/YYYY';
        formatString += displayTime ? ', HH:mm:ss' : '';
        return date.format(formatString);
    }
}
