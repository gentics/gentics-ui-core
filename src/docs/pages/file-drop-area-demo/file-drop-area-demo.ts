import {Component, OnDestroy} from '@angular/core';
import {ISortableEvent, PageFileDragHandler} from 'gentics-ui-core';
import {merge as observableMerge, Subscription} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';

@Component({
    templateUrl: './file-drop-area-demo.tpl.html'
})
export class FileDropAreaDemo implements OnDestroy {
    directiveSource: string = require('!!raw-loader!../../../components/file-drop-area/file-drop-area.directive.ts');

    draggingFileOnThis = false;
    droppedFiles: File[] = [];
    droppedFilesA: any;
    droppedFilesC: any;
    draggingFileOnPage: boolean;
    droppedImages: File[] = [];
    droppedTextFiles: File[] = [];
    rejectedImages: File[] = [];
    rejectedTextFiles: File[] = [];
    reorderableFiles: File[] = [];
    isDisabled = true;
    pageDragHovered: boolean;
    preventOnPage = true;
    preventLocal = false;
    serviceEvents: string[] = [];
    subscription: Subscription;

    constructor(public dragdrop: PageFileDragHandler) {
        this.subscription = observableMerge(
                dragdrop.dragEnter.pipe(mapTo('dragEnter')),
                dragdrop.dragStop.pipe(mapTo('dragStop')),
                dragdrop.filesDragged$.pipe(map($event => `filesDragged$ ($event = ${JSON.stringify($event)})`))
            ).subscribe(eventText => {
                let d = new Date();
                let time = d.toTimeString().split(' ')[0] + (d.getMilliseconds() / 1000).toFixed(3).substr(1);
                this.serviceEvents = this.serviceEvents.concat(`${time}: ${eventText}`);
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
