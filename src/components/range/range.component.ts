import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
     * Sets the readonly state.
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

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    constructor(private elementRef: ElementRef) {}

    onBlur(nativeEvent: FocusEvent): void {
        nativeEvent.stopPropagation();
        this.blur.emit(this.value);
        this.change.emit(Number(this.value));
    }

    onChangeEvent(nativeEvent: Event): void {
        nativeEvent.stopPropagation();
    }

    onFocus(nativeEvent: FocusEvent): void {
        nativeEvent.stopPropagation();
        this.focus.emit(Number(this.value));
    }

    onInput(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.value = Number(target.value);
        this.change.emit(this.value);
        this.onChange(this.value);
    }

    onMousedown(e: MouseEvent): void {
        this.active = true;
        this.setThumbPosition(e);
    }

    onMouseup(): void {
        this.active = false;
    }

    onMousemove(e: MouseEvent): void {
        if (this.active) {
            this.setThumbPosition(e);
        }
    }

    writeValue(value: any): void {
        this.value = value;
    }
    registerOnChange(fn: Function): void {
        this.onChange = (val: any) => fn(Number(val));
    }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

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
