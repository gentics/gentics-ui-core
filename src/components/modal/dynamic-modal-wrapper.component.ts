import {
    Component,
    ComponentRef,
    ComponentFactoryResolver,
    HostListener,
    ViewContainerRef,
    ViewChild,
    Type
} from '@angular/core';
import {IModalOptions, IModalDialog} from './modal-interfaces';

const defaultOptions: IModalOptions = {
    padding: true,
    width: null,
    closeOnEscape: true,
    closeOnOverlayClick: true
};

/**
 * This is an internal component which is responsible for creating the modal dialog window and overlay.
 */
@Component({
    selector: 'gtx-dynamic-modal',
    templateUrl: './dynamic-modal-wrapper.tpl.html'
})
export class DynamicModalWrapper {
    @ViewChild('portal', {read: ViewContainerRef}) portal: ViewContainerRef;

    dismissFn: Function;

    visible: boolean = false;
    options: IModalOptions = defaultOptions;
    private cmpRef: ComponentRef<IModalDialog>;
    private openTimer: number;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    setOptions(options: IModalOptions): void {
        this.options = Object.assign({}, defaultOptions, options);
    }

    /**
     * Inject the component which will appear within the modal.
     */
    injectContent(component: Type<IModalDialog>): ComponentRef<IModalDialog> {
        let factory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.cmpRef = this.portal.createComponent(factory);
        return this.cmpRef;
    }

    /**
     * Display the modal
     */
    open(): void {
        clearTimeout(this.openTimer);
        this.openTimer = setTimeout(() => this.visible = true, 50);
    }

    /**
     * Programatically force the modal to close and resolve with the value passed.
     */
    forceClose(val?: any): void {
        this.cmpRef.instance.closeFn(val);
    }

    /**
     * Close the modal and call the cancelFn of the embedded component.
     */
    cancel(): void {
        clearTimeout(this.openTimer);
        this.visible = false;
        this.cmpRef.instance.cancelFn();
        this.cmpRef.destroy();
    }

    overlayClick(): void {
        if (this.options.closeOnOverlayClick) {
            this.cancel();
        }
    }

    @HostListener('document:keydown', ['$event'])
    keyHandler(e: KeyboardEvent): void {
        if (e.which === 27 && this.options.closeOnEscape) {
            this.cancel();
        }
    }
}
