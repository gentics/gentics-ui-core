import {Component, Input, Output, EventEmitter} from '@angular/core';
import {InputField} from '../input/input.component';
import {Button} from '../button/button.component';

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
    directives: [InputField, Button]
})
export class SearchBar {

    /**
     * Value that pre-fills the search input with a string value.
     */
    @Input() query: string = '';

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

    constructor() {}

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

    onChange(event: string): void {
        if (typeof event === 'string') {
            this.change.emit(event);
        }
    }
}
