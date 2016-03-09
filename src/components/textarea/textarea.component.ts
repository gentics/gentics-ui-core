import {
    Component,
    Input,
    Output,
    Optional,
    EventEmitter
} from 'angular2/core';
import {isBlank} from 'angular2/src/facade/lang';
import {ControlValueAccessor, NgControl} from 'angular2/common';

/**
 * The Textarea wraps the native <textarea> form element.
 */
@Component({
    selector: 'gtx-textarea',
    template: require('./textarea.tpl.html')
})
export class Textarea implements ControlValueAccessor {

    // native attributes
    @Input() disabled: boolean = false;
    @Input() maxlength: number;
    @Input() name: string;
    @Input() placeholder: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;

    @Input() value: string = '';
    @Input() label: string = '';
    @Input() id: string;

    // events
    @Output() blur: EventEmitter<string> = new EventEmitter();
    @Output() focus: EventEmitter<string> = new EventEmitter();
    @Output() change: EventEmitter<string> = new EventEmitter();

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    constructor(@Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }


    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(this.value);
    }

    onFocus(): void {
        this.focus.emit(this.value);
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(target.value);
        this.onChange(target.value);
    }

    writeValue(value: any): void {
        this.value = isBlank(value) ? '' : value;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
