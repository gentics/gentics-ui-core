import {
    ComponentFactory,
    ComponentRef,
    ComponentResolver,
    ElementRef,
    Injectable,
    ViewContainerRef
} from '@angular/core';
import {Type} from '@angular/core/src/facade/lang';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {DynamicModalWrapper} from './dynamic-modal-wrapper.component';
import {ModalDialog} from './modal-dialog.component';
import {BlankModal} from './blank-modal.component';
import {IModalInstance, IDialogConfig, IModalDialog, IModalOptions} from './modal-interfaces';

/**
 * A promise-based service for creating modal windows and dialogs.
 *
 * ##### Return Values
 * All the public methods return the `IModalInstance` object:
 *
 * ```
 * interface IModalInstance {
 *     instance: IModalDialog;
 *     element: HTMLElement;
 *     open: () => Promise<any>;
 * }
 * ```
 * Calling the `open()` method returns a promise which will be resolved or rejected when the modal is dismissed or
 * cancelled.
 *
 * ##### `.dialog()`
 * To create a basic dialog modal, use the `.dialog()` method. This accepts an `IDialogConfig` object:
 *
 * ```TypeScript
 * interface IDialogConfig {
 *   title: string;
 *   body?: string;
 *   buttons: {
 *       label: string;
 *       type?: 'default' | 'secondary' | 'success'| 'warning' | 'alert';
 *       flat?: boolean;
 *       // If specified, will be returned as the
 *       // value of the resolved promise (or the reason if rejected).
 *       returnValue?: any;
 *       // If true, clicking the button will cause
 *       // the promise to reject rather than resolve
 *       shouldReject?: boolean;
 * }[];
 * ```
 *
 * Example:
 * ```TypeScript
 * modalService.dialog({
 *   title: 'Are you sure?',
 *   body: 'Do you <em>really</em> want to delete this thing?',
 *   buttons: [
 *     { label: 'Delete', type: 'alert', returnValue: true },
 *     { label: 'Cancel', type: 'secondary', shouldReject: true }
 *   ]
 * }).then(modal => modal.open())
 *   .then(result => console.log('deleting...'))
 *   .catch(() => console.log('cancelled');
 * ```
 *
 * ##### `.fromComponent()`
 * For more complex modals, a component can be passed to the `.fromComponent()` method which will then be
 * placed inside a modal window. The component must implement the IModalDialog interface, which allows the
 * ModalService to hook into a `closeFn` & `cancelFn` so it knows then to resolve / reject the promise.
 *
 * Example:
 * ```TypeScript
 * @Component({
 *   selector: 'my-modal-form',
 *   template: '...' // some big form
 * })
 * export class MyModalForm implements IModalDialog {
 *   // IModalDialog interface members
 *   closeFn: (val: any) => void;
 *   cancelFn: (val?: any) => void;
 *   registerCloseFn(close: (val: any) => void): void {
 *       this.closeFn = close;
 *   }
 *   registerCancelFn(cancel: (val?: any) => void): void {
 *       this.cancelFn = cancel;
 *   }
 *
 *   // Bound to the form's submit event.
 *   onSubmitClick() : void {
 *      this.closeFn(this.form.value);
 *   }
 *
 *   // Bound to the "cancel" button in the template
 *   onCancelClick(): void {
 *      this.cancelFn();
 *   }
 * }
 * ```
 * The above component could then be used as follows:
 * ```TypeScript
 * modalService.fromComponent(MyModalForm)
 *   .then(modal => modal.open())
 *   .then(result => console.log(result));
 * ```
 *
 * ##### Modal Options
 * All public methods take an optional options parameter to describe the behavior and appearance of the modal window
 * itself:
 * ```TypeScript
 * interface IModalOptions {
 *     onOpen?: Function;
 *     onClose?: Function;
 *     closeOnOverlayClick?: boolean;
 *     closeOnEscape?: boolean;
 *     maxWidth?: string;
 *     padding?: boolean;
 * }
 * ```
 */
@Injectable()
export class ModalService {

    private hostViewContainer: ViewContainerRef;

