import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {InputField} from '../input/input.component';

/**
 * The SearchBar component has the following API:
 *
 * - `query`: string - Value that pre-fills the search input with a string value.
 * - `change`: Event - emitted whenever the value of the input changes
 * - `search`: Event - emitted when either the search button is clicked, or
 *                     the "enter" key is pressed while the input is focused.
 *
 * @example
 * <gtx-search-bar [query]="searchQuery"
 *                 (change)="onChange($event)"
 *                 (search)="search($event)">
 * </gtx-search-bar>
 */
@Component({
    selector: 'gtx-search-bar',
    template: require('./search-bar.tpl.html'),
    directives: [InputField]
})
export class SearchBar {

    @Input() query: string;
    @Output() search: EventEmitter<string> = new EventEmitter();
    @Output() change: EventEmitter<string> = new EventEmitter();

    constructor() {}

    doSearch(value: string): void {
        this.search.emit(value);
    }

    onKeyDown(event: KeyboardEvent, value: string): void {
        if (event.keyCode === 13) {
            this.search.emit(value);
        } else {
            this.change.emit(value);
        }
    }
}
