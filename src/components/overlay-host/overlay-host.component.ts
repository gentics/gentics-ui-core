import {Component, ViewContainerRef} from '@angular/core';
import {OverlayHostService} from './overlay-host.service';

/**
 * The OverlayHost is required to display any kind of overlay component such as a modal or
 * [toast notification](#/notification). It represents the location in the DOM into which new overlays
 * will be loaded. As such it should be at or close to the root of your app (i.e. a direct
 * child of you root App component).
 *
 * There are no attributes to configure nor events to listen to - all interaction with this
 * component happens via the `OverlayHostService`, which allows other components to grab a 
 * reference (`ViewContainerRef`) to the OverlayHost DOM element and then insert components or elements
 * at that location.
 *
 * ```html
 * <gtx-overlay-host></gtx-overlay-host>
 * ```
 */
@Component({
    selector: 'gtx-overlay-host',
    template: ``
})
export class OverlayHost {

    constructor(overlayHostService: OverlayHostService,
                viewContainerRef: ViewContainerRef) {
        overlayHostService.registerHostView(viewContainerRef);
    }
}
