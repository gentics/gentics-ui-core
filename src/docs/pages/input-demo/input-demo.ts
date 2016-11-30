import {Component} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    template: require('./input-demo.tpl.html')
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
