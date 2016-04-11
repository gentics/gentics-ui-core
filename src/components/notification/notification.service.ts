import {Injectable, EventEmitter, ComponentRef, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Toast, ToastType} from './toast.component';


export interface INotificationOptions {
    message: string;
    type?: ToastType|string;
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

const defaultOptions: INotificationOptions = {
    message: '',
    type: 'default',
    delay: 3000,
    dismissOnClick: true
};

interface IOpenToast {
    toast: Toast;
    dismissTimer: number;
}

@Injectable()
export class Notification {

    open$: EventEmitter<INotificationOptions> = new EventEmitter();
    private hostElementRef: ElementRef;
    private openToasts: IOpenToast[] = [];
    /*
     * Spacing between stacked toasts
     */
    private verticalMargin: number = 10;

    constructor(private loader: DynamicComponentLoader) {}

    registerHostElement(elementRef: ElementRef): void {
        this.hostElementRef = elementRef;
    }

    /**
     * Show a toast notification. Returns an object with a dismiss() method, which will
     * dismiss the toast when invoked.
     */
    show(options: INotificationOptions): { dismiss: () => void } {
        // TODO: add check that hostElementRef is set.
        let mergedOptions: INotificationOptions = Object.assign({}, defaultOptions, options);
        let toast: Toast;
        this.createToast(mergedOptions)
            .then((t: Toast) => toast = t);

        return {
            dismiss: (): void => toast.dismissFn()
        };
    }

    /**
     * Dynamically create and load a new Toast component next to the
     * NotificationHost component in the DOM.
     */
    createToast(options: INotificationOptions): Promise<Toast> {
        return this.loader.loadNextToLocation(Toast, this.hostElementRef)
            .then((componentRef: ComponentRef) => {
                let toast: Toast = componentRef.instance;
                let dismissTimer: number;
                toast.message = options.message;
                toast.type = options.type;
                toast.dismissOnClick = options.dismissOnClick;
                toast.dismissFn = () => this.destroyToast(componentRef);

                if (options.action && options.action.label) {
                    toast.actionLabel = options.action.label;
                }
                if (options.action && options.action.onClick) {
                    toast.actionOnClick = options.action.onClick;
                }

                if (0 < options.delay) {
                    dismissTimer = <any> setTimeout(() => toast.dismissFn(), options.delay);
                }

                this.openToasts.unshift({
                    toast,
                    dismissTimer
                });
                this.positionOpenToasts();
                return toast;
            });
    }

    /**
     * Dispose of the Toast component and remove its reference from the
     * openToasts array.
     */
    destroyToast(componentRef: ComponentRef): void {
        let toast: Toast = componentRef.instance;
        let index = this.getToastIndex(toast);
        if (-1 < index) {
            let timer: number = this.openToasts[index].dismissTimer;
            if (timer) {
                clearTimeout(timer);
            }
            this.openToasts.splice(index, 1);
        }
        toast.startDismiss();
        setTimeout(() => {
            componentRef.dispose();
            this.positionOpenToasts();
        }, 200);

    }

    destroyAllToasts(): void {
        this.openToasts.forEach((o: IOpenToast) => {
            if (typeof o.toast.dismissFn === 'function') {
                o.toast.dismissFn();
            }
        });
        this.openToasts = [];
    }

    private positionOpenToasts(): void {
        setTimeout(() => {
            this.openToasts.forEach((o: IOpenToast) => {
                o.toast.position.top = this.getToastTop(o.toast);
            });
        });
    }

    /**
     * Calculates the value of the "top" offset for this toast by adding up
     * the heights of the other toasts which are open above this one.
     */
    private getToastTop(toast: Toast): number {
        let index = this.getToastIndex(toast);

        return this.openToasts
                .filter((o: IOpenToast, i: number) => i < index)
                .reduce((top: number, o: IOpenToast) => {
                    return top += o.toast.getHeight() + this.verticalMargin;
                }, 0);
    }

    /**
     * Returns the index of the toast object in the openToasts array.
     */
    private getToastIndex(toast: Toast): number {
        return this.openToasts.map((o: IOpenToast) => o.toast).indexOf(toast);
    }
}
