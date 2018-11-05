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

    pattern: string = '^[0-9]+$';
    validationErrorTooltip: string = 'Input does not match the requirements';
}
