import {Component, ElementRef, ViewChild} from 'angular2/core';

export type ToastType = 'default' | 'error' | 'success';

/**
 * A Toast notification component. Not to be used directly - see Notification service for
 * documentation.
 */
@Component({
    selector: 'gtx-toast',
    template: require('./toast.tpl.html')
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

    constructor() {}

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
}
