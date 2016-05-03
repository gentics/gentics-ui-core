import { EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/common';
export declare type CheckState = boolean | 'indeterminate';
/**
 * Checkbox wraps the native `<input type="checkbox">` form element.
 *
 * ```html
 * <gtx-checkbox [(ngModel)]="isOkay" label="Is it okay?"></gtx-checkbox>
 * <gtx-checkbox [(ngModel)]="checkStates.B" value="B" label="B"></gtx-checkbox>
 * ```
 */
export declare class Checkbox implements ControlValueAccessor {
    /**
     * Checked state of the checkbox
     */
    checked: boolean;
    /**
     * Set to "indeterminate" for an indeterminate state (-)
     */
    indeterminate: boolean;
    /**
     * Set the checkbox to its disabled state.
     */
    disabled: boolean;
    /**
     * Checkbox ID
     */
    id: string;
    /**
     * Label for the checkbox
     */
    label: string;
    /**
     * Form name for the checkbox
     */
    name: string;
    /**
     * Sets the readonly property
     */
    readonly: boolean;
    /**
     * Sets the required property
     */
    required: boolean;
    /**
     * The value of the checkbox
     */
    value: any;
    /**
     * Blur event
     */
    blur: EventEmitter<boolean | "indeterminate">;
    /**
     * Focus event
     */
    focus: EventEmitter<boolean | "indeterminate">;
    /**
     * Change event
     */
    change: EventEmitter<boolean | "indeterminate">;
    private checkState;
    private onChange;
    private onTouched;
    constructor(control: NgControl);
    onBlur(): void;
    onFocus(): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    writeValue(value: any): void;
    ngOnInit(): void;
    private onInputChanged(input);
}
