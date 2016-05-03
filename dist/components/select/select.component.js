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
var async_1 = require('@angular/core/src/facade/async');
var common_1 = require('@angular/common');
/**
 * The Select wraps the Materialize `<select>` element, which dynamically generates a styled list rather than use
 * the native HTML `<select>`.
 *
 * The value of the component (as specified by the `value` attribute or via ngModel etc.) should be a string, or in
 * the case of a multiple select (multiple="true"), it should be an array of strings.
 *
 * Likewise the outputs passed to the event handlers will be a string or an array of strings, depending on whether
 * multiple === true.
 *
 * ```html
 * <gtx-select label="Choose an option" [(ngModel)]="selectVal">
 *     <option *ngFor="let item of options" [value]="item">{{ item }}</option>
 * </gtx-select>
 * ```
 */
var Select = (function () {
    function Select(elementRef, ngControl, query) {
        var _this = this;
        this.elementRef = elementRef;
        /**
         * Sets the disabled state.
         */
        this.disabled = false;
        /**
         * When set to true, allows multiple options to be selected. In this case, the input value should be
         * an array of strings; events will emit an array of strings.
         */
        this.multiple = false;
        /**
         * Sets the required state.
         */
        this.required = false;
        /**
         * A text label for the input.
         */
        this.label = '';
        /**
         * Blur event. Output depends on the "multiple" attribute.
         */
        this.blur = new core_1.EventEmitter();
        /**
         * Focus event. Output depends on the "multiple" attribute.
         */
        this.focus = new core_1.EventEmitter();
        /**
         * Change event. Output depends on the "multiple" attribute.
         */
        this.change = new core_1.EventEmitter();
        // ValueAccessor members
        this.onChange = function () { };
        this.onTouched = function () { };
        /**
         * Event handler for when one of the Materialize-generated LI elements is clicked.
         */
        this.selectItemClick = function (e) {
            var fakeInput = _this.elementRef.nativeElement.querySelector('input.select-dropdown');
            _this.value = _this.normalizeValue(fakeInput.value);
            _this.change.emit(_this.value);
            _this.onChange();
        };
        this.inputBlur = function (e) {
            e.stopPropagation();
            e.preventDefault();
            _this.blur.emit(_this.value);
        };
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
        this._updateValueWhenListOfOptionsChanges(query);
    }
    /**
     * If a `value` has been passed in, we mark the corresponding option as "selected".
     */
    Select.prototype.ngAfterContentInit = function () {
        this.updateValue(this.value);
    };
    /**
     * We need to init the Materialize select, (see http://materializecss.com/forms.html)
     * and add our own event listeners to the LI elements that Materialize creates to
     * replace the native <select> element, and listeners for blur, focus and change
     * events on the fakeInput which Materialize creates in the place of the native <select>.
     */
    Select.prototype.ngAfterViewInit = function () {
        var _this = this;
        var nativeSelect = this.elementRef.nativeElement.querySelector('select');
        this.$nativeSelect = $(nativeSelect);
        // in a setTimeout to get around a weird issue where the first option was
        // always being selected. I think it has to do with the fact that the ValueAccessor
        // needs to run to update the nativeSelect value to the correct value before we
        // init the Materialize magic.
        setTimeout(function () {
            _this.$nativeSelect.material_select();
            // the Materialize material_select() function annoyingly sets the value of the nativeSelect and the
            // fakeInput to the first option in the list, if the value is empty:
            // https://github.com/Dogfalo/materialize/blob/418eaa13efff765a2d68dcc0bc1b3fabf8484183/js/forms.js#L587-L591
            // This is not what we want, so we need to override this and set the values back to what they were before
            // material_select() was invoked.
            _this.updateValue(_this.value);
            _this.registerHandlers();
        });
        this.subscription = this.selectOptions.changes.subscribe(function () {
            _this.unregisterHandlers();
            nativeSelect.value = _this.value;
            _this.$nativeSelect.material_select();
            _this.registerHandlers();
        });
    };
    /**
     * Clean up our manually-added event listeners.
     */
    Select.prototype.ngOnDestroy = function () {
        this.unregisterHandlers();
        this.$nativeSelect.material_select('destroy');
        this.subscription.unsubscribe();
    };
    /**
     * Updates the value of the select component, setting the correct properties on the native DOM elements
     * depending on whether or not we are in "multiple" mode.
     */
    Select.prototype.updateValue = function (value) {
        var _this = this;
        if (value === undefined) {
            return;
        }
        var nativeSelect = this.elementRef.nativeElement.querySelector('select');
        var fakeInput = this.elementRef.nativeElement.querySelector('input.select-dropdown');
        this.value = value;
        if (value instanceof Array) {
            var optionNodes = this.elementRef.nativeElement.querySelectorAll('option');
            var options = Array.prototype.slice.call(optionNodes);
            // The `multiple` property may not have been bound yet on the nativeSelect. Without this being
            // set to "true", we cannot select multiple options below.
            if (this.multiple && !nativeSelect.multiple) {
                nativeSelect.multiple = true;
            }
            options.forEach(function (option) {
                option.selected = (-1 < _this.value.indexOf(option.value));
            });
        }
        else {
            nativeSelect.value = value;
        }
        if (fakeInput) {
            fakeInput.value = value !== null ? String(value) : '';
        }
    };
    // ValueAccessor members
    Select.prototype.writeValue = function (value) {
        this.updateValue(value);
    };
    Select.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function () {
            fn(_this.value);
        };
    };
    Select.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * If this is a multiple select, turn the string value of the input into an array
     * of strings.
     */
    Select.prototype.normalizeValue = function (value) {
        var stringToArray = function (str) {
            return str.split(',')
                .map(function (s) { return s.trim(); })
                .filter(function (s) { return s !== ''; });
        };
        return this.multiple ? stringToArray(value) : value;
    };
    Select.prototype.registerHandlers = function () {
        $(this.elementRef.nativeElement).find('li').on('click', this.selectItemClick);
        $(this.elementRef.nativeElement).find('input.select-dropdown').on('blur', this.inputBlur);
    };
    Select.prototype.unregisterHandlers = function () {
        $(this.elementRef.nativeElement).find('li').off('click', this.selectItemClick);
        $(this.elementRef.nativeElement).find('input.select-dropdown').off('blur', this.inputBlur);
    };
    Select.prototype._updateValueWhenListOfOptionsChanges = function (query) {
        var _this = this;
        async_1.ObservableWrapper.subscribe(query.changes, function (_) { return _this.writeValue(_this.value); });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Select.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Select.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Select.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Select.prototype, "value", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select.prototype, "id", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select.prototype, "change", void 0);
    __decorate([
        core_1.ContentChildren(common_1.NgSelectOption, { descendants: true }), 
        __metadata('design:type', core_1.QueryList)
    ], Select.prototype, "selectOptions", void 0);
    Select = __decorate([
        core_1.Component({
            selector: 'gtx-select',
            template: require('./select.tpl.html')
        }),
        __param(1, core_1.Self()),
        __param(1, core_1.Optional()),
        __param(2, core_1.Query(common_1.NgSelectOption, { descendants: true })), 
        __metadata('design:paramtypes', [core_1.ElementRef, common_1.NgControl, core_1.QueryList])
    ], Select);
    return Select;
}());
exports.Select = Select;
