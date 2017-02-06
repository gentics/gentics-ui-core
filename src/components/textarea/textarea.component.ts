import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    OnChanges,
    Output,
    Renderer,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


const GTX_TEXTAREA_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Textarea),
    multi: true
};

/**
 * The Textarea wraps the native `<textarea>` form element. Textareas automatically grow to accommodate their content.
 *
 * ```html
 * <gtx-textarea label="Message" [(ngModel)]="message"></gtx-textarea>
 * ```
 */
@Component({
    selector: 'gtx-textarea',
    templateUrl: './textarea.tpl.html',
    providers: [GTX_TEXTAREA_VALUE_ACCESSOR]
})
export class Textarea implements ControlValueAccessor, OnChanges, OnInit {
    /**
     * Sets the textarea to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /**
     * Sets the disabled state.
     */
    @Input() disabled: boolean = false;

    /**
     * Sets the maximum number of characters permitted.
     */
    @Input() set maxlength(val: any) {
        if (val != null && !isNaN(val) && val > 0) {
            this._maxlength = Number(val);
        } else {
            this._maxlength = undefined;
        }
    }
    get maxlength(): any {
        return this._maxlength;
    }

    /**
     * The name of the control.
     */
    @Input() name: string;

    /**
     * A placeholder text to display when the control is empty.
     */
    @Input() placeholder: string;

    /**
     * Sets the readonly state.
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * Sets the value of the control.
     */
    @Input() value: string = '';

    /**
     * Sets the label of the control.
     */
    @Input() label: string = '';

    /**
     * Sets an id for the control.
     */
    @Input() id: string;

    /**
     * Blur event.
     */
    @Output() blur = new EventEmitter<string>();

    /**
     * Focus event.
     */
    @Output() focus = new EventEmitter<string>();

    /**
     * Change event.
     */
    @Output() change = new EventEmitter<string>();

    @ViewChild('textarea') private nativeTextarea: ElementRef;
    private _maxlength: number;
    private currentValue: string;

    constructor(private renderer: Renderer) { }

    ngOnInit(): void {
        this.writeValue(this.value);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const valueChange = changes['value'];
        if (valueChange) {
            this.writeValue(valueChange.currentValue);
        }
    }

    onBlur(e: Event): void {
        this.blur.emit(this.value);
        this.change.emit(this.value);
        this.onTouched();
    }

    onFocus(e: Event): void {
        this.focus.emit(this.value);
    }

    onInput(e: Event): void {
        const value = this.currentValue = (e.target as HTMLTextAreaElement).value;
        this.change.emit(value);
        this.onChange(value);
    }

    writeValue(valueToWrite: any): void {
        const value = valueToWrite == null ? '' : String(valueToWrite);
        if (value !== this.currentValue) {
            this.renderer.setElementProperty(this.nativeTextarea.nativeElement, 'value', this.currentValue = value);
        }
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private onChange: any = (_: any) => {};
    private onTouched: any = () => {};
}
