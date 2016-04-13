import {
    ElementRef,
    Component,
    ContentChildren,
    Optional,
    Self,
    Query,
    QueryList,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';
import {ObservableWrapper} from 'angular2/src/facade/async';
import {ControlValueAccessor, NgSelectOption, NgControl} from 'angular2/common';
import {Subscription} from 'rxjs';

declare var $: JQueryStatic;

/**
 * The Select wraps the Materialize `<select>` element, which dynamically generates a styled list rather than use
 * the native HTML `<select>`.
 *
 * The value of the component (as specified by the `value` attribute or via ngModel etc.) should be a string, or in
 * the case of a multiple select (multiple="true"), it should be an array of strings.
 *
 * Likewise the outputs passed to the event handlers will be a string or an array of strings, depending on whether
 * multiple === true.
 *
 * ```
 * <gtx-select label="Choose an option" [(ngModel)]="selectVal">
 *     <option *ngFor="#item of options" [value]="item">{{ item }}</option>
 * </gtx-select>
 * ```
 */
@Component({
    selector: 'gtx-select',
    template: require('./select.tpl.html')
})
export class Select implements ControlValueAccessor {

    /**
     * Sets the disabled state.
     */
    @Input() disabled: boolean = false;

    /**
     * When set to true, allows multiple options to be selected. In this case, the input value should be
     * an array of strings; events will emit an array of strings.
     */
    @Input() multiple: boolean = false;

    /**
     * Name of the input.
     */
    @Input() name: string;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * The value determines which of the options are selected.
     */
    @Input() value: string|string[];

    /**
     * A text label for the input.
     */
    @Input() label: string = '';

    /**
     * Sets the id for the input.
     */
    @Input() id: string;

    /**
     * Blur event. Output depends on the "multiple" attribute.
     */
    @Output() blur: EventEmitter<string|string[]> = new EventEmitter();
    /**
     * Focus event. Output depends on the "multiple" attribute.
     */
    @Output() focus: EventEmitter<string|string[]> = new EventEmitter();
    /**
     * Change event. Output depends on the "multiple" attribute.
     */
    @Output() change: EventEmitter<string|string[]> = new EventEmitter();

    @ContentChildren(NgSelectOption, { descendants: true }) selectOptions: QueryList<NgSelectOption>;

    // ValueAccessor members
    onChange: any = () => {};
    onTouched: any = () => {};

    $nativeSelect: any;
    subscription: Subscription;

    /**
     * Event handler for when one of the Materialize-generated LI elements is clicked.
     */
    selectItemClick: (e: Event) => void = (e: Event) => {
        const fakeInput: HTMLInputElement = this.elementRef.nativeElement.querySelector('input.select-dropdown');
        this.value = this.normalizeValue(fakeInput.value);
        this.change.emit(this.value);
        this.onChange();
    };

    inputBlur: (e: Event) => void = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        this.blur.emit(this.value);
    };

    constructor(private elementRef: ElementRef,
                @Self() @Optional() ngControl: NgControl,
                @Query(NgSelectOption, {descendants: true}) query: QueryList<NgSelectOption>) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
        this._updateValueWhenListOfOptionsChanges(query);
    }

    /**
     * If a `value` has been passed in, we mark the corresponding option as "selected".
     */
    ngAfterContentInit(): void {
        this.updateValue(this.value);
    }

    /**
     * We need to init the Materialize select, (see http://materializecss.com/forms.html)
     * and add our own event listeners to the LI elements that Materialize creates to
     * replace the native <select> element, and listeners for blur, focus and change
     * events on the fakeInput which Materialize creates in the place of the native <select>.
     */
    ngAfterViewInit(): void {
        const nativeSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('select');

        this.$nativeSelect = $(nativeSelect);

        // in a setTimeout to get around a weird issue where the first option was
        // always being selected. I think it has to do with the fact that the ValueAccessor
        // needs to run to update the nativeSelect value to the correct value before we
        // init the Materialize magic.
        setTimeout(() => {
            this.$nativeSelect.material_select();

            // the Materialize material_select() function annoyingly sets the value of the nativeSelect and the
            // fakeInput to the first option in the list, if the value is empty:
            // https://github.com/Dogfalo/materialize/blob/418eaa13efff765a2d68dcc0bc1b3fabf8484183/js/forms.js#L587-L591
            // This is not what we want, so we need to override this and set the values back to what they were before
            // material_select() was invoked.
            this.updateValue(this.value);

            this.registerHandlers();
        });

        this.subscription = this.selectOptions.changes.subscribe(() => {
            this.unregisterHandlers();
            nativeSelect.value = <string> this.value;
            this.$nativeSelect.material_select();
            this.registerHandlers();
        });
    }

    /**
     * Clean up our manually-added event listeners.
     */
    ngOnDestroy(): void {
        this.unregisterHandlers();
        this.$nativeSelect.material_select('destroy');
        this.subscription.unsubscribe();
    }

    /**
     * Updates the value of the select component, setting the correct properties on the native DOM elements
     * depending on whether or not we are in "multiple" mode.
     */
    updateValue(value: string|string[]): void {
        if (value === undefined) {
            return;
        }
        const nativeSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('select');
        const fakeInput: HTMLInputElement = this.elementRef.nativeElement.querySelector('input.select-dropdown');
        this.value = value;

        if (value instanceof Array) {
            const optionNodes: NodeListOf<HTMLOptionElement> = this.elementRef.nativeElement.querySelectorAll('option');
            const options: HTMLOptionElement[] = Array.prototype.slice.call(optionNodes);
            // The `multiple` property may not have been bound yet on the nativeSelect. Without this being
            // set to "true", we cannot select multiple options below.
            if (this.multiple && !nativeSelect.multiple) {
                nativeSelect.multiple = true;
            }
            options.forEach((option: HTMLOptionElement) => {
                option.selected = (-1 < this.value.indexOf(option.value));
            });
        } else {
            nativeSelect.value = <string> value;
        }

        if (fakeInput) {
            fakeInput.value = value !== null ? String(value) : '';
        }
    }

    // ValueAccessor members
    writeValue(value: any): void {
        this.updateValue(value);
    }
    registerOnChange(fn: (_: any) => any): void {
        this.onChange = () => {
            fn(this.value);
        };
    }
    registerOnTouched(fn: () => any): void { this.onTouched = fn; }


    /**
     * If this is a multiple select, turn the string value of the input into an array
     * of strings.
     */
    private normalizeValue(value: string): string|string[] {
        const stringToArray: Function = (str: string) => {
            return str.split(',')
                .map((s: string) => s.trim())
                .filter((s: string) => s !== '');
        };
        return this.multiple ? stringToArray(value) : value;
    }

    private registerHandlers(): void {
        $(this.elementRef.nativeElement).find('li').on('click', this.selectItemClick);
        $(this.elementRef.nativeElement).find('input.select-dropdown').on('blur', this.inputBlur);
    }

    private unregisterHandlers(): void {
        $(this.elementRef.nativeElement).find('li').off('click', this.selectItemClick);
        $(this.elementRef.nativeElement).find('input.select-dropdown').off('blur', this.inputBlur);
    }

    private _updateValueWhenListOfOptionsChanges(query: QueryList<NgSelectOption>): void {
        ObservableWrapper.subscribe(query.changes, (_: any) => this.writeValue(this.value));
    }
}
