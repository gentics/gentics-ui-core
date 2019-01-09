import {
    AfterViewChecked,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    HostListener,
    OnDestroy,
    OnInit,
    Renderer2,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {IModalDialog, IModalOptions} from './modal-interfaces';
import {UserAgentRef} from './user-agent-ref';

const defaultOptions: IModalOptions = {
    modalBodyClass: 'modal-content',
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
export class DynamicModalWrapper implements OnInit, OnDestroy, AfterViewChecked {

    @ViewChild('portal', {read: ViewContainerRef}) portal: ViewContainerRef;

    isIE11: boolean;
    dismissFn: Function;

    modalElementsHeight: number = 0;
    visible: boolean = false;
    options: IModalOptions = defaultOptions;

    private subscriptions = new Subscription();
    private cmpRef: ComponentRef<IModalDialog>;
    private openTimer: number;
    private modalHeightEvents$: Subject<void> = new Subject();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private userAgent: UserAgentRef,
        private renderer: Renderer2) {}

    ngOnInit(): void {
        this.isIE11 = this.userAgent.isIE11;

        if (this.isIE11) {
            this.subscriptions.add(
                this.modalHeightEvents$.pipe(debounceTime(100)).subscribe(() => {
                    this.ie11FixContentHeight();
                })
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        clearTimeout(this.openTimer);
    }

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

    /**
     * IE11 Related fixes
     */

    /**
     * Listen for browsers size changes, to notify IE for modal height change
     */
    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (this.isIE11) {
            this.modalHeightEvents$.next();
        }
    }

    /**
     * Listen for content changes, to notify IE for modal height change
     */
    ngAfterViewChecked(): void {
        if (this.isIE11 && this.cmpRef) {
            // Trigger modalHeight event on view checks
            let modalElements = Array.from(this.cmpRef.location.nativeElement.children as HTMLElement[]);
            let currentModalElementsHeight = modalElements
            .filter( element => element.className != this.options.modalBodyClass )
            .map( element => {
                let styles = window.getComputedStyle(element);
                let margin = parseFloat(styles['marginTop']) +
                        parseFloat(styles['marginBottom']);
                return element.offsetHeight + margin;
            })
            .reduce((heights: number, height: number): number => heights + height);

            if (this.modalElementsHeight !== currentModalElementsHeight) {
                this.modalElementsHeight = currentModalElementsHeight;
                this.modalHeightEvents$.next();
            }
        }
    }

    /**
     * Fixes modal body height for IE11
     */
    ie11FixContentHeight(): void {
        if (this.isIE11 && this.cmpRef) {
            let injectedElement = this.cmpRef.location.nativeElement as HTMLElement;
            let modalBodyElement = injectedElement.getElementsByClassName(this.options.modalBodyClass)[0] as HTMLElement;

            this.renderer.setStyle(
                modalBodyElement,
                'max-height',
                `calc(70vh - ${this.modalElementsHeight}px)`
            );
        }
    }
}
