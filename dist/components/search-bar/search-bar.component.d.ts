import { EventEmitter } from '@angular/core';
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
 */
export declare class SearchBar {
    /**
     * Value that pre-fills the search input with a string value.
     */
    query: string;
    /**
     * Fired when either the search button is clicked, or
     * the "enter" key is pressed while the input has focus.
     */
    search: EventEmitter<string>;
    /**
     * Fired whenever the value of the input changes.
     */
    change: EventEmitter<string>;
    constructor();
    doSearch(): void;
    /**
     * Handler for pressing "enter" key.
     */
    onKeyDown(event: KeyboardEvent): void;
    onChange(event: string): void;
}
