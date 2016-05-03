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
var lang_1 = require('angular2/src/facade/lang');
/**
 * A Button component.
 *
 * ```html
 * <gtx-button>Click me</gtx-button>
 * <gtx-button size="large">Buy Now!</gtx-button>
 * <gtx-button type="alert">Delete all stuff</gtx-button>
 * ```
 */
var Button = (function () {
    function Button() {
        /**
         * Buttons can be "small", "regular" or "large"
         */
        this.size = 'regular';
        /**
         * Type determines the style of the button. Can be "default", "secondary",
         * "success", "warning" or "alert".
         */
        this.type = 'default';
        /**
         * Controls whether the button is disabled.
         */
        this.disabled = false;
        this.isFlat = false;
    }
    Object.defineProperty(Button.prototype, "flat", {
        /**
         * Setting the "flat" attribute gives the button a transparent background
         * and only depth on hover.
         */
        get: function () {
            return this.isFlat === true;
        },
        set: function (val) {
            this.isFlat = lang_1.isPresent(val) && val !== false;
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype.getButtonClasses = function () {
        var classes = [this.size, this.type];
        if (this.isFlat) {
            classes.push('btn-flat');
        }
        return classes.join(' ');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Button.prototype, "size", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Button.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Button.prototype, "flat", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Button.prototype, "disabled", void 0);
    Button = __decorate([
        core_1.Component({
            selector: 'gtx-button',
            template: require('./button.tpl.html')
        }), 
        __metadata('design:paramtypes', [])
    ], Button);
    return Button;
}());
exports.Button = Button;
