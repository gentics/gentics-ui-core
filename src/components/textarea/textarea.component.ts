import {
    ChangeDetectorRef,
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

    constructor(private renderer: Renderer,
                private changeDetector: ChangeDetectorRef) { }

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
        const value = (e.target as HTMLTextAreaElement).value;
        this.blur.emit(value);
        this.onTouched();
    }

    onFocus(e: Event): void {
        const value = (e.target as HTMLTextAreaElement).value;
        this.focus.emit(value);
    }

    onInput(e: Event): void {
        const value = this.currentValue = (e.target as HTMLTextAreaElement).value;
        this.setHeight(value);
        this.change.emit(value);
        this.onChange(value);
    }

    writeValue(valueToWrite: any): void {
        const value = this.normalizeValue(valueToWrite);
        if (value !== this.currentValue) {
            this.renderer.setElementProperty(this.nativeTextarea.nativeElement, 'value', this.currentValue = value);
            this.setHeight(value);
        }
    }

    registerOnChange(fn: (newValue: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.changeDetector.markForCheck();
    }

    private onChange(newValue: string): void { }
    private onTouched(): void { }

    private normalizeValue(value: any): string {
        return (value == null ? '' : String(value)).replace(/\r\n?/g, '\n');
    }

    private setHeight(text: string): void {
        let lines = 1;
        for (let index = text.length - 1; index >= 0; --index) {
            if (text[index] === '\n') {
                lines++;
            }
        }
        const newHeight = (1 + lines * 1.5) + 'em';
        this.renderer.setElementStyle(this.nativeTextarea.nativeElement, 'height', newHeight);
    }
}
