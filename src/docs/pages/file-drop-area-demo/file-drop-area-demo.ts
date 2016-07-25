import {Component, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Observable, Subscription} from 'rxjs';

import {GTX_FORM_DIRECTIVES, Modal, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {SortableList, ISortableEvent} from '../../../components/sortable-list/sortable-list.component';
import {PageDragDropFileHandler, FileDropArea, PreventFileDrop} from '../../../index';

@Component({
    template: require('./file-drop-area-demo.tpl.html'),
    directives: [
        FileDropArea,
        PreventFileDrop,
        SortableList,
        Autodocs,
        DemoBlock,
        Button,
        HighlightedCode,
        GTX_FORM_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [PageDragDropFileHandler]
})
export class FileDropAreaDemo implements OnDestroy {
    componentSource: string = require('!!raw!../../../components/file-drop-area/file-drop-area.directive.ts');

    draggingFileOnThis = false;
    droppedFiles: File[] = [];
    droppedImages: File[] = [];
    droppedTextFiles: File[] = [];
    reorderableFiles: File[] = [];
    isDisabled = true;
    preventGlobal = true;
    preventLocal = false;
    serviceEvents: string[] = [];
    subscription: Subscription;

    constructor(private dragdrop: PageDragDropFileHandler) {
        this.subscription = Observable.merge(
                dragdrop.draggedIn.mapTo('draggedIn'),
                dragdrop.draggedOut.mapTo('draggedOut'),
                dragdrop.dropped.mapTo('dropped'),
                dragdrop.dragStatusChanged.map($event => `dragStatusChanged ($event = ${$event})`)
            ).subscribe(eventText => {
                this.serviceEvents = this.serviceEvents.concat(eventText);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

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
