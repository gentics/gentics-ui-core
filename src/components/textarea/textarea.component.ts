import {
    Component,
    Input,
    Output,
    Optional,
    Self,
    EventEmitter
} from 'angular2/core';
import {isBlank, isNumber} from 'angular2/src/facade/lang';
import {ControlValueAccessor, NgControl} from 'angular2/common';

/**
 * The Textarea wraps the native `<textarea>` form element. Textareas automatically grow to accommodate their content.
 *
 * ```html
 * <gtx-textarea label="Message" [(ngModel)]="message"></gtx-textarea>
 * ```
 */
@Component({
    selector: 'gtx-textarea',
    template: require('./textarea.tpl.html')
})
export class Textarea implements ControlValueAccessor {

    /**
     * Sets the disabled state.
     */
    @Input() disabled: boolean = false;

    /**
     * Sets the maximum number of characters permitted.
     */
    @Input() set maxlength(val: number) {
        let num = Number(val);
        if (isNumber(num) && 0 < val) {
            this._maxlength = val;
        } else {
            this._maxlength = undefined;
        }
    }
    get maxlength(): number {
        return this._maxlength;
    }

    /**
     * The name of the control.
     */
    @Input() name: string;

    /**
     * A placeholder text to display when the control is empty.
     */
    @Input() placeholder: string;

    /**
     * Sets the readonly state.
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * Sets the value of the control.
     */
    @Input() value: string = '';

    /**
     * Sets the label of the control.
     */
    @Input() label: string = '';

    /**
     * Sets an id for the control.
     */
    @Input() id: string;

    /**
     * Blur event.
     */
    @Output() blur: EventEmitter<string> = new EventEmitter();

    /**
     * Focus event.
     */
    @Output() focus: EventEmitter<string> = new EventEmitter();

    /**
     * Change event.
     */
    @Output() change: EventEmitter<string> = new EventEmitter();

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    private _maxlength: number;

    constructor(@Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }


    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(this.value);
    }

    onFocus(): void {
        this.focus.emit(this.value);
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(target.value);
        this.onChange(target.value);
    }

    writeValue(value: any): void {
        this.value = isBlank(value) ? '' : value;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
