import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Modal, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {ModalService} from '../../../components/modal/modal.service';

@Component({
    template: require('./modal-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Modal, Button, Autodocs, DemoBlock, HighlightedCode],
    providers: [ModalService]
})
export class ModalDemo {
    componentSource: string = require('!!raw!../../../components/modal/modal.component.ts');

    showModal: boolean = false;
    showConfirm: boolean = false;
    confirmResult: boolean;
    padding: boolean = true;
    maxWidth: string = '400px';

    constructor(private modalService: ModalService) {}

    onConfirmClose(result: boolean): void {
        this.showConfirm = false;
        this.confirmResult = result;
    }

    showServiceModal(): void {
        this.modalService.dialog({
            title: 'Test Dialog!',
            body: 'This is <strong>good</strong>!',
            buttons: [
                { label: 'Okay', type: 'default', returnValue: true },
                { label: 'Cancel', type: 'secondary', returnValue: false }
            ]
        }, { padding: false })
            .then(result => console.log('result:', result))
            .catch(reason => console.log('rejected', reason));
    }
}
