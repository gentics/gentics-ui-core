import {Component, Input, Output, ElementRef, EventEmitter} from 'angular2/core';
import {Subscription} from 'rxjs';
import {ModalService, ModalInstance} from './modal.service';

declare var $: JQueryStatic;

/**
 * A modal dialog component. Can wrap generic content and display / hide it based on the `opened` attribute.
 *
 * @example
 * <gtx-modal [opened]="showModal" (close)="showModal = false" #modal>
 *     <h4>I'm a modal!</h4>
 *     <p>Here is my content</p>
 *     <p>Is this modal open? {{ showModal }}</p>
 *     <gtx-modal-footer>
 *         <button class="btn" (click)="modal.closeModal()">Close</button>
 *     </gtx-modal-footer>
 * </gtx-modal>
 */
@Component({
    selector: 'gtx-modal',
    template: require('./modal.tpl.html'),
    providers: [ModalService]
})
export class Modal {
    @Input() opened: boolean = false;
    @Output() close: EventEmitter<any> = new EventEmitter();

    private modal: ModalInstance;
    private subscription: Subscription;
    private isClosing: boolean = false;
    /**
     * Close the modal when the ESC key is pressed.
     */
    private keyHandler = (e: JQueryEventObject): void => {
        if (e.keyCode === 27) {
            this.closeModal();
        }
    };

    constructor(private elementRef: ElementRef,
                private modalService: ModalService) {
    }

    ngAfterViewInit(): void {
        const modalElement: HTMLElement = this.elementRef.nativeElement.querySelector('.modal');
        this.modal = this.modalService.create(modalElement, {
            onClose: (): void => {
                this.close.emit(null);
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
    closeModal(): void {
        if (!this.isClosing) {
            this.isClosing = true;
            this.modal.close();
        }
    }

    private registerKeyHandler(): void {
        $(document).on('keyup', this.keyHandler);
    }

    private unRegisterKeyHandler(): void {
        $(document).off('keyup', this.keyHandler);
    }
}
