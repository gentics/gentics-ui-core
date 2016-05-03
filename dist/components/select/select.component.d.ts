import { ElementRef, QueryList, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgSelectOption, NgControl } from '@angular/common';
import { Subscription } from 'rxjs';
/**
 * The Select wraps the Materialize `<select>` element, which dynamically generates a styled list rather than use
 * the native HTML `<select>`.
 *
 * The value of the component (as specified by the `value` attribute or via ngModel etc.) should be a string, or in
 * the case of a multiple select (multiple="true"), it should be an array of strings.
 *
 * Likewise the outputs passed to the event handlers will be a string or an array of strings, depending on whether
 * multiple === true.
 *
 * ```html
 * <gtx-select label="Choose an option" [(ngModel)]="selectVal">
 *     <option *ngFor="let item of options" [value]="item">{{ item }}</option>
 * </gtx-select>
 * ```
 */
export declare class Select implements ControlValueAccessor {
    private elementRef;
    /**
     * Sets the disabled state.
     */
    disabled: boolean;
    /**
     * When set to true, allows multiple options to be selected. In this case, the input value should be
     * an array of strings; events will emit an array of strings.
     */
    multiple: boolean;
    /**
     * Name of the input.
     */
    name: string;
    /**
     * Sets the required state.
     */
    required: boolean;
    /**
     * The value determines which of the options are selected.
     */
    value: string | string[];
    /**
     * A text label for the input.
     */
    label: string;
    /**
     * Sets the id for the input.
     */
    id: string;
    /**
     * Blur event. Output depends on the "multiple" attribute.
     */
    blur: EventEmitter<string | string[]>;
    /**
     * Focus event. Output depends on the "multiple" attribute.
     */
    focus: EventEmitter<string | string[]>;
    /**
     * Change event. Output depends on the "multiple" attribute.
     */
    change: EventEmitter<string | string[]>;
    selectOptions: QueryList<NgSelectOption>;
    onChange: any;
    onTouched: any;
    $nativeSelect: any;
    subscription: Subscription;
    /**
     * Event handler for when one of the Materialize-generated LI elements is clicked.
     */
    selectItemClick: (e: Event) => void;
    inputBlur: (e: Event) => void;
    constructor(elementRef: ElementRef, ngControl: NgControl, query: QueryList<NgSelectOption>);
    /**
     * If a `value` has been passed in, we mark the corresponding option as "selected".
     */
    ngAfterContentInit(): void;
    /**
     * We need to init the Materialize select, (see http://materializecss.com/forms.html)
     * and add our own event listeners to the LI elements that Materialize creates to
     * replace the native <select> element, and listeners for blur, focus and change
     * events on the fakeInput which Materialize creates in the place of the native <select>.
     */
    ngAfterViewInit(): void;
    /**
     * Clean up our manually-added event listeners.
     */
    ngOnDestroy(): void;
    /**
     * Updates the value of the select component, setting the correct properties on the native DOM elements
     * depending on whether or not we are in "multiple" mode.
     */
    updateValue(value: string | string[]): void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => any): void;
    registerOnTouched(fn: () => any): void;
    /**
     * If this is a multiple select, turn the string value of the input into an array
     * of strings.
     */
    private normalizeValue(value);
    private registerHandlers();
    private unregisterHandlers();
    private _updateValueWhenListOfOptionsChanges(query);
}
