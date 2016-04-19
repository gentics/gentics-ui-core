import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES, Modal, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./modal-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Modal, Button, Autodocs, DemoBlock, HighlightedCode]
})
export class ModalDemo {
    componentSource: string = require('!!raw!../../../components/modal/modal.component.ts');

    showModal: boolean = false;
    showConfirm: boolean = false;
    confirmResult: boolean;
    padding: boolean = true;
    maxWidth: string = '400px';

    onConfirmClose(result: boolean): void {
        this.showConfirm = false;
        this.confirmResult = result;
    }
}
