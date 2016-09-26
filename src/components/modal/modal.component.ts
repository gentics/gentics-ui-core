import {Component, Input, Output, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {ModalService} from './modal.service';
import {IModalInstance, IModalOptions} from './modal-interfaces';

/**
 * **Deprecated**
 * This component is deprecated in favour of the [ModalService.fromComponent()](#/modal-service) method, which provides a more
 * flexible way to work with modals.
 *
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
@Component({
    selector: 'gtx-modal',
    template: require('./modal.tpl.html'),
    providers: [ModalService]
})
export class Modal {
    /**
     * When true, the modal will be opened.
     */
    @Input() opened: boolean = false;

    /**
     * Specify a CSS max-width value for the modal.
     */
    @Input() width: string;

    /**
     * When true, the contents of the modal will padded. When false, the contents
     * will reach to the edge of the modal. Defaults to `true`.
     */
    @Input() set padding(val: any) {
        this._padding = val === true || val === 'true';
    }

    /**
     * Fires when the modal.closeModal() method is invoked.
     */
    @Output() close = new EventEmitter<any>();

    @ViewChild('modalContents') modalContents: ElementRef;

    modal: IModalInstance;
    modalOptions: IModalOptions = {};

    private _padding: boolean = true;

    constructor(private modalService: ModalService) {}

    ngAfterViewInit(): void {}

    ngOnChanges(): void {
        if (this.width) {
            this.modalOptions.width = this.width;
        }
        this.modalOptions.padding = this._padding;

        if (this.opened) {
            this.modalService.fromElement(this.modalContents, this.modalOptions)
                .then(modal => {
                    this.modal = modal;
                    return this.modal.open();
                })
                .then(result => this.closeModal(result))
                .catch(reason => this.closeModal(reason));
        } else {
            this.closeModal();
        }


    }

    ngOnDestroy(): void {
    }

    /**
     * Emit the `close` event. This can be called from a template by getting a reference to the
     * component instance, e.g.
     *
     * <gtx-modal [opened]="showModal" (close)="showModal = false" #modal>
     *     <button class="btn" (click)="modal.closeModal()">Close</button>
     * </gtx-modal>
     */
    closeModal(val?: any): void {
        if (this.modal) {
            this.modal.instance.closeFn(val);
            this.close.emit(val);
        }
    }
}
