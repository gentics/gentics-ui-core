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
/**
 * A Toast notification component. Not to be used directly - see Notification service for
 * documentation.
 */
var Toast = (function () {
    function Toast(elementRef) {
        this.elementRef = elementRef;
        this.position = {
            top: 10,
            right: 10
        };
        this.dismissOnClick = true;
        this.dismissing = false;
    }
    Toast.prototype.ngAfterViewInit = function () {
        this.initSwipeHandler();
    };
    Toast.prototype.ngOnDestroy = function () {
        this.hammerManager.destroy();
    };
    /**
     * Returns the height of the toast div.
     */
    Toast.prototype.getHeight = function () {
        return this.toastRef.nativeElement.getBoundingClientRect().height;
    };
    /**
     * Returns a CSS transform string for positioning
     */
    Toast.prototype.getTransform = function () {
        if (this.dismissing) {
            return "translate3d(100%, " + this.position.top + "px, 0)";
        }
        else {
            return "translate3d(0, " + this.position.top + "px, 0)";
        }
    };
    /**
     * Begin the dismiss animation
     */
    Toast.prototype.startDismiss = function () {
        this.dismissing = true;
    };
    /**
     * Invoke the action onClick handler if defined.
     */
    Toast.prototype.actionClick = function () {
        if (typeof this.actionOnClick === 'function') {
            this.actionOnClick();
        }
    };
    /**
     * Manual dismiss which is invoked when the toast is clicked.
     */
    Toast.prototype.dismiss = function () {
        if (this.dismissOnClick && typeof this.dismissFn === 'function') {
            this.dismissFn();
        }
    };
    /**
     * Set up a Hammerjs-based swipe gesture handler to dismiss toasts.
     */
    Toast.prototype.initSwipeHandler = function () {
        var _this = this;
        this.hammerManager = new Hammer(this.elementRef.nativeElement);
        this.hammerManager.on('swipe', function (e) {
            if (e.pointerType === 'touch') {
                // Hammerjs represents directions with an enum; 4 = right.
                if (e.direction === 4) {
                    _this.dismiss();
                }
            }
        });
    };
    __decorate([
        core_1.ViewChild('toast'), 
        __metadata('design:type', core_1.ElementRef)
    ], Toast.prototype, "toastRef", void 0);
    Toast = __decorate([
        core_1.Component({
            selector: 'gtx-toast',
            template: require('./toast.tpl.html')
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Toast);
    return Toast;
}());
exports.Toast = Toast;
