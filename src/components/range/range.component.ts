import {
    ElementRef,
    Component,
    Input,
    Optional,
    Self,
    Output,
    EventEmitter
} from 'angular2/core';
import {ControlValueAccessor, NgControl} from 'angular2/common';

declare var $: JQueryStatic;

/**
 * The Range wraps the native `<input type="range">` form element.
 *
 * ```
 * <gtx-range [(ngModel)]="latitude" step="5" min="-180" max="180"></gtx-range>
 * ```
 */
@Component({
    selector: 'gtx-range',
    template: require('./range.tpl.html')
})
export class Range implements ControlValueAccessor {

    /**
     * Sets the disabled state of the input.
     */
    @Input() disabled: boolean = false;

    /**
     * Maximum allowed value.
     */
    @Input() max: number;

    /**
     * Minimum allowed value.
     */
    @Input() min: number;

    /**
     * Name of the input.
     */
    @Input() name: string;

    /**
     * Sets the readonly state.
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * Amount to increment by when sliding.
     */
    @Input() step: number;

    /**
     * Sets the value of the slider.
     */
    @Input() value: number;

    /**
     * Sets an id for the slider.
     */
    @Input() id: string;

    /**
     * Blur event
     */
    @Output() blur: EventEmitter<number> = new EventEmitter();

    /**
     * Focus event
     */
    @Output() focus: EventEmitter<number> = new EventEmitter();

    /**
     * Change event
     */
    @Output() change: EventEmitter<number> = new EventEmitter();

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    constructor(@Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(Number(this.value));
    }

    onFocus(): void {
        this.focus.emit(Number(this.value));
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(Number(target.value));
        this.onChange(target.value);
    }

    writeValue(value: any): void {
        this.value = value;
    }
    registerOnChange(fn: Function): void {
        this.onChange = (val: any) => fn(Number(val));
    }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
