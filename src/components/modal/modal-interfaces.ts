/**
 * Config options used when invoking ModalService.dialog()
 */
export interface IDialogConfig {
    title: string;
    body?: string;
    buttons: {
        label: string;
        type?: 'default' | 'secondary' | 'success'| 'warning' | 'alert';
        flat?: boolean;
        // If specified, will be returned as the
        // value of the resolved promise (or the reason if rejected).
        returnValue?: any;
        // If true, clicking the button will cause
        // the promise to reject rather than resolve
        shouldReject?: boolean;
    }[];
}

/**
 * Settings which determine the look and behaviour of the modal wrapper window itself
 */
export interface IModalOptions {
    onOpen?: Function;
    onClose?: Function;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    width?: string;
    padding?: boolean;
}

/**
 * The return value from the ModalService public methods.
 */
export interface IModalInstance {
    instance: IModalDialog;
    element: HTMLElement;
    open: () => Promise<any>;
}

/**
 * Interface which must be implemented by any component which is being displayed
 * by the DynamicModalWrapper.
 */
export interface IModalDialog {
    /** Can be called to close the modal and return a value. */
    closeFn: (val: any) => void;

    /** Can be called to close the modal by cancelling. */
    cancelFn: (val?: any) => void;

    /** Is passed a callback which can be called by the modal to close and return a value. */
    registerCloseFn: (close: (val: any) => void) => void;

    /** Is passed a callback which can be called by the modal to cancel. */
    registerCancelFn: (cancel: (val: any) => void) => void;

    /** Is passed a callback which can be called by the modal to signal an error and close. */
    registerErrorFn?: (errorFn: (err: Error) => void) => void;
}
