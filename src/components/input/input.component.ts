import {
    Component,
    Input,
    Output,
    Optional,
    Self,
    EventEmitter
} from 'angular2/core';
import {isBlank} from 'angular2/src/facade/lang';
import {ControlValueAccessor, NgControl} from 'angular2/common';

/**
 * The InputField wraps the native <input> form element but should only be used for
 * text, number or password types. Other types (date, range, file) should have dedicated components.
 */
@Component({
    selector: 'gtx-input',
    template: require('./input.tpl.html')
})
export class InputField implements ControlValueAccessor {

    // native attributes
    @Input() disabled: boolean = false;
    @Input() id: string;
    @Input() label: string = '';
    @Input() max: number;
    @Input() min: number;
    @Input() maxlength: number;
    @Input() name: string;
    @Input() pattern: string;
    @Input() placeholder: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;
    @Input() step: number;
    @Input() type: string = 'text';
    @Input() value: string|number = '';

    // events
    @Output() blur: EventEmitter<string|number> = new EventEmitter();
    @Output() focus: EventEmitter<string|number> = new EventEmitter();
    @Output() change: EventEmitter<string|number> = new EventEmitter();

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    constructor(@Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    onBlur(): void {
        this.blur.emit(this.normalizeValue(this.value));
        this.change.emit(this.normalizeValue(this.value));
    }

    onFocus(): void { 
        this.focus.emit(this.normalizeValue(this.value));
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(this.normalizeValue(target.value));
        this.onChange(this.normalizeValue(target.value));
    }

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private normalizeValue(val: any): string|number {
        if (this.type === 'number') {
            return Number(val);
        } else {
            return val;
        }
    }
}
