import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES, Button} from '../../../index';

@Component({
    template: require('./button-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button]
})
export class ButtonDemo {
    
    constructor() {}
}
