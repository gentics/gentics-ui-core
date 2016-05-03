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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
/**
 * The InputField wraps the native `<input>` form element but should only be used for
 * text, number or password types. Other types (date, range, file) should have dedicated components.
 *
 *
 * Note that the class is named `InputField` since `Input` is used by the Angular framework to denote
 * component inputs.
 *
 * ```html
 * <gtx-input label="Text Input Label"></gtx-input>
 * <gtx-input placeholder="Number Input Placeholder"
 *            type="number" min="0" max="100" step="5"></gtx-input>
 * ```
 */
var InputField = (function () {
    function InputField(ngControl, elementRef) {
        this.elementRef = elementRef;
        /**
         * Sets the disabled state
         */
        this.disabled = false;
        /**
         * A label for the input
         */
        this.label = '';
        /**
         * Sets the readonly state of the input
         */
        this.readonly = false;
        /**
         * Sets the required state of the input
         */
        this.required = false;
        /**
         * Can be "text", "number" or "password".
         */
        this.type = 'text';
        /**
         * Sets the value of the input.
         */
        this.value = '';
        /**
         * Fires when the input loses focus.
         */
        this.blur = new core_1.EventEmitter();
        /**
         * Fires when the input gains focus.
         */
        this.focus = new core_1.EventEmitter();
        /**
         * Fires whenever a char is entered into the field.
         */
        this.change = new core_1.EventEmitter();
        // ValueAccessor members
        this.onChange = function (_) { };
        this.onTouched = function () { };
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }
    /**
     * The Materialize input includes a dynamic label that changes position depending on the state of the input.
     * When the label has the "active" class, it moves above the input, otherwise it resides inside the input
     * itself.
     *
     * The Materialize "forms.js" script normally takes care of adding/removing the active class on page load,
     * but this does not work in a SPA setting where new views with inputs can be created without a page load
     * event to trigger the `Materialize.updateTextFields()` method. Therefore we need to handle it ourselves
     * when the input component is created.
     */
    InputField.prototype.ngAfterViewInit = function () {
        var input = this.elementRef.nativeElement.querySelector('input');
        var label = this.elementRef.nativeElement.querySelector('label');
        if (String(this.value).length > 0 || this.placeholder) {
            label.classList.add('active');
        }
        else {
            label.classList.remove('active');
        }
    };
    InputField.prototype.onBlur = function (e) {
        e.stopPropagation();
        var target = e.target;
        this.blur.emit(this.normalizeValue(target.value));
        this.change.emit(this.normalizeValue(target.value));
    };
    InputField.prototype.onFocus = function () {
        this.focus.emit(this.normalizeValue(this.value));
    };
    InputField.prototype.onInput = function (e) {
        var target = e.target;
        this.change.emit(this.normalizeValue(target.value));
        this.onChange(this.normalizeValue(target.value));
    };
    InputField.prototype.writeValue = function (value) {
        this.value = value;
    };
    InputField.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    InputField.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    InputField.prototype.normalizeValue = function (val) {
        if (this.type === 'number') {
            return Number(val);
        }
        else {
            return val;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputField.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputField.prototype, "max", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputField.prototype, "min", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputField.prototype, "maxlength", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "pattern", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputField.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputField.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], InputField.prototype, "step", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputField.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], InputField.prototype, "value", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputField.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputField.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InputField.prototype, "change", void 0);
    InputField = __decorate([
        core_1.Component({
            selector: 'gtx-input',
            template: require('./input.tpl.html')
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl, core_1.ElementRef])
    ], InputField);
    return InputField;
}());
exports.InputField = InputField;
