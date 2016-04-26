import { ElementRef } from 'angular2/core';
export declare type ToastType = 'default' | 'error' | 'success';
/**
 * A Toast notification component. Not to be used directly - see Notification service for
 * documentation.
 */
export declare class Toast {
    private elementRef;
    message: string;
    type: ToastType | string;
    position: any;
    actionLabel: string;
    actionOnClick: Function;
    dismissFn: Function;
    dismissOnClick: boolean;
    dismissing: boolean;
    hammerManager: HammerManager;
    toastRef: ElementRef;
    constructor(elementRef: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Returns the height of the toast div.
     */
    getHeight(): number;
    /**
     * Returns a CSS transform string for positioning
     */
    getTransform(): string;
    /**
     * Begin the dismiss animation
     */
    startDismiss(): void;
    /**
     * Invoke the action onClick handler if defined.
     */
    actionClick(): void;
    /**
     * Manual dismiss which is invoked when the toast is clicked.
     */
    dismiss(): void;
    /**
     * Set up a Hammerjs-based swipe gesture handler to dismiss toasts.
     */
    private initSwipeHandler();
}
