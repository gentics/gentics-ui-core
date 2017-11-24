import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Optional, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {ModalService} from '../modal/modal.service';
import {DateTimePickerModal} from './date-time-picker-modal.component';
import {DateTimePickerStrings} from './date-time-picker-strings';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {coerceToBoolean} from '../../common/coerce-to-boolean';
import * as momentjs from 'moment';

export {DateTimePickerStrings};

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
    /** Sets the date picker to be auto-focused. Handled by `AutofocusDirective`. */
    @Input() autofocus: boolean = false;

    /** If true the clear button is displayed, which allows the user to clear the selected date. */
    @Input() set clearable(val: any) {
        this._clearable = coerceToBoolean(val);
    }

    /** Value to set on the ngModel when the DatePicker is cleared. */
    @Input() emptyValue: any = null;

    /** The date/time value as a unix timestamp (in seconds). */
    @Input() timestamp: number;

    /** A label for the control. */
    @Input() label: string = '';

    /**
     * A [moment.js](http://momentjs.com/)-compatible format string which determines how the
     * date/time will be displayed in the input field.
     * See [the moment docs](http://momentjs.com/docs/#/displaying/format/) for valid strings.
     */
    @Input() format: string;

    /** The minimum date allowed, e.g. `new Date(2015, 2, 12)`. */
    @Input() min: Date;

    /** The maximum date allowed, e.g. `new Date(2031, 1, 30)`. */
    @Input() max: Date;

    /** If true, the year may be selected from a Select control. */
    @Input() set selectYear(val: any) {
        this._selectYear = coerceToBoolean(val);
    }

    /** Set to `true` to disable the input field and not show the date picker on click. */
    @Input() set disabled(val: any) {
        this._disabled = coerceToBoolean(val);
    }

    /** Set to `false` to omit the time picker part of the component. Defaults to `true`. */
    @Input() set displayTime(val: any) {
        this._displayTime = coerceToBoolean(val);
    }

    /** Set to `false` to omit the seconds of the time picker part. Defaults to `true`. */
    @Input() set displaySeconds(val: any) {
        this._displaySeconds = coerceToBoolean(val);
    }

    /** Fires when the "okay" button is clicked to close the picker. */
    @Output() change = new EventEmitter<number|null>();

    /** Fires when the "clear" button is clicked on a clearable DateTimePicker. */
    @Output() clear = new EventEmitter<any>();

    _clearable: boolean = false;
    _selectYear: boolean = false;
    _disabled: boolean = false;
    displayValue: string = ' ';
    /** @internal */
    private value: momentjs.Moment;

    private _displayTime: boolean = true;
    private _displaySeconds: boolean = true;
    private subscription: Subscription;

    // ValueAccessor members
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(@Optional() private formatProvider: DateTimePickerFormatProvider,
                private modalService: ModalService,
                private changeDetector: ChangeDetectorRef) {

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

    handleEnterKey(event: KeyboardEvent): void {
        if (event.keyCode === 13 && !this._disabled) {
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
                displaySeconds: this._displaySeconds,
                min: this.min,
                max: this.max,
                selectYear: this._selectYear
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
        this.value = value ? momentjs.unix(Number(value)) : undefined;
        this.updateDisplayValue();
    }

    registerOnChange(fn: Function): void {
        this.onChange = (value?: number | null) => {
            if (value) {
                fn(value);
            } else if (this.value) {
                fn(this.value.unix());
            } else {
                fn(this.emptyValue);
            }
        };
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.changeDetector.markForCheck();
    }

    /** Format date to a human-readable string for displaying in the component's input field. */
    updateDisplayValue(): void {
        if (!this.value) {
            this.displayValue = '';
        } else if (this.format) {
            this.displayValue = this.value.format(this.format);
        } else {
            this.displayValue = this.formatProvider.format(this.value, this._displayTime, this._displaySeconds);
        }
    }

    /** Clear input value of DateTimePicker and emit `emptyValue` as value. */
    clearDateTime(): void {
        this.displayValue = '';
        this.value = undefined;
        const emptyValue = this.emptyValue;
        this.clear.emit(emptyValue);
        this.onChange(emptyValue);
        this.change.emit(emptyValue);
    }
}
