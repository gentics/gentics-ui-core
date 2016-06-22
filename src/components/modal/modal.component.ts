import {Component, Input, Output, ElementRef, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {ModalService, ModalInstance} from './modal.service';

declare var $: JQueryStatic;

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
    @Input() maxWidth: string;

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

    private _padding: boolean = true;
    private modal: ModalInstance;
    private subscription: Subscription;
    private isClosing: boolean = false;

    constructor(private elementRef: ElementRef,
                private modalService: ModalService) {
    }

    ngAfterViewInit(): void {
        const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.modal');
        this.modal = this.modalService.create(modalElement, {
            maxWidth: this.maxWidth,
            onClose: (val: any): void => {
                this.close.emit(val);
                setTimeout(() => this.isClosing = false);
            }
        });

        this.subscription = this.modal.changes.subscribe((type: string) => {
            if (type === 'close') {
                this.closeModal();
            }
        });

        this.registerKeyHandler();
    }

    ngOnChanges(): void {
        if (!this.modal) {
            return;
        }
        if (this.opened) {
            this.modal.open();
        } else {
            this.closeModal();
        }

        if (this.maxWidth) {
            this.modal.setMaxWidth(this.maxWidth);
        }
    }

    ngOnDestroy(): void {
        this.modal.destroy();
        this.subscription.unsubscribe();
        this.unRegisterKeyHandler();
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
        if (!this.isClosing) {
            this.isClosing = true;
            this.modal.close(val);
        }
    }

    /**
     * Close the modal when the ESC key is pressed.
     */
    private keyHandler = (e: JQueryEventObject): void => {
        if (e.keyCode === 27) {
            this.closeModal();
        }
    };

    private registerKeyHandler(): void {
        $(document).on('keyup', this.keyHandler);
    }

    private unRegisterKeyHandler(): void {
        $(document).off('keyup', this.keyHandler);
    }
}
