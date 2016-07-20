import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {ModalService} from '../../../components/modal/modal.service';
import {IModalDialog, IModalOptions} from '../../../components/modal/modal-interfaces';

@Component({
    template: require('./modal-service-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button, Autodocs, DemoBlock, HighlightedCode],
    providers: [ModalService]
})
export class ModalServiceDemo {
    componentSource: string = require('!!raw!../../../components/modal/modal.service');
    padding: boolean = true;
    maxWidth: string = '400px';
    closeOnOverlayClick: boolean = true;
    closeOnEscape: boolean = true;

    constructor(private modalService: ModalService) {}

     showBasicDialog(): void {
        this.modalService.dialog({
            title: 'A Basic Dialog',
            body: 'Are you <strong>sure</strong> you want to do the thing?',
            buttons: [
                { label: 'Cancel', type: 'secondary', flat: true, returnValue: false, shouldReject: true },
                { label: 'Okay', type: 'default', returnValue: true }
            ]
        })
            .then(dialog => dialog.open())
            .then(result => console.log('result:', result))
            .catch(reason => console.log('rejected', reason));
     }

    showDialogWithOptions(): void {
        const options: IModalOptions = {
            onOpen: (): void => console.log('Modal was opened.'),
            onClose: (): void => console.log('Modal was closed.'),
            padding: this.padding,
            maxWidth: this.maxWidth,
            closeOnOverlayClick: this.closeOnOverlayClick,
            closeOnEscape: this.closeOnEscape
        };

        this.modalService.dialog({
            title: 'Another Dialog',
            body: 'Are you <strong>sure</strong> you want to do the thing?',
            buttons: [
                { label: 'Cancel', type: 'secondary', flat: true, returnValue: false, shouldReject: true },
                { label: 'Okay', type: 'default', returnValue: true }
            ]
        }, options)
            .then(dialog => dialog.open())
            .then(result => console.log('result:', result))
            .catch(reason => console.log('rejected', reason));
    }

    showCustomModal(): void {
        this.modalService.fromComponent(MyModal)
            .then(modal => modal.open())
            .then(result => console.log('result:', result))
            .catch(reason => console.log('rejected', reason));
    }
}

@Component({
    selector: 'my-modal-component',
    template: `
        <div>
            <h1>A Custom Component</h1>
            <a (click)="closeFn('link was clicked')">Close me</a>
        </div>`
})
class MyModal implements IModalDialog {
    closeFn: (val: any) => void;
    cancelFn: (val?: any) => void;
    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }
    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }
}
