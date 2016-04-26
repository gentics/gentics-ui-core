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
var lang_1 = require('angular2/src/facade/lang');
var common_1 = require('angular2/common');
/**
 * The Textarea wraps the native `<textarea>` form element. Textareas automatically grow to accommodate their content.
 *
 * ```html
 * <gtx-textarea label="Message" [(ngModel)]="message"></gtx-textarea>
 * ```
 */
var Textarea = (function () {
    function Textarea(ngControl) {
        /**
         * Sets the disabled state.
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
         * Sets the value of the control.
         */
        this.value = '';
        /**
         * Sets the label of the control.
         */
        this.label = '';
        /**
         * Blur event.
         */
        this.blur = new core_1.EventEmitter();
        /**
         * Focus event.
         */
        this.focus = new core_1.EventEmitter();
        /**
         * Change event.
         */
        this.change = new core_1.EventEmitter();
        // ValueAccessor members
        this.onChange = function (_) { };
        this.onTouched = function () { };
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }
    Object.defineProperty(Textarea.prototype, "maxlength", {
        get: function () {
            return this._maxlength;
        },
        /**
         * Sets the maximum number of characters permitted.
         */
        set: function (val) {
            var num = Number(val);
            if (lang_1.isNumber(num) && 0 < val) {
                this._maxlength = val;
            }
            else {
                this._maxlength = undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Textarea.prototype.onBlur = function () {
        this.blur.emit(this.value);
        this.change.emit(this.value);
    };
    Textarea.prototype.onFocus = function () {
        this.focus.emit(this.value);
    };
    Textarea.prototype.onInput = function (e) {
        var target = e.target;
        this.change.emit(target.value);
        this.onChange(target.value);
    };
    Textarea.prototype.writeValue = function (value) {
        this.value = lang_1.isBlank(value) ? '' : value;
    };
    Textarea.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    Textarea.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Textarea.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], Textarea.prototype, "maxlength", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Textarea.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Textarea.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Textarea.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Textarea.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Textarea.prototype, "value", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Textarea.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Textarea.prototype, "id", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Textarea.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Textarea.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Textarea.prototype, "change", void 0);
    Textarea = __decorate([
        core_1.Component({
            selector: 'gtx-textarea',
            template: require('./textarea.tpl.html')
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl])
    ], Textarea);
    return Textarea;
}());
exports.Textarea = Textarea;
