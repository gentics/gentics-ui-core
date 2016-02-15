import {Component, Input} from 'angular2/core';

@Component({
    selector: 'gtx-input',
    template: require('./input.tpl.html')
})
export class InputField {

    @Input() label : string = '';
    @Input() placeholder : string = '';
    @Input() id : string = '';
    @Input() type : string = 'text';
    @Input() value : string = '';

}
