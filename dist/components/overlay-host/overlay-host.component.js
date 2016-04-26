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
var notification_service_1 = require('./../notification/notification.service');
/**
 * The OverlayHost is required to display any kind of overlay component such as a modal or
 * [toast notification](#/notification). It represents the location in the DOM into which new overlays
 * will be loaded. As such it should be at or close to the root of your app (i.e. a direct
 * child of you root App component).
 *
 * There are no attributes to configure nor events to listen to - all interaction with this
 * component happens though the services that register with it.
 *
 * ```html
 * <gtx-overlay-host></gtx-overlay-host>
 * ```
 */
var OverlayHost = (function () {
    function OverlayHost(notification, elementRef) {
        this.notification = notification;
        this.elementRef = elementRef;
        notification.registerHostElement(elementRef);
    }
    /**
     * Dispose of all open toasts and clear the openToasts array.
     */
    OverlayHost.prototype.ngOnDestroy = function () {
        this.notification.destroyAllToasts();
    };
    OverlayHost = __decorate([
        core_1.Component({
            selector: 'gtx-overlay-host',
            template: ""
        }), 
        __metadata('design:paramtypes', [notification_service_1.Notification, core_1.ElementRef])
    ], OverlayHost);
    return OverlayHost;
}());
exports.OverlayHost = OverlayHost;
