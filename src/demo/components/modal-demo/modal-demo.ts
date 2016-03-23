import {Component} from 'angular2/core';
import {Modal} from '../../../index';

@Component({
    template: require('./modal-demo.tpl.html'),
    directives: [Modal]
})
export class ModalDemo {
}
