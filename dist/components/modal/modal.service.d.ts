import { EventEmitter } from 'angular2/core';
export interface IModalOptions {
    onOpen?: Function;
    onClose?: Function;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    maxWidth?: string;
}
export declare class ModalService {
    /**
     * Create a new modal instance
     */
    create(element: HTMLElement, options?: IModalOptions): ModalInstance;
}
/**
 * A modalInstance creates takes some element, pulls it out of the DOM and adds / removes it to the bottom of
 * the body when the modal is opened / closed. Also manages the overlay that goes with the modal.
 */
export declare class ModalInstance {
    private element;
    changes: EventEmitter<string>;
    private $modal;
    private $overlay;
    private options;
    constructor(element: HTMLElement, options?: IModalOptions);
    /**
     * Open the modal and display the overlay.
     */
    open(): void;
    /**
     * Close the modal and hide the overlay.
     */
    close(val: any): void;
    /**
     * Remove the modal and overlay DOM references. Should be called by any component which creates a
     * ModalInstance in the ngOnDestroy lifecycle method.
     */
    destroy(): void;
    /**
     * Set or update the maxWidth value. Val should be a valid CSS max-width value.
     */
    setMaxWidth(val: string): void;
}
