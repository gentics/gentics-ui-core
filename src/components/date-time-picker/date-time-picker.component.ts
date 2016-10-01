import {Component, Input, Output, EventEmitter, ElementRef, Optional, Provider, Self, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {InputField} from '../input/input.component';
import {ModalService} from '../modal/modal.service';
import {Button} from '../button/button.component';
import {DateTimePickerModal} from './date-time-picker-modal.component';

/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
const rome: any = require('rome');
const momentjs: moment.MomentStatic = rome.moment;


const GTX_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePicker),
    multi: true
};

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
@Component({
    selector: 'gtx-date-time-picker',
    template: require('./date-time-picker.tpl.html'),
    directives: [InputField, Button],
    providers: [GTX_DATEPICKER_VALUE_ACCESSOR]
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
     * Set to `true` to disable the input field and not show the date picker on click.
     */
    @Input() set disabled(val: any) {
        this._disabled = val === true || val === 'true';
    }

    /**
     * Set to `false` to omit the time picker part of the component. Defaults to `true`
     */
    @Input() set displayTime(val: any) {
        this._displayTime = val === true || val === 'true';
    }

    /**
     * Set to `false` to omit the seconds of the time picker part. Defaults to `true`
     */
    @Input() set displaySeconds(val: any) {
        this._displaySeconds = val === true || val === 'true';
    }

    /**
     * Fires when the "okay" button is clicked to close the picker.
     */
    @Output() change = new EventEmitter<number>();


    value: moment.Moment;

    private _displayTime: boolean = true;
    private _displaySeconds: boolean = true;
    private _disabled: boolean = false;
    private displayValue: string = ' ';

    // ValueAccessor members
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(private modalService: ModalService) { }

    /**
     * If a timestamp has been passed in, initialize the value to that time.
     */
    ngOnInit(): void {
        if (this.timestamp) {
            this.value = this.value || momentjs.unix(Number(this.timestamp));
            this.displayValue = this.formatTimeString(this.value, this._displayTime, this._displaySeconds);
        }
    }

    /**
     * If the input is focused and the Enter key is pressed, we want this to
     * open the picker modal.
     */
    inputKeyHandler(e: KeyboardEvent): void {
        // Enter key
        if (e.keyCode === 13 && !this._disabled) {
            this.showModal();
        }
    }

    showModal(): void {
        this.modalService.fromComponent(
            DateTimePickerModal,
            {
                padding: false,
            },
            {
                timestamp: (this.value || momentjs()).unix(),
                format: this.format,
                displayTime: this._displayTime,
                displaySeconds: this._displaySeconds
            })
            .then(modal => modal.open())
            .then((timestamp: number) => {
                this.value = momentjs.unix(timestamp);
                this.displayValue = this.formatTimeString(this.value, this._displayTime, this._displaySeconds);
                this.onChange();
            });
    }

    writeValue(value: number): void {
        if (value) {
            this.value = momentjs.unix(Number(value));
            this.displayValue = this.formatTimeString(this.value, this._displayTime, this._displaySeconds);
        }
    }

    registerOnChange(fn: Function): void {
        this.onChange = () => fn(this.value.unix());
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    /**
     * Returns a human-readable string to be displayed in the control input field.
     */
    formatTimeString(date: moment.Moment, displayTime: boolean, displaySeconds: boolean): string {
        if (this.format) {
            return date.format(this.format);
        }
        let formatString: string = 'DD/MM/YYYY';
        formatString += displayTime ? (displaySeconds ? ', HH:mm:ss' : ', HH:mm') : '';
        return date.format(formatString);
    }
}
