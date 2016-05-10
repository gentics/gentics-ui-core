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
 *
 * ##### Stateless Mode
 * By default, the Checkbox keeps track of its own internal checked state. This makes sense
 * for most use cases, such as when used in a form bound to NgControl.
 *
 * However, in some cases we want to explicitly set the state from outside. This is done by binding
 * to the <code>checked</code> attribute. When this attribute is bound, the checked state of the
 * Checkbox will *only* change when the value of the binding changes. Clicking on the Checkbox
 * will have no effect other than to emit an event which the parent can use to update the binding.
 *
 * Here is a basic example of a stateless checkbox where the parent component manages the state:
 *
 * ```html
 * <gtx-checkbox [checked]="isChecked"
 *               (change)="isChecked = $event"></gtx-checkbox>
 * ```
 */
export declare class Checkbox implements ControlValueAccessor {
    /**
     * Checked state of the checkbox. When set, the Checkbox will be
     * in stateless mode.
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
    /**
     * See note above on stateless mode.
     */
    private statelessMode;
    private onChange;
    private onTouched;
    constructor(control: NgControl);
    onBlur(): void;
    onFocus(): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    writeValue(value: any): void;
    ngOnInit(): void;
    private onInputChanged(e, input);
}
