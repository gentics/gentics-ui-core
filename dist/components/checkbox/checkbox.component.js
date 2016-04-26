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
 * Checkbox wraps the native `<input type="checkbox">` form element.
 *
 * ```html
 * <gtx-checkbox [(ngModel)]="isOkay" label="Is it okay?"></gtx-checkbox>
 * <gtx-checkbox [(ngModel)]="checkStates.B" value="B" label="B"></gtx-checkbox>
 * ```
 */
var Checkbox = (function () {
    function Checkbox(control) {
        /**
         * Set the checkbox to its disabled state.
         */
        this.disabled = false;
        /**
         * Checkbox ID
         */
        this.id = 'checkbox-' + Math.random().toString(36).substr(2);
        /**
         * Label for the checkbox
         */
        this.label = '';
        /**
         * Sets the readonly property
         */
        this.readonly = false;
        /**
         * Sets the required property
         */
        this.required = false;
        /**
         * The value of the checkbox
         */
        this.value = '';
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
        this.checkState = false;
        this.onChange = function () { };
        this.onTouched = function () { };
        if (control && !control.valueAccessor) {
            control.valueAccessor = this;
        }
    }
    Object.defineProperty(Checkbox.prototype, "checked", {
        /**
         * Checked state of the checkbox
         */
        get: function () {
            return this.checkState === true;
        },
        set: function (val) {
            if (val != this.checkState) {
                this.checkState = val;
                this.change.emit(val);
                this.onChange(val);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "indeterminate", {
        /**
         * Set to "indeterminate" for an indeterminate state (-)
         */
        get: function () {
            return this.checkState === 'indeterminate';
        },
        set: function (val) {
            if (val != (this.checkState === 'indeterminate')) {
                this.checkState = val ? 'indeterminate' : false;
                this.change.emit(this.checkState);
                this.onChange(this.checkState);
            }
        },
        enumerable: true,
        configurable: true
    });
    Checkbox.prototype.onBlur = function () {
        this.blur.emit(this.checkState);
        this.onTouched();
    };
    Checkbox.prototype.onFocus = function () {
        this.focus.emit(this.checkState);
    };
    Checkbox.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    Checkbox.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    Checkbox.prototype.writeValue = function (value) {
        if (value !== this.checkState) {
            this.checkState = value;
            this.change.emit(value);
        }
    };
    Checkbox.prototype.ngOnInit = function () {
        this.onChange(this.checkState);
    };
    Checkbox.prototype.onInputChanged = function (input) {
        var newState = input.indeterminate ? 'indeterminate' : input.checked;
        if (newState != this.checkState) {
            this.checkState = newState;
            this.change.emit(newState);
            this.onChange(newState);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Checkbox.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Checkbox.prototype, "indeterminate", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Checkbox.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Checkbox.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Checkbox.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Checkbox.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Checkbox.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Checkbox.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Checkbox.prototype, "value", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Checkbox.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Checkbox.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Checkbox.prototype, "change", void 0);
    Checkbox = __decorate([
        core_1.Component({
            selector: 'gtx-checkbox',
            template: require('./checkbox.tpl.html')
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl])
    ], Checkbox);
    return Checkbox;
}());
exports.Checkbox = Checkbox;
