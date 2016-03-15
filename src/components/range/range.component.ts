import {
    Renderer,
    ElementRef,
    Component,
    Input,
    Optional,
    Self,
    Output,
    EventEmitter
} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl} from 'angular2/common';

declare var $: JQueryStatic;

/**
 * The Range wraps the native <input type="range"> form element.
 */
@Component({
    selector: 'gtx-range',
    template: require('./range.tpl.html')
})
export class Range implements ControlValueAccessor {

    // native attributes
    @Input() disabled: boolean = false;
    @Input() max: number;
    @Input() min: number;
    @Input() name: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;
    @Input() step: number;
    @Input() value: number;

    @Input() id: string;

    // events
    @Output() blur: EventEmitter<number> = new EventEmitter();
    @Output() focus: EventEmitter<number> = new EventEmitter();
    @Output() change: EventEmitter<number> = new EventEmitter();

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    constructor(private elementRef: ElementRef,
                @Self() @Optional() ngControl: NgControl) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(Number(this.value));
    }

    onFocus(): void {
        this.focus.emit(Number(this.value));
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(Number(target.value));
        this.onChange(target.value);
    }

    writeValue(value: any): void {
        this.value = value;
    }
    registerOnChange(fn: Function): void {
        this.onChange = (val: any) => fn(Number(val));
    }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
