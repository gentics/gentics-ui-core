import {Component, EventEmitter, Input, Output, Provider, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export type CheckState = boolean | 'indeterminate';

const GTX_CHECKBOX_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => Checkbox),
    multi: true
});

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
@Component({
    selector: 'gtx-checkbox',
    template: require('./checkbox.tpl.html'),
    providers: [GTX_CHECKBOX_VALUE_ACCESSOR]
})
export class Checkbox implements ControlValueAccessor {

    /**
     * Checked state of the checkbox. When set, the Checkbox will be
     * in stateless mode.
     */
    @Input() get checked(): boolean {
        return this.checkState === true;
    }
    set checked(value: boolean) {
        this.statelessMode = true;
        let val: boolean | 'true' | '' | 'indeterminate' = <any> value;
        let nowChecked = val === true || <any> val === 'true' || <any> val === '';
        if (nowChecked != this.checkState) {
            this.onChange(this.checkState = nowChecked);
        }
    }

    /**
     * Set to "indeterminate" for an indeterminate state (-)
     */
    @Input() get indeterminate(): boolean {
        return this.checkState === 'indeterminate';
    }
    set indeterminate(val: boolean) {
        if (val != (this.checkState === 'indeterminate')) {
            this.checkState = val ? 'indeterminate' : false;
            this.change.emit(this.checkState);
            this.onChange(this.checkState);
        }
    }

    /**
     * Set the checkbox to its disabled state.
     */
    @Input() disabled: boolean = false;
    /**
     * Checkbox ID
     */
    @Input() id: string = randomID();
    /**
     * Label for the checkbox
     */
    @Input() label: string = '';
    /**
     * Form name for the checkbox
     */
    @Input() name: string;
    /**
     * Sets the readonly property
     */
    @Input() readonly: boolean = false;
    /**
     * Sets the required property
     */
    @Input() required: boolean = false;
    /**
     * The value of the checkbox
     */
    @Input() value: any = '';

    /**
     * Blur event
     */
    @Output() blur = new EventEmitter<CheckState>();
    /**
     * Focus event
     */
    @Output() focus = new EventEmitter<CheckState>();
    /**
     * Change event
     */
    @Output() change = new EventEmitter<CheckState>();

    private checkState: CheckState = false;
    /**
     * See note above on stateless mode.
     */
    private statelessMode: boolean = false;

    onBlur(): void {
        this.blur.emit(this.checkState);
        this.onTouched();
    }

    onFocus(): void {
        this.focus.emit(this.checkState);
    }

    writeValue(value: any): void {
        if (value !== this.checkState) {
            this.checkState = value;
            this.change.emit(value);
        }
    }

    ngOnInit(): void {
        this.onChange(this.checkState);
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private onChange: Function = () => {};
    private onTouched: Function = () => {};

    private onInputChanged(e: Event, input: HTMLInputElement): boolean {
        if (e) {
            e.stopPropagation();
        }
        let newState: CheckState = input.indeterminate ? 'indeterminate' : input.checked;
        if (this.statelessMode) {
            if (input.checked !== this.checkState) {
                input.checked = !!this.checkState;
            }
            this.change.emit(newState);
            return false;
        }
        if (newState != this.checkState) {
            this.checkState = newState;
            this.change.emit(newState);
            this.onChange(newState);
            return true;
        }
    }
}

function randomID(): string {
    return 'checkbox-' + Math.random().toString(36).substr(2);
}
