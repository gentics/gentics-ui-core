import {Component, DynamicComponentLoader, ComponentRef, ElementRef} from 'angular2/core';
import {Notification, INotificationOptions} from './notification.service';
import {Toast} from './toast.component';

@Component({
    selector: 'gtx-notification-host',
    template: ``
})
export class NotificationHost {

    constructor(private notification: Notification,
                private elementRef: ElementRef,
                private loader: DynamicComponentLoader) {}

    ngOnInit(): void {
        this.notification.open$
            .subscribe((options: INotificationOptions) => {
                this.createToast(options);
            });
    }

    createToast(options: INotificationOptions): void {
        this.loader.loadNextToLocation(Toast, this.elementRef)
            .then((componentRef: ComponentRef) => {
                let toast: Toast = componentRef.instance;
                toast.message = options.message;
                setTimeout(() => componentRef.dispose(), 3000);
            });
    }

}
