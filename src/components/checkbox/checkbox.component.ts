import {
    Attribute,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    OnDestroy,
    Optional,
    Output,
    Provider,
    Renderer,
    Self,
    forwardRef
} from 'angular2/core';
import {
    NgControl,
    ControlValueAccessor
} from 'angular2/common';
import {
    CONST_EXPR,
    isPresent
} from 'angular2/src/facade/lang';


// HACK: workaround for enum type. With TypeScript >= 1.8.0, use:
//   type CheckState: boolean | 'indeterminate';
class CheckState {
    static CHECKED = <CheckState> (<any> true);
    static UNCHECKED = <CheckState> (<any> false);
    static INDETERMINATE = <CheckState> (<any> 'indeterminate');
}

/**
 * Checkbox wraps the native <input type=checkbox> form element.
 * It provides a ControlValueAccessor to connect its check state
 * with a form via ngControl / ngFormControl / ngModel.
 *
 * Checkbox allows to set three states:
 *     true (= "checked")
 *     false (= "unchecked")
 *     "indeterminate"
 */
@Component({
    selector: 'gtx-checkbox',
    template: require('./checkbox.tpl.html')
})
export class Checkbox implements ControlValueAccessor {

    @Input() get checked(): boolean {
        return this.checkState === true;
    }
    set checked(val: boolean) {
        if (val != this.checkState) {
            this.checkState = val;
            this.change.emit(val);
            this.onChange(val);
        }
    }
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
    @Input() disabled: boolean = false;
    @Input() id: string = 'checkbox-' + Math.random().toString(36).substr(2);
    @Input() label: string = '';
    @Input() name: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;
    @Input() value: any = '';
    @Input() get filledIn(): any {
        return this.materialFilledIn;
    }
    set filledIn(filledIn: any) {
        this.materialFilledIn = isPresent(filledIn) && filledIn !== false;
    }

    @Output() blur: EventEmitter<CheckState> = new EventEmitter();
    @Output() focus: EventEmitter<CheckState> = new EventEmitter();
    @Output() change: EventEmitter<CheckState> = new EventEmitter();

    private materialFilledIn: boolean = false;
    private checkState: CheckState = false;

    private onChange: Function = () => {};
    private onTouched: Function = () => {};

    constructor(@Optional() control: NgControl) {
        if (control && !control.valueAccessor) {
            control.valueAccessor = this;
        }
    }

    onBlur(): void {
        this.blur.emit(this.checked);
        this.onTouched();
    }

    onFocus(): void {
        this.focus.emit(this.checked);
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    writeValue(value: any): void {
        if (value !== this.checkState) {
            this.checkState = value;
            this.change.emit(value);
        }
    }

    ngOnInit(): void {
        this.onChange(this.checkState);
    }

    private onInputChanged(input: HTMLInputElement): void {
        let newState: CheckState = input.indeterminate ? 'indeterminate' : input.checked;
        if (newState != this.checkState) {
            this.checkState = newState;
            this.change.emit(newState);
            this.onChange(newState);
        }
    }
}
