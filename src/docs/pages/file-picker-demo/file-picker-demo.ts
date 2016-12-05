import {Component} from '@angular/core';

@Component({
    template: require('./file-picker-demo.tpl.html'),
    styles: [`gtx-file-picker { margin-bottom: 10px; }`]
})
export class FilePickerDemo {
    componentSource: string = require('!!raw-loader!../../../components/file-picker/file-picker.component.ts');

    isDisabled = false;
    isMultiple = true;
    onlyImages = false;
    selectedFiles: File[] = [];

    onFilesSelected(files: File[]): void {
        console.log('onFilesSelected: ' + JSON.stringify(files.map(f => ({name: f.name, type: f.type}))));
        this.selectedFiles = [...files];
    }
}
