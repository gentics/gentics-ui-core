import {Component} from '@angular/core';

@Component({
    templateUrl: './button-demo.tpl.html',
    styles: [`gtx-button { margin-bottom: 10px; }`]
})
export class ButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/button/button.component.ts');
    buttonIsDisabled: boolean = false;
    clickCount: number = 0;
    constructor() {}
}
