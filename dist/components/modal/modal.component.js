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
var modal_service_1 = require('./modal.service');
/**
 * A declarative modal dialog component. Can wrap generic content and display / hide it based on the `opened` attribute.
 * Note that the modal itself is designed to be stateless - the `opened` state must be set from the parent. See
 * the example below for the simple "wiring" required to get the modal to work as expected.
 *
 *
 * An optional `<gtx-modal-footer>` element can be used to contain any action buttons for the modal. They will be
 * floated and aligned to the right of the dialog.
 *
 *
 * ```html
 * <gtx-modal [opened]="showModal" (close)="showModal = false" #modal>
 *     <h4>I'm a modal!</h4>
 *     <p>Here is my content</p>
 *     <gtx-modal-footer>
 *         <button class="btn" (click)="modal.closeModal()">Close</button>
 *     </gtx-modal-footer>
 * </gtx-modal>
 * ```
 */
var Modal = (function () {
    function Modal(elementRef, modalService) {
        var _this = this;
        this.elementRef = elementRef;
        this.modalService = modalService;
        /**
         * When true, the modal will be opened.
         */
        this.opened = false;
        /**
         * Fires when the modal.closeModal() method is invoked.
         */
        this.close = new core_1.EventEmitter();
        this._padding = true;
        this.isClosing = false;
        /**
         * Close the modal when the ESC key is pressed.
         */
        this.keyHandler = function (e) {
            if (e.keyCode === 27) {
                _this.closeModal();
            }
        };
    }
    Object.defineProperty(Modal.prototype, "padding", {
        /**
         * When true, the contents of the modal will padded. When false, the contents
         * will reach to the edge of the modal. Defaults to `true`.
         */
        set: function (val) {
            this._padding = val === true || val === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Modal.prototype.ngAfterViewInit = function () {
        var _this = this;
        var modalElement = this.elementRef.nativeElement.querySelector('.modal');
        this.modal = this.modalService.create(modalElement, {
            maxWidth: this.maxWidth,
            onClose: function (val) {
                _this.close.emit(val);
                setTimeout(function () { return _this.isClosing = false; });
            }
        });
        this.subscription = this.modal.changes.subscribe(function (type) {
            if (type === 'close') {
                _this.closeModal();
            }
        });
        this.registerKeyHandler();
    };
    Modal.prototype.ngOnChanges = function () {
        if (!this.modal) {
            return;
        }
        if (this.opened) {
            this.modal.open();
        }
        else {
            this.closeModal();
        }
        if (this.maxWidth) {
            this.modal.setMaxWidth(this.maxWidth);
        }
    };
    Modal.prototype.ngOnDestroy = function () {
        this.modal.destroy();
        this.subscription.unsubscribe();
        this.unRegisterKeyHandler();
    };
    /**
     * Emit the `close` event. This can be called from a template by getting a reference to the
     * component instance, e.g.
     *
     * <gtx-modal [opened]="showModal" (close)="showModal = false" #modal>
     *     <button class="btn" (click)="modal.closeModal()">Close</button>
     * </gtx-modal>
     */
    Modal.prototype.closeModal = function (val) {
        if (!this.isClosing) {
            this.isClosing = true;
            this.modal.close(val);
        }
    };
    Modal.prototype.registerKeyHandler = function () {
        $(document).on('keyup', this.keyHandler);
    };
    Modal.prototype.unRegisterKeyHandler = function () {
        $(document).off('keyup', this.keyHandler);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Modal.prototype, "opened", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "maxWidth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], Modal.prototype, "padding", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Modal.prototype, "close", void 0);
    Modal = __decorate([
        core_1.Component({
            selector: 'gtx-modal',
            template: require('./modal.tpl.html'),
            providers: [modal_service_1.ModalService]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, modal_service_1.ModalService])
    ], Modal);
    return Modal;
}());
exports.Modal = Modal;
