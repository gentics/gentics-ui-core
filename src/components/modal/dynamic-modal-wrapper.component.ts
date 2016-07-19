import {
    Component,
    ComponentFactory,
    ComponentRef,
    ComponentResolver,
    HostListener,
    ViewContainerRef,
    ViewChild
} from '@angular/core';
import {Type} from '@angular/core/src/facade/lang';
import {IModalOptions, IModalDialog} from './modal-interfaces';

const defaultOptions: IModalOptions = {
    padding: true,
    maxWidth: '100%',
    closeOnEscape: true,
    closeOnOverlayClick: true
};

/**
 * This is an internal component which is responsible for creating the modal dialog window and overlay.
 */
@Component({
    selector: 'gtx-dynamic-modal',
    template: require('./dynamic-modal-wrapper.tpl.html')
})
export class DynamicModalWrapper {
    @ViewChild('portal', {read: ViewContainerRef}) portal: ViewContainerRef;

    dismissFn: Function;

    private cmpRef: ComponentRef<IModalDialog>;
    private visible: boolean = false;
    private options: IModalOptions = defaultOptions;

    constructor(private resolver: ComponentResolver) {}

    setOptions(options: IModalOptions): void {
        this.options = Object.assign(defaultOptions, options);
    }

    /**
     * Inject the component which will appear within the modal.
     */
    injectContent(component: Type): Promise<ComponentRef<any>> {
        return this.resolver.resolveComponent(component)
            .then((factory: ComponentFactory<IModalDialog>) => {
                this.cmpRef = this.portal.createComponent(factory);
                return this.cmpRef;
            });
    }

    /**
     * Display the modal
     */
    open(): void {
        this.visible = true;
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
        this.visible = false;
        this.cmpRef.instance.cancelFn();
        setTimeout(() => {
            this.cmpRef.destroy();
        }, 500);
    }

    private overlayClick(): void {
        if (this.options.closeOnOverlayClick) {
            this.cancel();
        }
    }

    @HostListener('document:keydown', ['$event'])
    private keyHandler(e: KeyboardEvent): void {
        if (e.which === 27 && this.options.closeOnEscape) {
            this.cancel();
        }
    }
}
