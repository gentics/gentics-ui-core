import { EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/common';
/**
 * RadioGroup groups multiple {@link RadioButton} elements together.
 * Use ngControl or ngFormControl to connect it to a form.
 */
export declare class RadioGroup implements ControlValueAccessor {
    private ngControl;
    private static instanceCounter;
    private onChange;
    private onTouched;
    private radioButtons;
    private groupID;
    uniqueName: string;
    constructor(ngControl: NgControl);
    add(radio: RadioButton): void;
    remove(radio: RadioButton): void;
    radioSelected(selected?: RadioButton): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
}
/**
 * RadioButton wraps the native `<input type="radio">` form element.
 * To connect multiple radio buttons with a form via ngControl,
 * wrap them in a {@link RadioGroup} (`<gtx-radio-group>`).
 *
 * ```html
 * <gtx-radio-button [(ngModel)]="val" value="A" label="A"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="B" label="B"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="C" label="C"></gtx-radio-button>
 * ```
 *
 * ##### Stateless Mode
 * By default, the RadioButton keeps track of its own internal checked state. This makes sense
 * for most use cases, such as when used in a form bound to NgControl.
 *
 * However, in some cases we want to explicitly set the state from outside. This is done by binding
 * to the <code>checked</code> attribute. When this attribute is bound, the checked state of the
 * RadioButton will *only* change when the value of the binding changes. Clicking on the RadioButton
 * will have no effect other than to emit an event which the parent can use to update the binding.
 *
 * Here is a basic example of a stateless RadioButton where the parent component manages the state:
 *
 * ```html
 * <gtx-radio-button [checked]="isChecked"></gtx-checkbox>
 * ```
 */
export declare class RadioButton implements ControlValueAccessor, OnInit, OnDestroy {
    private group;
    /**
     * The checked state of the control. When set, the RadioButton will be
     * in stateless mode.
     */
    checked: boolean;
    /**
     * The disabled state of the control
     */
    disabled: boolean;
    /**
     * ID of the control
     */
    id: string;
    /**
     * Label for the radio button
     */
    label: string;
    /**
     * Name of the input
     */
    name: string;
    /**
     * Sets the readonly state
     */
    readonly: boolean;
    /**
     * Sets the required state
     */
    required: boolean;
    /**
     * Value associated with this input
     */
    value: any;
    /**
     * Blur event
     */
    blur: EventEmitter<boolean>;
    /**
     * Focus event
     */
    focus: EventEmitter<boolean>;
    /**
     * Change event
     */
    change: EventEmitter<any>;
    private inputChecked;
    /**
     * See note above on stateless mode.
     */
    private statelessMode;
    private onChange;
    private onTouched;
    constructor(control: NgControl, group: RadioGroup, modelAttrib: string);
    onBlur(): void;
    onFocus(): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    writeValue(value: any): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private onInputChecked(e, input);
}
