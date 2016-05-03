import { ElementRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/common';
/**
 * The InputField wraps the native `<input>` form element but should only be used for
 * text, number or password types. Other types (date, range, file) should have dedicated components.
 *
 *
 * Note that the class is named `InputField` since `Input` is used by the Angular framework to denote
 * component inputs.
 *
 * ```html
 * <gtx-input label="Text Input Label"></gtx-input>
 * <gtx-input placeholder="Number Input Placeholder"
 *            type="number" min="0" max="100" step="5"></gtx-input>
 * ```
 */
export declare class InputField implements ControlValueAccessor {
    private elementRef;
    /**
     * Sets the disabled state
     */
    disabled: boolean;
    /**
     * Input field id
     */
    id: string;
    /**
     * A label for the input
     */
    label: string;
    /**
     * Max allowed value (applies when type = "number")
     */
    max: number;
    /**
     * Min allowed value (applies when type = "number")
     */
    min: number;
    /**
     * Max allowed length in characters
     */
    maxlength: number;
    /**
     * Input field name
     */
    name: string;
    /**
     * Regex pattern for complex validation
     */
    pattern: string;
    /**
     * Placeholder text to display when the field is empty
     */
    placeholder: string;
    /**
     * Sets the readonly state of the input
     */
    readonly: boolean;
    /**
     * Sets the required state of the input
     */
    required: boolean;
    /**
     * Increment step (applies when type = "number")
     */
    step: number;
    /**
     * Can be "text", "number" or "password".
     */
    type: string;
    /**
     * Sets the value of the input.
     */
    value: string | number;
    /**
     * Fires when the input loses focus.
     */
    blur: EventEmitter<string | number>;
    /**
     * Fires when the input gains focus.
     */
    focus: EventEmitter<string | number>;
    /**
     * Fires whenever a char is entered into the field.
     */
    change: EventEmitter<string | number>;
    onChange: any;
    onTouched: any;
    constructor(ngControl: NgControl, elementRef: ElementRef);
    /**
     * The Materialize input includes a dynamic label that changes position depending on the state of the input.
     * When the label has the "active" class, it moves above the input, otherwise it resides inside the input
     * itself.
     *
     * The Materialize "forms.js" script normally takes care of adding/removing the active class on page load,
     * but this does not work in a SPA setting where new views with inputs can be created without a page load
     * event to trigger the `Materialize.updateTextFields()` method. Therefore we need to handle it ourselves
     * when the input component is created.
     */
    ngAfterViewInit(): void;
    onBlur(e: Event): void;
    onFocus(): void;
    onInput(e: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    private normalizeValue(val);
}
