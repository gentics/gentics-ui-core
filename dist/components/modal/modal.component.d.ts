import { ElementRef, EventEmitter } from '@angular/core';
import { ModalService } from './modal.service';
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
export declare class Modal {
    private elementRef;
    private modalService;
    /**
     * When true, the modal will be opened.
     */
    opened: boolean;
    /**
     * Specify a CSS max-width value for the modal.
     */
    maxWidth: string;
    /**
     * When true, the contents of the modal will padded. When false, the contents
     * will reach to the edge of the modal. Defaults to `true`.
     */
    padding: any;
    /**
     * Fires when the modal.closeModal() method is invoked.
     */
    close: EventEmitter<any>;
    private _padding;
    private modal;
    private subscription;
    private isClosing;
    /**
     * Close the modal when the ESC key is pressed.
     */
    private keyHandler;
    constructor(elementRef: ElementRef, modalService: ModalService);
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    /**
     * Emit the `close` event. This can be called from a template by getting a reference to the
     * component instance, e.g.
     *
     * <gtx-modal [opened]="showModal" (close)="showModal = false" #modal>
     *     <button class="btn" (click)="modal.closeModal()">Close</button>
     * </gtx-modal>
     */
    closeModal(val?: any): void;
    private registerKeyHandler();
    private unRegisterKeyHandler();
}
