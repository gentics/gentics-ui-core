import { EventEmitter } from 'angular2/core';
import { ControlValueAccessor, NgControl } from 'angular2/common';
/**
 * The Range wraps the native `<input type="range">` form element.
 *
 * ```html
 * <gtx-range [(ngModel)]="latitude" step="5" min="-180" max="180"></gtx-range>
 * ```
 */
export declare class Range implements ControlValueAccessor {
    /**
     * Sets the disabled state of the input.
     */
    disabled: boolean;
    /**
     * Maximum allowed value.
     */
    max: number;
    /**
     * Minimum allowed value.
     */
    min: number;
    /**
     * Name of the input.
     */
    name: string;
    /**
     * Sets the readonly state.
     */
    readonly: boolean;
    /**
     * Sets the required state.
     */
    required: boolean;
    /**
     * Amount to increment by when sliding.
     */
    step: number;
    /**
     * Sets the value of the slider.
     */
    value: number;
    /**
     * Sets an id for the slider.
     */
    id: string;
    /**
     * Blur event
     */
    blur: EventEmitter<number>;
    /**
     * Focus event
     */
    focus: EventEmitter<number>;
    /**
     * Change event
     */
    change: EventEmitter<number>;
    onChange: any;
    onTouched: any;
    constructor(ngControl: NgControl);
    onBlur(): void;
    onFocus(): void;
    onInput(e: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
}
