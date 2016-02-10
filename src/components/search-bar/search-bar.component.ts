import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {InputField} from '../input/input.component';

@Component({
    selector: 'gtx-search-bar',
    template: require('./search-bar.tpl.html'),
    directives: [InputField]
})
export class SearchBar {

    @Input() query : string;
    @Output() search : EventEmitter<string> = new EventEmitter();

    constructor() {
    }

    doSearch(value : string) : void {
        this.search.emit(value);
    }
}
