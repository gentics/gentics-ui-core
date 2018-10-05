import {ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {coerceToBoolean} from '../../common/coerce-to-boolean';

const GTX_RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Range),
    multi: true
};

/**
 * The Range wraps the native `<input type="range">` form element.
 *
 * ```html
 * <gtx-range [(ngModel)]="latitude" step="5" min="-180" max="180"></gtx-range>
 * ```
 */
@Component({
    selector: 'gtx-range',
    templateUrl: './range.tpl.html',
    providers: [GTX_RANGE_VALUE_ACCESSOR]
})
export class Range implements ControlValueAccessor {
    /**
     * Sets the input field to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /**
     * Sets the disabled state of the input.
     */
    @Input() disabled: boolean = false;

    /**
     * Sets a label for the slider.
     */
    @Input() label: string = '';

    /**
     * Maximum allowed value.
     */
    @Input() max: number;

    /**
     * Minimum allowed value.
     */
    @Input() min: number;

    /**
     * Name of the input.
     */
    @Input() name: string;

    /**
     * Sets the readonly state of the input.
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * Amount to increment by when sliding.
     */
    @Input() step: number;

    /**
     * Sets the value of the slider.
     */
    @Input() value: number;

    /**
     * Sets an id for the slider.
     */
    @Input() id: string;

    /**
     * Set to false to not show the thumb label. Defaults to true.
     */
    @Input()
    get thumbLabel(): boolean {
        return this.showThumbLabel;
    }
    set thumbLabel(value: boolean) {
        this.showThumbLabel = coerceToBoolean(value);
    }

    /**
     * Blur event
     */
    @Output() blur = new EventEmitter<number>();

    /**
     * Focus event
     */
    @Output() focus = new EventEmitter<number>();

    /**
     * Change event
     */
    @Output() change = new EventEmitter<number>();


    active: boolean = false;
    thumbLeft: string = '';
    currentValue: number;
    private showThumbLabel: boolean = true;


    @ViewChild('input') private inputElement: ElementRef;

    private get canModify(): boolean {
        return !this.disabled;
    }

    // ValueAccessor members
    onChange = (value: any): void => { };
    onTouched = (): void => { };

    constructor(private elementRef: ElementRef,
                private changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.writeValue(this.value);
    }

    onBlur(e: FocusEvent): void {
        e.stopPropagation();
        const value = this.getValueFromEvent(e);
        this.blur.emit(value);
        this.change.emit(value);
    }

    /**
     * IE11 only fires the 'change' event rather than the 'input' event as the range input value is changed.
     */
    onChangeEvent(e: Event): void | boolean {
        e.stopPropagation();
        if (this.canModify) {
            const value = this.currentValue = this.getValueFromEvent(e);
            this.change.emit(value);
            this.onChange(value);
        }
    }

    onFocus(e: FocusEvent): void {
        e.stopPropagation();
        this.focus.emit(this.value);
    }

    /**
     * Browsers other than IE11 fire 'input' continuously as the range value is changed, and fires 'change' on mouseup.
     */
    onInput(e: Event): void {
        e.stopPropagation();
        if (this.canModify) {
            const value = this.currentValue = this.getValueFromEvent(e);
            this.change.emit(value);
            this.onChange(value);
        }
    }

    onMousedown(e: MouseEvent): void {
        if (this.canModify) {
            this.active = true;
            this.setThumbPosition(e);
        }
    }

    onMouseup(): void {
        this.active = false;

    }

    onMousemove(e: MouseEvent): void {
        if (this.canModify) {
            if (this.active) {
                this.setThumbPosition(e);
            }
        }
    }

    writeValue(value: any): void {
        if (value !== this.currentValue) {
            this.currentValue = value;
            this.inputElement.nativeElement.value = this.currentValue;
        }
    }

    registerOnChange(fn: (newValue: number) => void): void {
        this.onChange = (value: any) => fn(Number(value));
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
        this.changeDetector.markForCheck();
    }

    setReadOnlyState(readonly: boolean): void {
        this.readonly = readonly;
        this.changeDetector.markForCheck();
    }

    private getValueFromEvent(e: Event): number {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        return Number(target.value);
    }

    private setThumbPosition(e: MouseEvent): void {
        const endMargin = 8;
        const rangeWrapper = this.elementRef.nativeElement.querySelector('.range-field') as HTMLDivElement;
        const boundingRect = rangeWrapper.getBoundingClientRect();
        const wrapperLeft = boundingRect.left;
        const wrapperWidth = boundingRect.width;
        let left = e.pageX - wrapperLeft;
        if (left < endMargin) {
            left = endMargin;
        } else if (left > wrapperWidth - endMargin) {
            left = wrapperWidth - endMargin;
        }
        this.thumbLeft = left + 'px';
    }
}
