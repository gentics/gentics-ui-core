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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
/**
 * The Range wraps the native `<input type="range">` form element.
 *
 * ```html
 * <gtx-range [(ngModel)]="latitude" step="5" min="-180" max="180"></gtx-range>
 * ```
 */
var Range = (function () {
    function Range(ngControl) {
        /**
         * Sets the disabled state of the input.
         */
        this.disabled = false;
        /**
         * Sets the readonly state.
         */
        this.readonly = false;
        /**
         * Sets the required state.
         */
        this.required = false;
        /**
         * Blur event
         */
        this.blur = new core_1.EventEmitter();
        /**
         * Focus event
         */
        this.focus = new core_1.EventEmitter();
        /**
         * Change event
         */
        this.change = new core_1.EventEmitter();
        // ValueAccessor members
        this.onChange = function (_) { };
        this.onTouched = function () { };
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }
    Range.prototype.onBlur = function () {
        this.blur.emit(this.value);
        this.change.emit(Number(this.value));
    };
    Range.prototype.onFocus = function () {
        this.focus.emit(Number(this.value));
    };
    Range.prototype.onInput = function (e) {
        var target = e.target;
        this.change.emit(Number(target.value));
        this.onChange(target.value);
    };
    Range.prototype.writeValue = function (value) {
        this.value = value;
    };
    Range.prototype.registerOnChange = function (fn) {
        this.onChange = function (val) { return fn(Number(val)); };
    };
    Range.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Range.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Range.prototype, "max", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Range.prototype, "min", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Range.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Range.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Range.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Range.prototype, "step", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Range.prototype, "value", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Range.prototype, "id", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Range.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Range.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Range.prototype, "change", void 0);
    Range = __decorate([
        core_1.Component({
            selector: 'gtx-range',
            template: require('./range.tpl.html')
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl])
    ], Range);
    return Range;
}());
exports.Range = Range;
