import {Component} from '@angular/core';
import {DomSanitizationService, SafeHtml} from '@angular/platform-browser';
import {Button} from '../button/button.component';
import {IModalDialog, IDialogConfig} from './modal-interfaces';

/**
 * Internal. The default modal dialog component. Should not be directly used as a component in a view. It
 * should only every be instantiated by the ModalService.dialog() method.
 */
@Component({
    selector: 'gtx-modal-dialog',
    template: require('./modal-dialog.component.html'),
    directives: [Button]
})
export class ModalDialog implements IModalDialog {
    closeFn: (val: any) => void;
    cancelFn: (val?: any) => void;

    private config: IDialogConfig = <IDialogConfig> {};
    private safeBody: SafeHtml;

    constructor(private sanitizer: DomSanitizationService) {
    }

    setConfig(config: IDialogConfig): void {
        this.config = config;
        if (this.config.body) {
            this.safeBody = this.sanitizer.bypassSecurityTrustHtml(this.config.body);
        }
    }

    onClick(button: { returnValue: any, shouldReject: boolean }): void {
        if (button.shouldReject) {
            this.cancelFn(button.returnValue);
        } else {
            this.closeFn(button.returnValue);
        }
    }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }
}
