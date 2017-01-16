import {Component, Input, Output, EventEmitter, forwardRef, Optional, OnInit, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {ModalService} from '../modal/modal.service';
import {DateTimePickerModal} from './date-time-picker-modal.component';
import {DateTimePickerStrings} from './date-time-picker-strings';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {Subscription} from 'rxjs';
import {MomentStatic, Moment} from './moment-types';

export {DateTimePickerStrings};


/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
const rome: any = require('rome');
const momentjs: MomentStatic = rome.moment;


const GTX_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePicker),
    multi: true
};

/**
 * A form control for selecting a date and (optionally) a time. Depends on [ModalService](#/modal-service).
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
    templateUrl: './date-time-picker.tpl.html',
    providers: [GTX_DATEPICKER_VALUE_ACCESSOR]
})
export class DateTimePicker implements ControlValueAccessor, OnInit, OnDestroy {
    /**
     * Sets the date picker to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

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

    _disabled: boolean = false;
    displayValue: string = ' ';
    /** @internal */
    private value: Moment;

    private _displayTime: boolean = true;
    private _displaySeconds: boolean = true;
    private subscription: Subscription;

    // ValueAccessor members
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(@Optional() private formatProvider: DateTimePickerFormatProvider,
                private modalService: ModalService) {

        if (!formatProvider) {
            this.formatProvider = new DateTimePickerFormatProvider();
        }
    }

    /**
     * If a timestamp has been passed in, initialize the value to that time.
     */
    ngOnInit(): void {
        if (this.timestamp) {
            this.value = this.value || momentjs.unix(Number(this.timestamp));
            this.updateDisplayValue();
        }

        this.subscription = this.formatProvider.changed$
            .subscribe(() => this.updateDisplayValue());
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
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
                padding: false
            },
            {
                timestamp: (this.value || momentjs()).unix(),
                formatProvider: this.formatProvider,
                displayTime: this._displayTime,
                displaySeconds: this._displaySeconds
            })
            .then<number>(modal => modal.open())
            .then((timestamp: number) => {
                this.value = momentjs.unix(timestamp);
                this.updateDisplayValue();
                this.onChange();
                this.change.emit(timestamp);
            });
    }

    getUnixTimestamp(): number {
        return this.value.unix();
    }

    writeValue(value: number): void {
        if (value) {
            this.value = momentjs.unix(Number(value));
            this.updateDisplayValue();
        }
    }

    registerOnChange(fn: Function): void {
        this.onChange = () => fn(this.value.unix());
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    /**
     * Format date to a human-readable string for displaying in the component's input field.
     */
    updateDisplayValue(): void {
        if (!this.value) {
            return;
        }

        if (this.format) {
            this.displayValue = this.value.format(this.format);
        } else {
            this.displayValue = this.formatProvider.format(this.value, this._displayTime, this._displaySeconds);
        }
    }
}
