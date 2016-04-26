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
/**
 * The top bar component is a container for top-level menu items, and acts as a header for the app.
 * Its immediate children will be displayed horizontally, vertically center-aligned, starting from the
 * left-hand-side.
 *
 * Items can be explicitly right-aligned by giving them the class `.gtx-top-bar-right`.
 *
 * ```html
 * <gtx-top-bar>
 *     <i class="material-icons">menu</i>
 *     <h5>Title</h5>
 *
 *     <!-- this icon will be right-aligned -->
 *     <i class="material-icons gtx-top-bar-right">person</i>
 * </gtx-top-bar>
 * ```
 */
var TopBar = (function () {
    function TopBar() {
    }
    TopBar = __decorate([
        core_1.Component({
            selector: 'gtx-top-bar',
            template: require('./top-bar.tpl.html')
        }), 
        __metadata('design:paramtypes', [])
    ], TopBar);
    return TopBar;
}());
exports.TopBar = TopBar;
