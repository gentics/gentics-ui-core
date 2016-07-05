import {Component} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl} from '@angular/forms';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./input-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode, REACTIVE_FORM_DIRECTIVES]
})
export class InputDemo {
    componentSource: string = require('!!raw!../../../components/input/input.component.ts');

    name: string = 'Foo';
    addressForm: FormGroup = new FormGroup({
        name: new FormGroup({
            first: new FormControl('John'),
            last: new FormControl('Doe')
        }),
        address: new FormGroup({
            streetName: new FormControl('')
        })
    });
}