    constructor(private componentResolver: ComponentResolver,
                overlayHostService: OverlayHostService) {
        overlayHostService.getHostView().then(view => {
            this.hostViewContainer = view;
        });
    }

    /**
     * Create a new modal instance containing the specified component.
     */
    public fromComponent(component: Type, options?: IModalOptions): Promise<IModalInstance> {
        return this.wrapComponentInModal(component, options);
    }

    /**
     * Create a new modal by appending the elementRef to a blank modal window. Primarily used internally
     * for the implementation of the declarative [Modal](#/modal) component.
     */
    public fromElement(elementRef: ElementRef, options?: IModalOptions): Promise<IModalInstance> {
        return this.wrapComponentInModal(BlankModal, options)
            .then(modal => {
                modal.element.appendChild(elementRef.nativeElement);
                return modal;
            });
    }

    /**
     * Creates and displays a standard modal dialog.
     */
    public dialog(config: IDialogConfig, options?: IModalOptions): Promise<IModalInstance> {
        return this.wrapComponentInModal(ModalDialog, options)
            .then(modal => {
                (<ModalDialog> modal.instance).setConfig(config);
                return modal;
            });
    }

    private wrapComponentInModal(component: Type, options?: IModalOptions): Promise<IModalInstance> {
        return this.createModalWrapper(options)
            .then(modalWrapper => {
                return modalWrapper.injectContent(component)
                    .then(componentRef => {
                        const dialog: IModalDialog = componentRef.instance;
                        this.checkModalDialogInterface(dialog);
                        return {
                            instance: dialog,
                            element: componentRef.location.nativeElement,
                            open: (): Promise<any> => {
                                this.invokeOnOpenCallback(options);
                                modalWrapper.open();
                                return this.createPromiseFromDialog(modalWrapper, dialog);
                            }
                        };
                    });
            });
    }

    /**
     * Ensure that the component passed in implements IModalDialog.
     */
    private checkModalDialogInterface(dialog: IModalDialog): void {
        const conforms = typeof dialog.registerCancelFn === 'function' && typeof dialog.registerCloseFn === 'function';
        if (!conforms) {
            throw new Error('ModalService#wrapComponentInModal(): Component must implement IModalDialog.');
        }
    }

    /**
     * Creates the DynamicModalWrapper in place in the DOM and returns a reference to the
     * created component.
     */
    private createModalWrapper(options?: IModalOptions): Promise<DynamicModalWrapper> {
        return this.componentResolver.resolveComponent(DynamicModalWrapper)
            .then((modalFactory: ComponentFactory<DynamicModalWrapper>) => {
                const ref = this.hostViewContainer.createComponent(modalFactory);
                return this.getConfiguredModalWrapper(ref, options);
            });
    }

    /**
     * Decorate the ModalWrapper instance with the dismissFn and return that instance.
     */
    private getConfiguredModalWrapper(wrapperComponentRef: ComponentRef<DynamicModalWrapper>,
                                      options?: IModalOptions): DynamicModalWrapper {
        let modalWrapper = wrapperComponentRef.instance;
        modalWrapper.dismissFn = () => {
            this.invokeOnCloseCallback(options);
            wrapperComponentRef.destroy();
        };
        modalWrapper.setOptions(options);
        return modalWrapper;
    }

    /**
     * Returns a promise which is bound to the closeFn and cancelFn of the dialog instance,
     * and will be resolved/rejected when either of those methods are invoked.
     */
    private createPromiseFromDialog(modalWrapper: DynamicModalWrapper, dialog: IModalDialog): Promise<any> {
        return new Promise((resolve, reject) => {
            dialog.registerCloseFn((value: any) => {
                modalWrapper.dismissFn();
                resolve(value);
            });

            dialog.registerCancelFn((value: any) => {
                reject(value);
                modalWrapper.dismissFn();
            });
        });
    }

    private invokeOnOpenCallback(options: IModalOptions): void {
        if (options && options.onOpen && typeof options.onOpen === 'function') {
            options.onOpen();
        }
    }

    private invokeOnCloseCallback(options: IModalOptions): void {
        if (options && options.onClose && typeof options.onClose === 'function') {
            options.onClose();
        }
    }
}
