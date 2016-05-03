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
var input_component_1 = require('../input/input.component');
var modal_component_1 = require('../modal/modal.component');
var button_component_1 = require('../button/button.component');
/**
 * Rome is a date picker widget: https://github.com/bevacqua/rome
 */
var rome = require('rome');
var momentjs = rome.moment;
/**
 * A form control for selecting a date and (optionally) a time. Depends on [Modal](#/modal).
 *
 * ```html
 * <gtx-date-time-picker [(ngModel)]="dateOfBirth"
 *                         label="Date of Birth"
 *                         displayTime="false"
 *                         format="Do MMMM YYYY">
 * </gtx-date-time-picker>
 * ```
 */
var DateTimePicker = (function () {
    function DateTimePicker(ngControl) {
        /**
         * A label for the control
         */
        this.label = '';
        /**
         * Fires when the "okay" button is clicked to close the picker.
         */
        this.change = new core_1.EventEmitter();
        this.value = momentjs();
        // ValueAccessor members
        this.onChange = function () { };
        this.onTouched = function () { };
        this.showModal = false;
        this.uid = 'calendar_' + Math.random().toString(16).slice(2);
        this._displayTime = true;
        this.displayValue = ' ';
        this.time = {
            h: 0,
            m: 0,
            s: 0
        };
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }
    Object.defineProperty(DateTimePicker.prototype, "displayTime", {
        /**
         * Set to `false` to omit the time picker part of the component. Defaults to `true`
         */
        set: function (val) {
            this._displayTime = val === true || val === 'true';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If a timestamp has been passed in, initialize the value to that time.
     */
    DateTimePicker.prototype.ngOnInit = function () {
        if (this.timestamp) {
            this.value = momentjs.unix(Number(this.timestamp));
            this.displayValue = this.getTimeString(this.value, this._displayTime);
            this.updateTimeObject(this.value);
        }
    };
    /**
     * Initialize the Rome widget instance.
     */
    DateTimePicker.prototype.ngAfterViewInit = function () {
        var _this = this;
        var calendarEl = document.querySelector('#' + this.uid);
        this.cal = rome(calendarEl, { time: false, initialValue: this.value })
            .on('data', function () { return _this.value = _this.cal.getMoment(); });
    };
    DateTimePicker.prototype.ngOnDestroy = function () {
        this.cal.destroy();
    };
    /**
     * Update the this.value in accordance with the input of one of the
     * time fields (h, m, s).
     */
    DateTimePicker.prototype.updateTime = function (segment, value) {
        switch (segment) {
            case 'hours':
                this.value.hour(value);
                break;
            case 'minutes':
                this.value.minute(value);
                break;
            case 'seconds':
                this.value.second(value);
                break;
            default:
        }
        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    };
    /**
     * If the input is focused and the Enter key is pressed, we want this to
     * open the picker modal.
     */
    DateTimePicker.prototype.inputKeyHandler = function (e) {
        // Enter key
        if (e.keyCode === 13) {
            this.showModal = true;
        }
    };
    /**
     * Handler for the incrementing the time values when up or down arrows are pressed.
     */
    DateTimePicker.prototype.timeKeyHandler = function (segment, e) {
        // UP arrow key
        if (e.keyCode === 38) {
            e.preventDefault();
            this.incrementTime(segment);
        }
        // DOWN arrow key
        if (e.keyCode === 40) {
            e.preventDefault();
            this.decrementTime(segment);
        }
    };
    DateTimePicker.prototype.incrementTime = function (segment) {
        this.addToTime(segment, 1);
    };
    DateTimePicker.prototype.decrementTime = function (segment) {
        this.addToTime(segment, -1);
    };
    /**
     * Update the displayed value and close the modal.
     */
    DateTimePicker.prototype.confirm = function (modal) {
        this.displayValue = this.getTimeString(this.value, this._displayTime);
        this.change.emit(this.value.unix());
        this.onChange();
        modal.closeModal();
    };
    /**
     * Close the picker widget without updating the displayed value or emitting a change event.
     */
    DateTimePicker.prototype.cancel = function (modal) {
        modal.closeModal();
    };
    DateTimePicker.prototype.writeValue = function (value) {
        if (value) {
            this.value = momentjs.unix(Number(value));
            this.displayValue = this.getTimeString(this.value, this._displayTime);
            this.updateTimeObject(this.value);
            this.updateCalendar(this.value);
        }
    };
    DateTimePicker.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function () { return fn(_this.value.unix()); };
    };
    DateTimePicker.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * Increment or decrement the value and update the time object.
     */
    DateTimePicker.prototype.addToTime = function (segment, increment) {
        this.value.add(increment, segment);
        this.updateTimeObject(this.value);
        this.updateCalendar(this.value);
    };
    /**
     * Update the time object based on the value of this.value.
     */
    DateTimePicker.prototype.updateTimeObject = function (date) {
        this.time.h = date.hour();
        this.time.m = date.minute();
        this.time.s = date.second();
    };
    /**
     * Update the Rome calendar widget with the current value.
     */
    DateTimePicker.prototype.updateCalendar = function (value) {
        if (this.cal) {
            this.cal.setValue(value);
        }
    };
    /**
     * Returns a human-readable string to be displayed in the control input field.
     */
    DateTimePicker.prototype.getTimeString = function (date, displayTime) {
        if (this.format) {
            return date.format(this.format);
        }
        var formatString = 'DD/MM/YYYY';
        formatString += displayTime ? ', HH:mm:ss' : '';
        return date.format(formatString);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DateTimePicker.prototype, "timestamp", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DateTimePicker.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DateTimePicker.prototype, "format", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], DateTimePicker.prototype, "displayTime", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DateTimePicker.prototype, "change", void 0);
    DateTimePicker = __decorate([
        core_1.Component({
            selector: 'gtx-date-time-picker',
            template: require('./date-time-picker.tpl.html'),
            directives: [input_component_1.InputField, modal_component_1.Modal, button_component_1.Button]
        }),
        __param(0, core_1.Self()),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [common_1.NgControl])
    ], DateTimePicker);
    return DateTimePicker;
}());
exports.DateTimePicker = DateTimePicker;
