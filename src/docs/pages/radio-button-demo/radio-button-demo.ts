import {Component} from '@angular/core';

@Component({
    template: require('./radio-button-demo.tpl.html')
})
export class RadioButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/radio-button/radio-button.component.ts');
}
