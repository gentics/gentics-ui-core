"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var input_component_1 = require('../input/input.component');
var button_component_1 = require('../button/button.component');
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
var SearchBar = (function () {
    function SearchBar() {
        /**
         * Fired when either the search button is clicked, or
         * the "enter" key is pressed while the input has focus.
         */
        this.search = new core_1.EventEmitter();
        /**
         * Fired whenever the value of the input changes.
         */
        this.change = new core_1.EventEmitter();
    }
    SearchBar.prototype.doSearch = function () {
        this.search.emit(this.query);
    };
    /**
     * Handler for pressing "enter" key.
     */
    SearchBar.prototype.onKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.doSearch();
        }
    };
    SearchBar.prototype.onChange = function (event) {
        if (typeof event === 'string') {
            this.change.emit(event);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SearchBar.prototype, "query", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SearchBar.prototype, "search", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SearchBar.prototype, "change", void 0);
    SearchBar = __decorate([
        core_1.Component({
            selector: 'gtx-search-bar',
            template: require('./search-bar.tpl.html'),
            directives: [input_component_1.InputField, button_component_1.Button]
        }), 
        __metadata('design:paramtypes', [])
    ], SearchBar);
    return SearchBar;
}());
exports.SearchBar = SearchBar;
