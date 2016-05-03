import { EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/common';
import { Modal } from '../modal/modal.component';
/**
 * A form control for selecting a date and (optionally) a time. Depends on [Modal](#/modal).
 *
 * ```html
 * <gtx-date-time-picker [(ngModel)]="dateOfBirth"
 *                         label="Date of Birth"
 *                         displayTime="false"
 *                         format="Do MMMM YYYY">
 * </gtx-date-time-picker>
 * ```
 */
export declare class DateTimePicker implements ControlValueAccessor {
    /**
     * The date/time value as a unix timestamp (in seconds)
     */
    timestamp: number;
    /**
     * A label for the control
     */
    label: string;
    /**
     * A [moment.js](http://momentjs.com/)-compatible format string which determines how the
     * date/time will be displayed in the input field.
     * See [the moment docs](http://momentjs.com/docs/#/displaying/format/) for valid strings.
     */
    format: string;
    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    displayTime: any;
    /**
     * Fires when the "okay" button is clicked to close the picker.
     */
    change: EventEmitter<number>;
    value: moment.Moment;
    onChange: any;
    onTouched: any;
    /**
     * cal is an instance of a Rome calendar, for the API see https://github.com/bevacqua/rome#rome-api
     */
    private cal;
    private showModal;
    private uid;
    private _displayTime;
    private displayValue;
    private time;
    constructor(ngControl: NgControl);
    /**
     * If a timestamp has been passed in, initialize the value to that time.
     */
    ngOnInit(): void;
    /**
     * Initialize the Rome widget instance.
     */
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Update the this.value in accordance with the input of one of the
     * time fields (h, m, s).
     */
    updateTime(segment: string, value: number): void;
    /**
     * If the input is focused and the Enter key is pressed, we want this to
     * open the picker modal.
     */
    inputKeyHandler(e: KeyboardEvent): void;
    /**
     * Handler for the incrementing the time values when up or down arrows are pressed.
     */
    timeKeyHandler(segment: string, e: KeyboardEvent): void;
    incrementTime(segment: string): void;
    decrementTime(segment: string): void;
    /**
     * Update the displayed value and close the modal.
     */
    confirm(modal: Modal): void;
    /**
     * Close the picker widget without updating the displayed value or emitting a change event.
     */
    cancel(modal: Modal): void;
    writeValue(value: number): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    /**
     * Increment or decrement the value and update the time object.
     */
    private addToTime(segment, increment);
    /**
     * Update the time object based on the value of this.value.
     */
    private updateTimeObject(date);
    /**
     * Update the Rome calendar widget with the current value.
     */
    private updateCalendar(value);
    /**
     * Returns a human-readable string to be displayed in the control input field.
     */
    private getTimeString(date, displayTime);
}
