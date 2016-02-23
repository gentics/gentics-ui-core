import {
    Type,
    forwardRef,
    Provider,
    Directive,
    Renderer,
    ElementRef,
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {CONST_EXPR, isBlank} from 'angular2/src/facade/lang';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from 'angular2/common';

/**
 * The InputField wraps the native <input> form element but should only be used for
 * text, number or password types. Other types (date, range, file) should have dedicated components.
 */
@Component({
    selector: 'gtx-input',
    template: require('./input.tpl.html')
})
export class InputField {

    // native attributes
    @Input() disabled: boolean = false;
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
    @Input() value: string = '';

    @Input() label: string = '';
    @Input() id: string;

    // events
    @Output() blur: EventEmitter<string> = new EventEmitter();
    @Output() focus: EventEmitter<string> = new EventEmitter();
    @Output() change: EventEmitter<string> = new EventEmitter();

    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(this.value);
    }

    onFocus(): void {
        this.focus.emit(this.value);
    }

    onChange(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(target.value);
    }
}


const GTX_INPUT_VALUE_ACCESSOR: Provider = CONST_EXPR(new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => GtxInputValueAccessor), multi: true}));

@Directive({
    selector: 'gtx-input[ngControl], gtx-input[ngModel], gtx-input[ngFormControl]',
    host: {'(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()'},
    bindings: [GTX_INPUT_VALUE_ACCESSOR]
})
export class GtxInputValueAccessor implements ControlValueAccessor {
    onChange: Function = () => {};
    onTouched: Function = () => {};

    constructor(private renderer: Renderer, private elementRef: ElementRef) {
    }

    writeValue(value: any): void {
        let normalizedValue: string = isBlank(value) ? '' : value;
        let input: HTMLInputElement = this.elementRef.nativeElement.querySelector('input');
        this.renderer.setElementProperty(input, 'value', normalizedValue);
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
