import {Component} from 'angular2/core';
import {Modal, Button} from '../../../index';

@Component({
    template: require('./modal-demo.tpl.html'),
    directives: [Modal, Button]
})
export class ModalDemo { 
}
