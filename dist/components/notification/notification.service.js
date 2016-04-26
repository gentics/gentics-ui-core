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
var toast_component_1 = require('./toast.component');
var defaultOptions = {
    message: '',
    type: 'default',
    delay: 3000,
    dismissOnClick: true
};
/**
 * A toast notification service. Depends on the `<gtx-overlay-host>` being present in the app
 * (see `registerHostElement`).
 *
 * ```typescript
 * let dismiss = this.notification.show({
 *     message: 'Content Saved',
 *     type: 'success',
 *     delay: 3000
 * });
 *
 * // to manually dismiss the toast
 * dismiss();
 * ```
 *
 * ##### `INotificationOptions`
 *
 * The `show()` method takes an `INotificationOptions` object as its argument:
 *
 * | Property           | Type                                | Default   | Description |
 * | --------           | ------------------------------      | -------   | ----------- |
 * | **message**        | `string`                            | ''        | The message to display |
 * | **type**           | `'default'`, `'error'`, `'success'` | 'default' | The style of toast |
 * | **delay**          | `number`                            | 3000      | ms before toast is dismissed. 0 == no dismiss |
 * | **dismissOnClick** | `boolean`                           | true      | If true, the toast can be dismissed by click or swipe |
 * | **action.label**   | `string`                            |           | Optional action label |
 * | **action.onClick** | `Function`                          |           | Callback if action label is clicked |
 *
 */
var Notification = (function () {
    function Notification(loader) {
        this.loader = loader;
        this.open$ = new core_1.EventEmitter();
        this.openToasts = [];
        /*
         * Spacing between stacked toasts
         */
        this.verticalMargin = 10;
    }
    /**
     * Used internally to register the service with the [OverlayHost](#/overlay-host) component.
     */
    Notification.prototype.registerHostElement = function (elementRef) {
        this.hostElementRef = elementRef;
    };
    /**
     * Show a toast notification. Returns an object with a dismiss() method, which will
     * dismiss the toast when invoked.
     */
    Notification.prototype.show = function (options) {
        // TODO: add check that hostElementRef is set.
        var mergedOptions = Object.assign({}, defaultOptions, options);
        var toast;
        this.createToast(mergedOptions)
            .then(function (t) { return toast = t; });
        return {
            dismiss: function () { return toast.dismissFn(); }
        };
    };
    /**
     * Used internally by the [OverlayHost](#/overlay-host) to clean up.
     */
    Notification.prototype.destroyAllToasts = function () {
        this.openToasts.forEach(function (o) {
            if (typeof o.toast.dismissFn === 'function') {
                o.toast.dismissFn();
            }
        });
        this.openToasts = [];
    };
    /**
     * Dispose of the Toast component and remove its reference from the
     * openToasts array.
     */
    Notification.prototype.destroyToast = function (componentRef) {
        var _this = this;
        var toast = componentRef.instance;
        var index = this.getToastIndex(toast);
        if (-1 < index) {
            var timer = this.openToasts[index].dismissTimer;
            if (timer) {
                clearTimeout(timer);
            }
            this.openToasts.splice(index, 1);
        }
        toast.startDismiss();
        setTimeout(function () {
            componentRef.dispose();
            _this.positionOpenToasts();
        }, 200);
    };
    /**
     * Dynamically create and load a new Toast component next to the
     * NotificationHost component in the DOM.
     */
    Notification.prototype.createToast = function (options) {
        var _this = this;
        return this.loader.loadNextToLocation(toast_component_1.Toast, this.hostElementRef)
            .then(function (componentRef) {
            var toast = componentRef.instance;
            var dismissTimer;
            toast.message = options.message;
            toast.type = options.type;
            toast.dismissOnClick = options.dismissOnClick;
            toast.dismissFn = function () { return _this.destroyToast(componentRef); };
            if (options.action && options.action.label) {
                toast.actionLabel = options.action.label;
            }
            if (options.action && options.action.onClick) {
                toast.actionOnClick = options.action.onClick;
            }
            if (0 < options.delay) {
                dismissTimer = setTimeout(function () { return toast.dismissFn(); }, options.delay);
            }
            _this.openToasts.unshift({
                toast: toast,
                dismissTimer: dismissTimer
            });
            _this.positionOpenToasts();
            return toast;
        });
    };
    Notification.prototype.positionOpenToasts = function () {
        var _this = this;
        setTimeout(function () {
            _this.openToasts.forEach(function (o) {
                o.toast.position.top = _this.getToastTop(o.toast);
            });
        });
    };
    /**
     * Calculates the value of the "top" offset for this toast by adding up
     * the heights of the other toasts which are open above this one.
     */
    Notification.prototype.getToastTop = function (toast) {
        var _this = this;
        var index = this.getToastIndex(toast);
        return this.openToasts
            .filter(function (o, i) { return i < index; })
            .reduce(function (top, o) {
            return top += o.toast.getHeight() + _this.verticalMargin;
        }, 0);
    };
    /**
     * Returns the index of the toast object in the openToasts array.
     */
    Notification.prototype.getToastIndex = function (toast) {
        return this.openToasts.map(function (o) { return o.toast; }).indexOf(toast);
    };
    Notification = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.DynamicComponentLoader])
    ], Notification);
    return Notification;
}());
exports.Notification = Notification;
