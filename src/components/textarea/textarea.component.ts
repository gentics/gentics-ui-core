import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
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

    textareaInvalid: boolean = false;

    @ViewChild('textarea') private nativeTextarea: ElementRef;
    private _maxlength: number;
    private currentValue: string;

    constructor(private renderer: Renderer,
                private changeDetector: ChangeDetectorRef,
                private elementRef: ElementRef) { }

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
        this.setHeight(value);
        this.change.emit(value);
        this.onChange(value);
        this.onTouched();

        setTimeout(() => {
            const element: HTMLTextAreaElement = this.elementRef.nativeElement;
            const textareaClass = element.getAttribute('class');

            if ((textareaClass.indexOf('ng-touched') !== -1) && (textareaClass.indexOf('ng-invalid') !== -1)) {
                this.textareaInvalid = true;
            } else {
                this.textareaInvalid = false;
            }
        });
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

        // Height is approximately 1em padding plus 1.5em per line
        const newHeight = (1 + lines * 1.5) + 'em';

        const nativeElement: HTMLTextAreaElement = this.nativeTextarea.nativeElement;
        this.renderer.setElementStyle(nativeElement, 'height', newHeight);

        // Perform the check delayed, as angular has to perform the dom-change and the rendering has
        // to happen before accessing it again. Otherwise the scollHeight is going to be completly
        // off, resulting in unexpected and unreasonable height calculations.
        setTimeout(() => {
            // When text overflows the textarea, it wraps to the next line. When that happens,
            // we calculate the amount of extra lines needed and set a suitable height.
            const { offsetHeight, scrollHeight } = nativeElement;
            if (scrollHeight > offsetHeight) {
                // Calculate preferred height as "lines x 1.5em", set height css in em.
                const emHeight = offsetHeight / (1 + lines * 1.5);
                const newLineCount = Math.round((scrollHeight / emHeight - 1) / 1.5);
                const newHeight = (1 + newLineCount * 1.5) + 'em';
                this.renderer.setElementStyle(nativeElement, 'height', newHeight);
            }
        });
    }
}
