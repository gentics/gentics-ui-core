import {Injectable, EventEmitter} from 'angular2/core';
declare var $: JQueryStatic;

export interface IModalOptions {
    onOpen?: Function;
    onClose?: Function;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    maxWidth?: string;
}

@Injectable()
export class ModalService {

    /**
     * Create a new modal instance
     */
    create(element: HTMLElement, options?: IModalOptions): ModalInstance {
        return new ModalInstance(element, options);
    }

}

/**
 * A modalInstance creates takes some element, pulls it out of the DOM and adds / removes it to the bottom of
 * the body when the modal is opened / closed. Also manages the overlay that goes with the modal.
 */
export class ModalInstance {

    changes: EventEmitter<string> = new EventEmitter();

    private $modal: JQuery;
    private $overlay: JQuery;
    private options: IModalOptions = {
        closeOnOverlayClick: true,
        closeOnEscape: true
    };

    constructor(private element: HTMLElement, options?: IModalOptions) {
        const $body: JQuery = $('body');

        this.options = $.extend(this.options, options);
        this.$overlay = $('<div class="lean-overlay gtx-modal-overlay"></div>').css('display', 'none');
        this.$modal = $(this.element).css('display', 'none');
        this.$modal.remove();

        if (this.options.closeOnOverlayClick) {
            this.$overlay.click(() => {
                this.changes.emit('close');
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
    open(): void {

        $('body').css('overflow', 'hidden');

        this.$overlay.css({ display : 'block', opacity : 0 });

        this.$modal.css({
            display : 'block',
            opacity: 0
        });

        this.$overlay.velocity({opacity: 0.5}, {duration: 350, queue: false, ease: 'easeOutCubic'});
        this.$modal.data('associated-overlay', this.$overlay[0]);

        $.Velocity.hook(this.$modal, 'scaleX', '0.7');
        this.$modal.css({ top: '4%' });
        this.$modal.velocity({top: '10%', opacity: 1, scaleX: '1'},
            {
                duration: 350,
                queue: false,
                ease: 'easeOutCubic',
                complete: (): void => {
                    if (typeof(this.options.onOpen) === 'function') {
                        this.options.onOpen();
                    }
                }
            });
    }

    /**
     * Close the modal and hide the overlay.
     */
    close(): void {
        // Disable scrolling
        $('body').css('overflow', '');

        this.$overlay.velocity({ opacity: 0},
            {
                duration: 250,
                queue: false,
                ease: 'easeOutQuart',
                complete: (): void => this.$overlay.css('display', 'none')
            }
        );

        this.$modal.velocity({ top: '4%', opacity: 0, scaleX: '0.7'},
            {
                duration: 250,
                complete: (): void => {
                    this.$modal.css('display', 'none');
                    if (typeof(this.options.onClose) === 'function') {
                        this.options.onClose();
                    }
                }
            }
        );
    }

    /**
     * Remove the modal and overlay DOM references. Should be called by any component which creates a
     * ModalInstance in the ngOnDestroy lifecycle method.
     */
    destroy(): void {
        this.$modal.remove();
        this.$overlay.remove();
    }
}
