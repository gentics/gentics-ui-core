import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    QueryList,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs';

import {coerceToBoolean} from '../../common/coerce-to-boolean';
import {KeyCode} from '../../common/keycodes';
import {DropdownContent} from '../dropdown-list/dropdown-content.component';
import {DropdownList} from '../dropdown-list/dropdown-list.component';
import {SelectOption, SelectOptionGroup} from './option.component';

const GTX_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select),
    multi: true
};

export interface NormalizedOptionGroup {
    options: SelectOption[];
    label: string;
    disabled: boolean;
    isDefaultGroup: boolean;
}

export type SelectedSelectOption = [number, number];

/**
 * A Select form control which works with any kind of value - as opposed to the native HTML `<select>` which only works
 * with strings. The Select control depends on the [`<gtx-overlay-host>`](#/overlay-host) being present in the app.
 *
 * ```html
 * <gtx-select label="Choose an option" [(ngModel)]="selectVal">
 *     <gtx-option *ngFor="let item of options"
 *                 [value]="item"
 *                 [disabled]="item.disabled">{{ item.label }}</gtx-option>
 * </gtx-select>
 * ```
 *
 */
@Component({
    selector: 'gtx-select',
    templateUrl: './select.tpl.html',
    providers: [GTX_SELECT_VALUE_ACCESSOR]
})
export class Select implements ControlValueAccessor {
    /**
     * Sets the select box to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /** If true the clear button is displayed, which allows the user to clear the selection. */
    @Input()
    get clearable(): boolean {
        return this._clearable;
    }
    set clearable(val: boolean) {
        this._clearable = coerceToBoolean(val);
    }

