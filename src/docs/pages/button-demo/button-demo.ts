import {Component} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    templateUrl: './button-demo.tpl.html',
    styles: [`gtx-button { margin-bottom: 10px; }`]
})
export class ButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/button/button.component.ts');
    buttonIsDisabled: boolean = false;
    readonly: boolean = false;
    clickCount: number = 0;
    formResult: any;
    demoForm = new FormGroup({
        firstName: new FormControl('John'),
        lastName: new FormControl('Doe')
    });
}
