import { EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/common';
/**
 * The Textarea wraps the native `<textarea>` form element. Textareas automatically grow to accommodate their content.
 *
 * ```html
 * <gtx-textarea label="Message" [(ngModel)]="message"></gtx-textarea>
 * ```
 */
export declare class Textarea implements ControlValueAccessor {
    /**
     * Sets the disabled state.
     */
    disabled: boolean;
    /**
     * Sets the maximum number of characters permitted.
     */
    maxlength: number;
    /**
     * The name of the control.
     */
    name: string;
    /**
     * A placeholder text to display when the control is empty.
     */
    placeholder: string;
    /**
     * Sets the readonly state.
     */
    readonly: boolean;
    /**
     * Sets the required state.
     */
    required: boolean;
    /**
     * Sets the value of the control.
     */
    value: string;
    /**
     * Sets the label of the control.
     */
    label: string;
    /**
     * Sets an id for the control.
     */
    id: string;
    /**
     * Blur event.
     */
    blur: EventEmitter<string>;
    /**
     * Focus event.
     */
    focus: EventEmitter<string>;
    /**
     * Change event.
     */
    change: EventEmitter<string>;
    onChange: any;
    onTouched: any;
    private _maxlength;
    constructor(ngControl: NgControl);
    onBlur(): void;
    onFocus(): void;
    onInput(e: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
}