    /**
     * Sets the disabled state.
     */
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceToBoolean(value);
    }

    /**
     * Sets the readonly state.
     */
    @Input()
    get readonly(): boolean {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = coerceToBoolean(value);
    }

    /**
     * When set to true, allows multiple options to be selected. In this case, the input value should be
     * an array of strings; events will emit an array of strings.
     */
    @Input() multiple: boolean = false;

    /**
     * Sets the required state.
     */
    @Input() required: boolean = false;

    /**
     * The value determines which of the options are selected.
     */
    @Input() value: any;

    /**
     * Placeholder which is shown if nothing is selected.
     */
    @Input() placeholder: string = '';

    /**
     * A text label for the input.
     */
    @Input() label: string;

    /**
     * Blur event.
     */
    @Output() blur = new EventEmitter<any>();
    /**
     * Focus event.
     */
    @Output() focus = new EventEmitter<any>();
    /**
     * Change event.
     */
    @Output() change = new EventEmitter<any>();

    // An array of abstracted containers for options, which allows us to treat options and groups in a
    // consistent way.
    optionGroups: NormalizedOptionGroup[] = [];

    subscriptions: Subscription[] = [];
    selectedOptions: SelectOption[] = [];
    viewValue: string = '';

    // Keeps track of the selected option. Two dimensional because options may be nested inside groups. The first
    // value is the index of the group (-1 is the default "no group" group), and the second number is the index
    // of the option within that group.
    selectedIndex: SelectedSelectOption = [0, -1];

    _clearable: boolean = false;
    _disabled: boolean = false;
    _readonly: boolean = false;
    private preventDeselect: boolean = false;
    @ViewChild(DropdownList, { static: true }) private dropdownList: DropdownList;
    @ViewChild(DropdownContent, { static: true }) private dropdownContent: DropdownContent;
    @ContentChildren(SelectOption, { descendants: false }) private _selectOptions: QueryList<SelectOption>;
    @ContentChildren(SelectOptionGroup, { descendants: false }) private _selectOptionGroups: QueryList<SelectOptionGroup>;

    // ValueAccessor members
    onChange = (): void => { };
    onTouched = (): void => { };

    constructor(private changeDetector: ChangeDetectorRef,
                private elementRef: ElementRef) { }

    ngAfterViewInit(): void {
        // Update the value if there are any changes to the options
        this.subscriptions.push(
            this._selectOptions.changes.subscribe(() => {
                this.writeValue(this.value);
                this.optionGroups = this.buildOptionGroups();
                this.selectedOptions = this.getInitiallySelectedOptions();
            })
        );

        this.elementRef.nativeElement.querySelector('gtx-dropdown-list')
                                .addEventListener('keydown', this.handleKeydown.bind(this));
    }

    ngAfterContentInit(): void {
        this.optionGroups = this.buildOptionGroups();
        this.selectedOptions = this.getInitiallySelectedOptions();
        this.updateViewValue();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    /**
     * Event handler for when one of the Materialize-generated LI elements is clicked.
     */
    selectItem(groupIndex: number, optionIndex: number): void {
        const option = this.optionGroups[groupIndex] && this.optionGroups[groupIndex].options[optionIndex];
        if (!this.optionGroups[groupIndex].disabled && option && !option.disabled) {
            this.toggleSelectedOption(option);
            const selectedValues = this.selectedOptions.map(o => o.value);
            this.value = this.multiple ? selectedValues : selectedValues[0];
            this.onChange();
            this.change.emit(this.value);
            this.updateViewValue();
            this.scrollToSelectedOption();
        }
    }

    inputBlur(e: Event): void {
        e.stopPropagation();
        this.onTouched();
        this.blur.emit(this.value);
    }

    /**
     * Select the initial value when the dropdown is opened.
     */
    dropdownOpened(): void {
        if (0 < this.selectedOptions.length) {
            this.preventDeselect = true;
            const selected = this.selectedOptions[0];
            this.selectedIndex = this.getIndexFromSelectOption(selected);
            setTimeout(() => {
                this.scrollToSelectedOption();
                this.preventDeselect = false;
            }, 100);
        }
    }

    /**
     * Handle keydown events to enable keyboard navigation and selection of options.
     */
    handleKeydown(event: KeyboardEvent): void {
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        const keyCode = event.keyCode;

        switch (keyCode) {
            case KeyCode.UpArrow:
                this.updateSelectedIndex(this.getPreviousIndex(this.selectedIndex));
                break;
            case KeyCode.DownArrow:
                this.updateSelectedIndex(this.getNextIndex(this.selectedIndex));
                break;
            case KeyCode.PageUp:
            case KeyCode.Home:
                this.updateSelectedIndex(this.getFirstIndex());
                break;
            case KeyCode.PageDown:
            case KeyCode.End:
                this.updateSelectedIndex(this.getLastIndex());
                break;
            case KeyCode.Enter:
            case KeyCode.Space:
                if (!this.dropdownList.isOpen) {
                    this.dropdownList.openDropdown();
                } else {
                    this.selectItem(this.selectedIndex[0], this.selectedIndex[1]);
                    if (!this.multiple) {
                        this.dropdownList.closeDropdown();
                    }
                }
                break;
            default:
                // Other keys are treated as if the user is trying to jump to an option by character
                const indexOfMatch = this.searchByKey(event.key);
                if (indexOfMatch) {
                    this.updateSelectedIndex(indexOfMatch);
                }

        }
    }

    isSelected(option: SelectOption): boolean {
        return -1 < this.selectedOptions.indexOf(option);
    }

    deselect(): void {
        if (!this.preventDeselect) {
            this.selectedIndex = [0, -1];
        }
    }

    // ValueAccessor members
    writeValue(value: string|string[]): void {
        this.value = value;

        if (this._selectOptions) {
            // select any options matching the initial value
            this.selectedOptions = [];
            const optionsArray = this._selectOptions.toArray();

            if (this.multiple && this.value instanceof Array) {
                optionsArray.forEach(o => {
                    if (-1 < this.value.indexOf(o.value)) {
                        this.selectedOptions.push(o);
                    }
                });
            } else {
                this.selectedOptions = optionsArray.filter(o => this.value === o.value);
            }
            this.updateViewValue();
        }
    }

    registerOnChange(fn: (newValue: any) => any): void {
        this.onChange = () => {
            fn(this.value);
        };
    }

    registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
        this.changeDetector.markForCheck();
    }

    setReadOnlyState(isReadOnly: boolean): void {
        this._readonly = isReadOnly;
        this.changeDetector.markForCheck();
    }

    /** Clears the selected value and emits `null` with the `change` event. */
    clearSelection(): void {
        this.selectedOptions = [];
        this.value = null;

        this.change.emit(this.value);
        this.onChange();
        this.updateViewValue();
    }

    /**
     * Given a SelectOption, returns the position in the 2D selectedIndex array.
     */
    private getIndexFromSelectOption(selected: SelectOption): SelectedSelectOption {
        if (selected) {
            let selectedGroup = 0;
            let selectedOption = 0;
            for (let i = 0; i < this.optionGroups.length; i++) {
                const group = this.optionGroups[i];
                selectedGroup = i;
                for (let j = 0; j < group.options.length; j++) {
                    const option = group.options[j];
                    selectedOption = j;
                    if (option === selected) {
                        return [selectedGroup, selectedOption];
                    }
                }
            }
        } else {
            return [0, 0];
        }
    }

    /**
     * Once the contents have been compiled, we can build up the optionGroups array, grouping options into
     * a "default" group, i.e. the group of options which are not children of a <gtx-optgroup>, and then any
     * other groups as specified by optgroups.
     */
    private buildOptionGroups(): NormalizedOptionGroup[] {
        const groups = this._selectOptionGroups.map(g => {
            return {
                get options(): SelectOption[] { return g.options; },
                get label(): string { return g.label; },
                get disabled(): boolean { return g.disabled; },
                isDefaultGroup: false
            };
        });

        if (this._selectOptions.length) {
            groups.unshift({
                options: this._selectOptions.toArray(),
                label: '',
                isDefaultGroup: true,
                disabled: false
            });
        }
        return groups;
    }

    /**
     * Select any options which match the value passed in via the `value` attribute.
     */
    private getInitiallySelectedOptions(): SelectOption[] {
        let selectedOptions: SelectOption[] = [];
        const flatOptionsList = this.optionGroups.reduce(
            (options, group) => options.concat(group.options), []);

        if (this.value !== undefined) {
            if (this.multiple) {
                if (this.value instanceof Array) {
                    selectedOptions = flatOptionsList.filter(o => -1 < this.value.indexOf(o.value));
                }
            } else {
                selectedOptions = flatOptionsList.filter(o => this.value === o.value) || [];
                return flatOptionsList.filter(o => this.value === o.value) || [];
            }
        }
        return selectedOptions;
    }

    /**
     * Toggle the selection of the given SelectOption, taking into account whether this is a multiple
     * select.
     */
    private toggleSelectedOption(option: SelectOption): void {
        if (!this.multiple) {
            this.selectedOptions = [];
        }
        let index = this.selectedOptions.indexOf(option);
        if (-1 < index) {
            // de-select the existing option
            this.selectedOptions.splice(index, 1);
        } else {
            this.selectedOptions.push(option);
        }
    }

    private updateViewValue(): void {
        this.viewValue = this.selectedOptions.map(o => o.viewValue).join(', ');
        this.changeDetector.markForCheck();
    }

    /**
     * When a list of options is too long, there will be a scroll bar. This method ensures that the currently-selected
     * options is scrolled into view in the options list.
     */
    private scrollToSelectedOption(): void {
        setTimeout(() => {
            const container = this.dropdownContent.elementRef.nativeElement;
            const selectedItem = container.querySelector('li.selected');
            if (selectedItem) {
                const belowContainer = container.offsetHeight + container.scrollTop < selectedItem.offsetTop + selectedItem.offsetHeight;
                const aboveContainer = selectedItem.offsetTop < container.scrollTop;

                if (belowContainer) {
                    container.scrollTop = selectedItem.offsetTop + selectedItem.offsetHeight - container.offsetHeight;
                }
                if (aboveContainer) {
                    container.scrollTop = selectedItem.offsetTop;
                }
            }
        });
    }

    /**
     * Searches through the available options and locates the next option with a viewValue whose first character
     * matches the character passed in. Useful for jumping to options quickly by typing the first letter of the
     * option view value.
     */
    private searchByKey(key: string): SelectedSelectOption {
        const keyUpperCase = key.toLocaleUpperCase();
        const totalOptionCount = this.optionGroups.reduce((total, group) => total + group.options.length, 0);
        let currentIndex = this.selectedIndex.slice() as SelectedSelectOption;

        for (let counter = 0; counter < totalOptionCount; counter++) {
            currentIndex = this.getNextIndex(currentIndex);
            const option = this.optionGroups[currentIndex[0]].options[currentIndex[1]];
            const firstLetterUppercase = option.viewValue.charAt(0).toLocaleUpperCase();

            if (firstLetterUppercase === keyUpperCase) {
                return currentIndex;
            }
        }
    }

    private getFirstIndex(): SelectedSelectOption {
        return [0, 0];
    }

    private getLastIndex(): SelectedSelectOption {
        const lastGroupIndex = this.optionGroups.length - 1;
        return [lastGroupIndex, this.optionGroups[lastGroupIndex].options.length - 1];
    }

    private getNextIndex(currentIndex: SelectedSelectOption): SelectedSelectOption {
        let nextIndex = currentIndex.slice() as SelectedSelectOption;
        const isLastGroup = currentIndex[0] === this.optionGroups.length - 1;
        const isLastOptionInGroup = currentIndex[1] === this.optionGroups[currentIndex[0]].options.length - 1;
        if (isLastOptionInGroup) {
            if (isLastGroup) {
                nextIndex = this.getFirstIndex();
            } else {
                nextIndex[0] ++;
                nextIndex[1] = 0;
            }
        } else {
            nextIndex[1]++;
        }
        return nextIndex;
    }

    private getPreviousIndex(currentIndex: SelectedSelectOption): SelectedSelectOption {
        let nextIndex = currentIndex.slice() as SelectedSelectOption;
        if (currentIndex[0] <= 0) {
            if (0 < currentIndex[1]) {
                nextIndex[1] --;
            } else {
                nextIndex = this.getLastIndex();
            }
        } else {
            if (0 < currentIndex[1]) {
                nextIndex[1] --;
            } else {
                nextIndex[0] --;
                nextIndex[1] = this.optionGroups[currentIndex[0]].options.length - 1;
            }
        }
        return nextIndex;
    }

    /**
     * Sets the `selectedOptions` array to contain the single option at the selectedIndex.
     */
    private updateSelectedIndex(index: SelectedSelectOption): void {
        this.selectedIndex = index;
        const options = this.optionGroups[index[0]].options;

        if (options && 0 <= index[1] && index[1] < options.length) {
            if (!this.multiple) {
                this.selectItem(index[0], index[1]);
            } else {
                this.scrollToSelectedOption();
            }
        }
    }
}
