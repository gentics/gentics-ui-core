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
 * RadioGroup groups multiple {@link RadioButton} elements together.
 * Use ngControl or ngFormControl to connect it to a form.
 */
var RadioGroup = (function () {
    function RadioGroup(ngControl) {
        this.ngControl = ngControl;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        this.radioButtons = [];
        this.groupID = RadioGroup.instanceCounter++;
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }
    Object.defineProperty(RadioGroup.prototype, "uniqueName", {
        get: function () {
            return 'group-' + this.groupID;
        },
        enumerable: true,
        configurable: true
    });
    RadioGroup.prototype.add = function (radio) {
        if (this.radioButtons.indexOf(radio) < 0) {
            this.radioButtons.push(radio);
        }
    };
    RadioGroup.prototype.remove = function (radio) {
        var pos = this.radioButtons.indexOf(radio);
        if (pos >= 0) {
            this.radioButtons.splice(pos, 1);
        }
    };
    RadioGroup.prototype.radioSelected = function (selected) {
        for (var _i = 0, _a = this.radioButtons; _i < _a.length; _i++) {
            var radio = _a[_i];
            if (radio != selected) {
                radio.writeValue(selected ? selected.value : null);
            }
        }
        this.onChange(selected ? selected.value : null);
    };
    RadioGroup.prototype.writeValue = function (value) {
        for (var _i = 0, _a = this.radioButtons; _i < _a.length; _i++) {
            var radio = _a[_i];
            radio.writeValue(value);
        }
    };
    RadioGroup.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    RadioGroup.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    RadioGroup.instanceCounter = 0;
    RadioGroup = __decorate([
        core_1.Directive({
            selector: 'gtx-radio-group, [gtx-radio-group]'
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl])
    ], RadioGroup);
    return RadioGroup;
}());
exports.RadioGroup = RadioGroup;
/**
 * RadioButton wraps the native `<input type="radio">` form element.
 * To connect multiple radio buttons with a form via ngControl,
 * wrap them in a {@link RadioGroup} (`<gtx-radio-group>`).
 *
 * ```html
 * <gtx-radio-button [(ngModel)]="val" value="A" label="A"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="B" label="B"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="C" label="C"></gtx-radio-button>
 * ```
 *
 * ##### Stateless Mode
 * By default, the RadioButton keeps track of its own internal checked state. This makes sense
 * for most use cases, such as when used in a form bound to NgControl.
 *
 * However, in some cases we want to explicitly set the state from outside. This is done by binding
 * to the <code>checked</code> attribute. When this attribute is bound, the checked state of the
 * RadioButton will *only* change when the value of the binding changes. Clicking on the RadioButton
 * will have no effect other than to emit an event which the parent can use to update the binding.
 *
 * Here is a basic example of a stateless RadioButton where the parent component manages the state:
 *
 * ```html
 * <gtx-radio-button [checked]="isChecked"></gtx-checkbox>
 * ```
 */
var RadioButton = (function () {
    function RadioButton(control, group, modelAttrib) {
        this.group = group;
        /**
         * The disabled state of the control
         */
        this.disabled = false;
        /**
         * ID of the control
         */
        this.id = 'radio-' + Math.random().toString(36).substr(2);
        /**
         * Label for the radio button
         */
        this.label = '';
        /**
         * Sets the readonly state
         */
        this.readonly = false;
        /**
         * Sets the required state
         */
        this.required = false;
        /**
         * Value associated with this input
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
        this.inputChecked = false;
        /**
         * See note above on stateless mode.
         */
        this.statelessMode = false;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        if (control && !control.valueAccessor) {
            control.valueAccessor = this;
        }
        // Pre-set a common input name for grouped input elements
        if (group) {
            this.name = group.uniqueName;
        }
        else if (modelAttrib) {
            this.name = modelAttrib;
        }
    }
    Object.defineProperty(RadioButton.prototype, "checked", {
        /**
         * The checked state of the control. When set, the RadioButton will be
         * in stateless mode.
         */
        get: function () {
            return this.inputChecked;
        },
        set: function (val) {
            this.statelessMode = true;
            if (val != this.inputChecked) {
                this.inputChecked = val === true || val === 'true';
                this.change.emit(this.value);
                if (val && this.group) {
                    this.group.radioSelected(this);
                }
                if (val) {
                    this.onChange(this.value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    RadioButton.prototype.onBlur = function () {
        this.blur.emit(this.checked);
        this.onTouched();
    };
    RadioButton.prototype.onFocus = function () {
        this.focus.emit(this.checked);
    };
    RadioButton.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    RadioButton.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    RadioButton.prototype.writeValue = function (value) {
        var wasChecked = this.checked;
        this.inputChecked = (value === this.value);
        if (wasChecked && !this.inputChecked) {
            this.change.emit(false);
            if (this.group) {
                this.group.radioSelected(null);
            }
        }
    };
    RadioButton.prototype.ngOnInit = function () {
        if (this.inputChecked) {
            this.onChange(this.value);
        }
        if (this.group) {
            this.group.add(this);
            if (this.inputChecked) {
                this.group.radioSelected(this);
            }
        }
    };
    RadioButton.prototype.ngOnDestroy = function () {
        if (this.group) {
            this.group.remove(this);
        }
    };
    RadioButton.prototype.onInputChecked = function (e, input) {
        if (e) {
            e.stopPropagation();
        }
        if (this.statelessMode) {
            var newState = input.checked;
            if (input.checked !== this.inputChecked) {
                input.checked = !!this.inputChecked;
            }
            this.change.emit(newState);
            return false;
        }
        this.inputChecked = true;
        this.change.emit(this.value);
        if (this.group) {
            this.group.radioSelected(this);
        }
        this.onChange(this.value);
        return true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RadioButton.prototype, "checked", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RadioButton.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RadioButton.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RadioButton.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RadioButton.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RadioButton.prototype, "readonly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RadioButton.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButton.prototype, "value", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RadioButton.prototype, "blur", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RadioButton.prototype, "focus", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RadioButton.prototype, "change", void 0);
    RadioButton = __decorate([
        core_1.Component({
            selector: 'gtx-radio-button',
            template: require('./radio-button.tpl.html')
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()),
        __param(2, core_1.Attribute('ngModel')), 
        __metadata('design:paramtypes', [common_1.NgControl, RadioGroup, String])
    ], RadioButton);
    return RadioButton;
}());
exports.RadioButton = RadioButton;
