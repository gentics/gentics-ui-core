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
var core_1 = require('@angular/core');
var ModalService = (function () {
    function ModalService() {
    }
    /**
     * Create a new modal instance
     */
    ModalService.prototype.create = function (element, options) {
        return new ModalInstance(element, options);
    };
    ModalService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ModalService);
    return ModalService;
}());
exports.ModalService = ModalService;
/**
 * A modalInstance creates takes some element, pulls it out of the DOM and adds / removes it to the bottom of
 * the body when the modal is opened / closed. Also manages the overlay that goes with the modal.
 */
var ModalInstance = (function () {
    function ModalInstance(element, options) {
        var _this = this;
        this.element = element;
        this.changes = new core_1.EventEmitter();
        this.options = {
            closeOnOverlayClick: true,
            closeOnEscape: true
        };
        var $body = $('body');
        this.options = $.extend(this.options, options);
        this.$overlay = $('<div class="lean-overlay gtx-modal-overlay"></div>').css('display', 'none');
        this.$modal = $(this.element).css('display', 'none');
        this.$modal.remove();
        if (this.options.closeOnOverlayClick) {
            this.$overlay.click(function () {
                _this.changes.emit('close');
            });
        }
        if (this.options.maxWidth) {
            this.$modal.css('max-width', this.options.maxWidth);
        }
        $body.append(this.$overlay);
        $body.append(this.$modal);
    }
    /**
     * Open the modal and display the overlay.
     */
    ModalInstance.prototype.open = function () {
        var _this = this;
        $('body').css('overflow', 'hidden');
        this.$overlay.css({ display: 'block', opacity: 0 });
        this.$modal.css({
            display: 'block',
            opacity: 0
        });
        this.$overlay.velocity({ opacity: 0.5 }, { duration: 350, queue: false, easing: 'easeOutCubic' });
        this.$modal.data('associated-overlay', this.$overlay[0]);
        $.Velocity.hook(this.$modal, 'scaleX', '0.7');
        this.$modal.css({ top: '4%' });
        this.$modal.velocity({ top: '10%', opacity: 1, scaleX: '1' }, {
            duration: 350,
            queue: false,
            easing: 'easeOutCubic',
            complete: function () {
                if (typeof (_this.options.onOpen) === 'function') {
                    _this.options.onOpen();
                }
            }
        });
    };
    /**
     * Close the modal and hide the overlay.
     */
    ModalInstance.prototype.close = function (val) {
        var _this = this;
        // Disable scrolling
        $('body').css('overflow', '');
        this.$overlay.velocity({ opacity: 0 }, {
            duration: 250,
            queue: false,
            easing: 'easeOutQuart',
            complete: function () { _this.$overlay.css('display', 'none'); }
        });
        this.$modal.velocity({ top: '4%', opacity: 0, scaleX: '0.7' }, {
            duration: 250,
            complete: function () {
                _this.$modal.css('display', 'none');
                if (typeof (_this.options.onClose) === 'function') {
                    _this.options.onClose(val);
                }
            }
        });
    };
    /**
     * Remove the modal and overlay DOM references. Should be called by any component which creates a
     * ModalInstance in the ngOnDestroy lifecycle method.
     */
    ModalInstance.prototype.destroy = function () {
        this.$modal.remove();
        this.$overlay.remove();
    };
    /**
     * Set or update the maxWidth value. Val should be a valid CSS max-width value.
     */
    ModalInstance.prototype.setMaxWidth = function (val) {
        this.options.maxWidth = val;
        this.$modal.css('max-width', this.options.maxWidth);
    };
    return ModalInstance;
}());
exports.ModalInstance = ModalInstance;
