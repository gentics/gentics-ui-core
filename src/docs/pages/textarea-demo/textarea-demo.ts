import {Component} from '@angular/core';

@Component({
    templateUrl: './textarea-demo.tpl.html'
})
export class TextareaDemo {
    componentSource: string = require('!!raw-loader!../../../components/textarea/textarea.component.ts');
    readonly: boolean;
    required: boolean;
    disabled: boolean;
    message: string;

    onTextChange(event: any) {
    }
}
