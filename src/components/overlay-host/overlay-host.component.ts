import {Component, DynamicComponentLoader, ComponentRef, ElementRef} from 'angular2/core';
import {Notification} from './../notification/notification.service.ts';

/**
 * The OverlayHost is required to display any kind of overlay component such as a modal or
 * toast notification. It represents the location in the DOM into which new overlays 
 * will be loaded. As such it should be at or close to the root of your app (i.e. a direct 
 * child of you root App component).
 *
 * There are no attributes to configure nor events to listen to - all interaction with this
 * component happens though the services that register with it.
 */
@Component({
    selector: 'gtx-overlay-host',
    template: ``
})
export class OverlayHost {

    constructor(private notification: Notification,
                private elementRef: ElementRef) {
        notification.registerHostElement(elementRef);
    }

    /**
     * Dispose of all open toasts and clear the openToasts array.
     */
    ngOnDestroy(): void {
        this.notification.destroyAllToasts();
    }

}
