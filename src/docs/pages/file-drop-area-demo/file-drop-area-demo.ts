import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {GTX_FORM_DIRECTIVES, Modal, Button, FileDropArea, PreventFileDrop} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {SortableList, ISortableEvent} from '../../../components/sortable-list/sortable-list.component';

@Component({
    template: require('./file-drop-area-demo.tpl.html'),
    directives: [
        FileDropArea,
        SortableList,
        Autodocs,
        DemoBlock,
        HighlightedCode,
        PreventFileDrop,
        GTX_FORM_DIRECTIVES,
        ROUTER_DIRECTIVES
    ]
})
export class FileDropAreaDemo {
    componentSource: string = require('!!raw!../../../components/file-drop-area/file-drop-area.directive.ts');

    draggingFileOnThis = false;
    droppedFiles: File[] = [];
    reorderableFiles: File[] = [];
    preventGlobal = true;
    preventLocal = true;

    onDropFiles(files: File[]): void {
        this.draggingFileOnThis = false;
        this.droppedFiles.push(...files);
    }

    reorderList(event: ISortableEvent): void {
        this.reorderableFiles = event.sort(this.reorderableFiles);
    }

    addFilesToReorderableList(files: File[]): void {
        this.reorderableFiles.push(...files);
    }
}
