import {Component} from '@angular/core';

@Component({
    template: require('./button-demo.tpl.html'),
    styles: [`gtx-button { margin-bottom: 10px; }`]
})
export class ButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/button/button.component.ts');

    clickCount: number = 0;
    constructor() {}
}
