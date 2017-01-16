import {Component, ElementRef, ViewChild} from '@angular/core';

// Hammerjs always creates a global Hammer, see https://github.com/hammerjs/hammer.js/issues/1027
require('hammerjs');

export type ToastType = 'default' | 'error' | 'success';

/**
 * A Toast notification component. Not to be used directly - see Notification service for
 * documentation.
 */
@Component({
    selector: 'gtx-toast',
    templateUrl: './toast.tpl.html'
})
export class Toast {
    message: string;
    type: ToastType|string;
    position: any = {
        top: 10,
        right: 10
    };
    actionLabel: string;
    actionOnClick: Function;
    dismissFn: Function;
    dismissOnClick: boolean = true;
    dismissing: boolean = false;
    @ViewChild('toast') toastRef: ElementRef;

    private hammerManager: HammerManager;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit(): void {
        this.initSwipeHandler();
    }

    ngOnDestroy(): void {
        if (this.hammerManager) {
            this.hammerManager.destroy();
            this.hammerManager = undefined;
        }
    }

    /**
     * Returns the height of the toast div.
     */
    getHeight(): number {
        return this.toastRef.nativeElement.getBoundingClientRect().height;
    }

    /**
     * Returns a CSS transform string for positioning
     */
    getTransform(): string {
        if (this.dismissing) {
            return `translate3d(100%, ${this.position.top}px, 0)`;
        } else {
            return `translate3d(0, ${this.position.top}px, 0)`;
        }
    }

    /**
     * Begin the dismiss animation
     */
    startDismiss(): void {
        this.dismissing = true;
    }

    /**
     * Invoke the action onClick handler if defined.
     */
    actionClick(): void {
        if (typeof this.actionOnClick === 'function') {
            this.actionOnClick();
        }
    }


    /**
     * Manual dismiss which is invoked when the toast is clicked.
     */
    dismiss(): void {
        if (this.dismissOnClick && typeof this.dismissFn === 'function') {
            this.dismissFn();
        }
    }

    /**
     * Set up a Hammerjs-based swipe gesture handler to dismiss toasts.
     */
    private initSwipeHandler(): void {
        this.hammerManager = new Hammer(this.elementRef.nativeElement);
        this.hammerManager.on('swipe', (e: HammerInput) => {
            if (e.pointerType === 'touch') {
                // Hammerjs represents directions with an enum; 4 = right.
                if (e.direction === 4) {
                    this.dismiss();
                }
            }
        });
    }
}
