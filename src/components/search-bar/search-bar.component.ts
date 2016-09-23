import {Component, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {isPresent} from '@angular/core/src/facade/lang';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InputField} from '../input/input.component';
import {Button} from '../button/button.component';

const GTX_SEARCH_BAR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchBar),
    multi: true
};

/**
 * The SearchBar component should be the primary search input for the app. It should be
 * located near the top of the screen, below the [TopBar](#/top-bar).
 *
 * ```html
 * <gtx-search-bar [query]="searchQuery"
 *                 (change)="onChange($event)"
 *                 (search)="search($event)">
 * </gtx-search-bar>
 * ```
 *
 * ##### Use With NgModel
 * The search query can be bound with `NgModel`, which can be useful for implementing a reset function:
 *
 * ```html
 * <gtx-search-bar [(ngModel)]="searchQuery"
 *                 (clear)="searchQuery = ''">
 * </gtx-search-bar>
 * ```
 *
 * ##### Content Projection
 * Content inside the `<gtx-search-bar>` tags will be projected inside the component, to the left of the
 * search bar. This can be used, for example, to display current filters being applied to the search.
 *
 * ```html
 * <gtx-search-bar>
 *      <div class="chip">Tag 1<i class="material-icons">close</i></div>
 * </gtx-search-bar>
 * ```
 */
@Component({
    selector: 'gtx-search-bar',
    template: require('./search-bar.tpl.html'),
    directives: [InputField, Button],
    providers: [GTX_SEARCH_BAR_VALUE_ACCESSOR]
})
export class SearchBar implements ControlValueAccessor {

    /**
     * Value that pre-fills the search input with a string value.
     */
    @Input() query: string = '';

    /**
     * Placeholder text which is shown when no text is entered.
     */
    @Input() placeholder = 'Search';

    /**
     * Setting this attribute will prevent the "clear" button from being displayed
     * when the query is non-empty.
     */
    @Input()
    get hideClearButton(): boolean {
        return this._hideClearButton === true;
    }
    set hideClearButton(val: boolean) {
        this._hideClearButton = isPresent(val) && val !== false;
    }

    /**
     * Fired when either the search button is clicked, or
     * the "enter" key is pressed while the input has focus.
     */
    @Output() search = new EventEmitter<string>();

    /**
     * Fired whenever the value of the input changes.
     */
    @Output() change = new EventEmitter<string>();

    /**
     * Fired when the clear button is clicked.
     */
    @Output() clear = new EventEmitter<boolean>();

    private _hideClearButton: boolean = false;

    // ValueAccessor members
    onChange: any = (_: any) => {};
    onTouched: any = () => {};

    doSearch(): void {
        this.search.emit(this.query);
    }

    /**
     * Handler for pressing "enter" key.
     */
    onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            this.doSearch();
        }
    }

    onInputChange(event: string): void {
        this.query = event;
        if (typeof event === 'string') {
            this.change.emit(event);
            this.onChange(event);
        }
    }

    onInputBlur(event: string): void {
        if (typeof event === 'string') {
            this.onTouched(event);
        }
    }

    writeValue(value: any): void {
        this.query = value;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}
