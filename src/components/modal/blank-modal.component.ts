import { Component} from '@angular/core';
import {IModalDialog} from './modal-interfaces';

/**
 * Internal. Used to house the contents of the ModalService.fromElement() method.
 */
@Component({
    selector: 'gtx-blank-modal',
    template: ``
})
export class BlankModal implements IModalDialog {
    closeFn: (val: any) => void;
    cancelFn: (val?: any) => void;

    constructor() { }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }

}
