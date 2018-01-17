import {Component} from '@angular/core';
import {ModalService} from '../../../components/modal/modal.service';
import {IModalDialog, IModalOptions} from '../../../components/modal/modal-interfaces';

@Component({
    templateUrl: './modal-service-demo.tpl.html'
})
export class ModalServiceDemo {
    serviceSource: string = require('!!raw-loader!../../../components/modal/modal.service.ts');
    padding: boolean = true;
    width: string = '400px';
    closeOnOverlayClick: boolean = true;
    closeOnEscape: boolean = true;

    constructor(public modalService: ModalService) {}

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
            width: this.width,
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
        this.modalService.fromComponent(MyModal, {}, { greeting: 'Hello!' })
            .then(modal => modal.open())
            .then(result => console.log('result:', result))
            .catch(reason => console.log('rejected', reason));
    }
}

@Component({
    selector: 'my-modal-component',
    template: `
        <div class="modal-title">
            <h4>A Custom Component</h4>
        </div>
        <div class="modal-content">
            <h5>{{ greeting }}</h5>
        </div>
        <div class="modal-footer">
            <a (click)="closeFn('link was clicked')">Close me</a>
        </div>`
})
export class MyModal implements IModalDialog {
    closeFn: (val: any) => void;
    cancelFn: (val?: any) => void;

    greeting: string;

    constructor() {
        console.log('constructor()', this.greeting);
    }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }
    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }
}
