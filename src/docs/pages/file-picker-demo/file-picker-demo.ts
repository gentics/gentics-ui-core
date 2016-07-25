import {Component} from '@angular/core';
import {Button, FilePicker, GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./file-picker-demo.tpl.html'),
    directives: [FilePicker, Button, Autodocs, DemoBlock, HighlightedCode, GTX_FORM_DIRECTIVES],
    styles: [`gtx-file-picker { margin-bottom: 10px; }`]
})
export class FilePickerDemo {
    componentSource: string = require('!!raw!../../../components/file-picker/file-picker.component.ts');

    isDisabled = false;
    isMultiple = true;
    onlyImages = false;
}
