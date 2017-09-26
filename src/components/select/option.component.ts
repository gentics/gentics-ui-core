import {Input, Directive, ElementRef, ContentChildren, QueryList} from '@angular/core';
import {coerceToBoolean} from '../../common/coerce-to-boolean';

@Directive({
    selector: 'gtx-option'
})
export class SelectOption {
    private _value: any;
    private _disabled: any;

    constructor(public elementRef: ElementRef) {}

    @Input()
    set value(value: any) {
        this._value = value;
    }
    get value(): any {
        return this._value;
    }

    @Input()
    set disabled(value: boolean) {
        this._disabled = coerceToBoolean(value);
    }
    get disabled(): boolean {
        return this._disabled;
    }

    /**
     * Returns the value of the option as displayed in the view, i.e. a string representation.
     */
    get viewValue(): string {
        const textContent = this.elementRef.nativeElement.textContent.trim();
        if (textContent) {
            return textContent;
        }
        if (!this.isPrimitive(this.value)) {
            return '[Object]';
        }
        return this.value.toString();
    }

    private isPrimitive(value: any): boolean {
        return value !== null && (typeof value !== 'function' && typeof value !== 'object');
    }
}

@Directive({
    selector: 'gtx-optgroup'
})
export class SelectOptionGroup {
    @Input() label: string;

    @Input()
    set disabled(value: boolean) {
        this._disabled = coerceToBoolean(value);
    }
    get disabled(): boolean {
        return this._disabled;
    }

    private _disabled: any;

    @ContentChildren(SelectOption) private _options: QueryList<SelectOption>;

    get options(): SelectOption[] {
        return this._options.toArray();
    }
}
