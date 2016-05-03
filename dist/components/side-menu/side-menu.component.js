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
var core_1 = require('@angular/core');
var side_menu_toggle_component_1 = require('./side-menu-toggle.component');
/**
 * The SideMenu component is an off-canvas menu that features a hamburger toggle button which can be
 * used to toggle the state. The component itself is stateless, and relies on the value passed in as
 * the `opened` prop to set its state. Toggling must also be handled by the host component.
 *
 * ```html
 * <gtx-side-menu [opened]="displayMenu" (toggle)="toggleMenu($event)">
 *    <div class="my-menu-content">
 *        <ul>
 *            <li>Menu item 1</li>
 *            <li>Menu item 2</li>
 *            <li>Menu item 3</li>
 *            <li>Menu item 4</li>
 *            <li>Menu item 5</li>
 *        </ul>
 *    </div>
 * </gtx-side-menu>
 * ```
 */
var SideMenu = (function () {
    function SideMenu() {
        /**
         * Sets the state of the menu: true = opened, false = closed.
         */
        this.opened = false;
        /**
         * Fired when the toggle button is clicked. The value is equal to
         * the value of the `opened`
         */
        this.toggle = new core_1.EventEmitter();
    }
    Object.defineProperty(SideMenu.prototype, "hostIsOpen", {
        get: function () {
            return this.opened;
        },
        enumerable: true,
        configurable: true
    });
    SideMenu.prototype.toggleState = function () {
        this.toggle.emit(!this.opened);
    };
    SideMenu.prototype.close = function () {
        if (this.opened === true) {
            this.toggleState();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SideMenu.prototype, "opened", void 0);
    __decorate([
        core_1.HostBinding('class.opened'), 
        __metadata('design:type', Boolean)
    ], SideMenu.prototype, "hostIsOpen", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SideMenu.prototype, "toggle", void 0);
    SideMenu = __decorate([
        core_1.Component({
            selector: 'gtx-side-menu',
            template: require('./side-menu.tpl.html'),
            directives: [side_menu_toggle_component_1.SideMenuToggleButton]
        }), 
        __metadata('design:paramtypes', [])
    ], SideMenu);
    return SideMenu;
}());
exports.SideMenu = SideMenu;
