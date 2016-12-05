import {Component} from '@angular/core';

@Component({
    template: require('./textarea-demo.tpl.html')
})
export class TextareaDemo {
    componentSource: string = require('!!raw-loader!../../../components/textarea/textarea.component.ts');
}
