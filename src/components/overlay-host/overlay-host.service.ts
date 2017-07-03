import {Injectable, ViewContainerRef, Optional, SkipSelf} from '@angular/core';

/**
 * The OverlayHostService is used to get a reference to the ViewConainerRef of the
 * OverlayHost component, so that other components may insert components & elements
 * into the DOM at that point.
 */
@Injectable()
export class OverlayHostService {

    public hostView: ViewContainerRef;
    public promiseResolveFns: Function[] = [];

    /**
     * The OverlayHostService expects to be used by the OverlayHostComponent in the root module of the app.
     * In the case that the GenticsUICore is imported into a lazy-loaded child module, this service may be
     * instantiated a second time. This second instance will not have been registered with the OverlayHostComponent,
     * so we need to check out the injector tree and grab the hostView from the parent OverlayHostService.
     */
    constructor(@Optional() @SkipSelf() private parentInstance?: OverlayHostService) {
        if (parentInstance) {
            this.hostView = parentInstance.hostView;
            this.promiseResolveFns = parentInstance.promiseResolveFns;
        }
    }

    /**
     * Used to pass in the ViewContainerRef from the OverlayHost component.
     * Should not be used by any other component.
     */
    registerHostView(viewContainerRef: ViewContainerRef): void {
        this.hostView = viewContainerRef;
        if (0 < this.promiseResolveFns.length) {
            this.resolveHostView();
        }
    }

    /**
     * Returns a promise which resolves to the ViewContainerRef of the OverlayHost
     * component. This can then be used to insert components and elements into the
     * DOM at that point.
     */
    getHostView(): Promise<ViewContainerRef> {
        return new Promise((resolve: Function) => {
            this.promiseResolveFns.push(resolve);
            if (this.hostView !== undefined) {
                this.resolveHostView();
            }
        });
    }

    private resolveHostView(): void {
        this.promiseResolveFns.forEach(resolve => resolve(this.hostView));
        this.promiseResolveFns = [];
    }
}
