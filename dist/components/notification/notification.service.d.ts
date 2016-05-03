import { EventEmitter, ComponentResolver, ViewContainerRef } from '@angular/core';
import { ToastType } from './toast.component';
export interface INotificationOptions {
    message: string;
    type?: ToastType | string;
    /**
     * The notification will automatically be dismissed after this delay.
     * To turn off auto-dismissal, set this to 0.
     */
    delay?: number;
    dismissOnClick?: boolean;
    action?: {
        label: string;
        onClick: Function;
    };
}
/**
 * A toast notification service. Depends on the `<gtx-overlay-host>` being present in the app
 * (see `registerHostView`).
 *
 * ```typescript
 * let dismiss = this.notification.show({
 *     message: 'Content Saved',
 *     type: 'success',
 *     delay: 3000
 * });
 *
 * // to manually dismiss the toast
 * dismiss();
 * ```
 *
 * ##### `INotificationOptions`
 *
 * The `show()` method takes an `INotificationOptions` object as its argument:
 *
 * | Property           | Type                                | Default   | Description |
 * | --------           | ------------------------------      | -------   | ----------- |
 * | **message**        | `string`                            | ''        | The message to display |
 * | **type**           | `'default'`, `'error'`, `'success'` | 'default' | The style of toast |
 * | **delay**          | `number`                            | 3000      | ms before toast is dismissed. 0 == no dismiss |
 * | **dismissOnClick** | `boolean`                           | true      | If true, the toast can be dismissed by click or swipe |
 * | **action.label**   | `string`                            |           | Optional action label |
 * | **action.onClick** | `Function`                          |           | Callback if action label is clicked |
 *
 */
export declare class Notification {
    private componentResolver;
    open$: EventEmitter<INotificationOptions>;
    private hostViewContainer;
    private openToasts;
    private verticalMargin;
    constructor(componentResolver: ComponentResolver);
    /**
     * Used internally to register the service with the [OverlayHost](#/overlay-host) component.
     */
    registerHostView(viewContainerRef: ViewContainerRef): void;
    /**
     * Show a toast notification. Returns an object with a dismiss() method, which will
     * dismiss the toast when invoked.
     */
    show(options: INotificationOptions): {
        dismiss: () => void;
    };
    /**
     * Used internally by the [OverlayHost](#/overlay-host) to clean up.
     */
    destroyAllToasts(): void;
    /**
     * Dispose of the Toast component and remove its reference from the
     * openToasts array.
     */
    private destroyToast(componentRef);
    /**
     * Dynamically create and load a new Toast component next to the
     * NotificationHost component in the DOM.
     */
    private createToast(options);
    private positionOpenToasts();
    /**
     * Calculates the value of the "top" offset for this toast by adding up
     * the heights of the other toasts which are open above this one.
     */
    private getToastTop(toast);
    /**
     * Returns the index of the toast object in the openToasts array.
     */
    private getToastIndex(toast);
}
