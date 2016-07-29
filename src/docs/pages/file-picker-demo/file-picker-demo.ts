import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Button, FilePicker, FileDropArea, PreventFileDrop, GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';


@Component({
    template: require('./file-picker-demo.tpl.html'),
    directives: [
        FilePicker, FileDropArea, PreventFileDrop, Button,
        Autodocs, DemoBlock, HighlightedCode,
        GTX_FORM_DIRECTIVES, ROUTER_DIRECTIVES
    ],
    styles: [`gtx-file-picker { margin-bottom: 10px; }`]
})
export class FilePickerDemo {
    componentSource: string = require('!!raw!../../../components/file-picker/file-picker.component.ts');

    isDisabled = false;
    isMultiple = true;
    onlyImages = false;
    selectedFiles: File[] = [];

    onFilesSelected(files: File[]): void {
        console.log('onFilesSelected: ' + JSON.stringify(files.map(f => ({name: f.name, type: f.type}))));
        this.selectedFiles = [...files];
    }
}
