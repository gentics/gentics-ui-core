import {
    Component,
    ElementRef,
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

    constructor(@Self() @Optional() ngControl: NgControl,
                private elementRef: ElementRef) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

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
    ngAfterViewInit() {
        let input: HTMLInputElement = this.elementRef.nativeElement.querySelector('input');
        let label: HTMLLabelElement = this.elementRef.nativeElement.querySelector('label');

        if (String(this.value).length > 0 || this.placeholder) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
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
