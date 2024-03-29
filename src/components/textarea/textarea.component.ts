import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    Output,
    Renderer2,
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
export class Textarea implements ControlValueAccessor, OnChanges {
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
     * Regex pattern for complex validation.
     * This requires that this control is either part of a form or that
     * its value is bound with ngModel.
     */
    @Input() pattern: string;

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
     * Tooltip for validation errors.
     */
    @Input() validationErrorTooltip: string;

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

    valueIsValid: boolean = true;

    @ViewChild('textarea', { static: true }) private nativeTextarea: ElementRef;
    private _maxlength: number;
    private currentValue: string;
    private previousHeight: number;

    constructor(
        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef,
        private elementRef: ElementRef
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const valueChange = changes['value'];
        if (valueChange) {
            this.writeValue(valueChange.currentValue);
        }
    }

    onBlur(e: Event): void {
        e.stopPropagation();
        const value = (e.target as HTMLTextAreaElement).value;
        this.blur.emit(this.normalizeValue(value));
        this.onTouched();
    }

    onChangeEvent(e: Event): void {
        e.stopPropagation();
    }

    onFocus(e: Event): void {
        const value = (e.target as HTMLTextAreaElement).value;
        this.focus.emit(value);
    }

    onInput(e: Event): void {
        const value = this.currentValue = (e.target as HTMLTextAreaElement).value;
        this.onChange(value);
        this.change.emit(value);
        this.onTouched();

        setTimeout(() => {
            const element: HTMLTextAreaElement = this.elementRef.nativeElement;
            this.valueIsValid = !element.classList.contains('ng-touched') || !element.classList.contains('ng-invalid');
        });
    }

    writeValue(valueToWrite: any): void {
        const value = this.normalizeValue(valueToWrite);
        if (value !== this.currentValue) {
            this.renderer.setProperty(this.nativeTextarea.nativeElement, 'value', this.currentValue = value);
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
}
