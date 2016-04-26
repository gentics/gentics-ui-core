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
 * A wrapper around items that appear in the list pane of the SplitViewComponent.
 *
 * Two component-specific classes can be used:
 *
 * * `.item-avatar`: The content of this element will be styled in a circular container.
 * * `.item-primary`: The primary content of the item, which will take up all the remaining space via `flex: 1`.
 *
 *
 * ```html
 * <gtx-contents-list-item *ngFor="#item of listItems">
 *     <!-- this will be styled as a circular icon -->
 *     <div class="item-avatar"><i class="material-icons">{{ item.icon }}</i></div>
 *     <!-- this will stretch to use all available space -->
 *     <div class="item-primary"><a [routerLink]="[item.route]">{{ item.title }}</a></div>
 *     <!-- these will use remaining space to the right -->
 *     <i class="material-icons">edit</i>
 *     <i class="material-icons">star</i>
 * </gtx-contents-list-item>
 * ```
 */
var ContentsListItem = (function () {
    function ContentsListItem() {
    }
    ContentsListItem = __decorate([
        core_1.Component({
            selector: 'gtx-contents-list-item',
            template: require('./contents-list-item.tpl.html')
        }), 
        __metadata('design:paramtypes', [])
    ], ContentsListItem);
    return ContentsListItem;
}());
exports.ContentsListItem = ContentsListItem;
