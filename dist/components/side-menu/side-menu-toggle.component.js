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
 * An animated CSS hamburger menu icon, used by the SideMenu component to trigger the
 * "toggle" event. Only used internally by the SideMenu component.
 */
var SideMenuToggleButton = (function () {
    function SideMenuToggleButton() {
        this.active = false;
    }
    __decorate([
        core_1.Input(),
        core_1.HostBinding('class.active'), 
        __metadata('design:type', Boolean)
    ], SideMenuToggleButton.prototype, "active", void 0);
    SideMenuToggleButton = __decorate([
        core_1.Component({
            selector: 'gtx-side-menu-toggle-button',
            template: "<div class=\"bar top\"></div>\n               <div class=\"bar middle\"></div>\n               <div class=\"bar bottom\"></div>"
        }), 
        __metadata('design:paramtypes', [])
    ], SideMenuToggleButton);
    return SideMenuToggleButton;
}());
exports.SideMenuToggleButton = SideMenuToggleButton;
