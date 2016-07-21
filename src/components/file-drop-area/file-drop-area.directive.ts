import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, NgZone} from '@angular/core';
import {Subscription} from 'rxjs';

import {PageDragDropFileHandler} from './page-drag-drop-file-handler.service';
import {getDataTransfer, transferHasFiles} from './drag-drop-utils';


/**
 * File upload area that accepts files via drag and drop.
 *
 * ```html
 * <gtx-file-drop-area (fileDrop)="files = $event">Upload files via drag & drop</gtx-file-drop-area>
 * <div gtx-file-drop-area (fileDrop)="files = $event">Upload files via drag & drop</div>
 * ```
 */
@Directive({
    selector: 'gtx-file-drop-area, [gtxFileDropArea]',
    exportAs: 'gtxFileDropArea'
})
export class FileDropArea implements OnDestroy {

    /**
     * Returns true if a file is dragged on the drop area.
     */
    public get hovered(): boolean {
        return this.isDraggedOn;
    }

    /**
     * Returns true if a file is dragged inside the current browser tab.
     */
    public get fileDraggedInTab(): boolean {
        return this.isDraggingFileInTab;
    }

    /**
     * Fires when a file or files are dragged over the drop area
     */
    @Output() fileDragEnter = new EventEmitter<void>();

    /**
     * Fires when a file or files are dragged out of the drop area
     */
    @Output() fileDragLeave = new EventEmitter<void>();

    /**
     * Fires when a file or files are dropped on the drop area
     */
    @Output() fileDrop = new EventEmitter<File[]>();

    /**
     * Fires when a file or files are dragged into the tab
     */
    @Output() tabDragEnter = new EventEmitter<void>();

    /**
     * Fires when a file or files is dragged out of the tab
     */
    @Output() tabDragLeave = new EventEmitter<void>();



    private subscription: Subscription;
    private isDraggedOn: boolean = false;
    private isDraggingFileInTab: boolean = false;


    constructor(private elementRef: ElementRef,
                tab: PageDragDropFileHandler,
                zone: NgZone) {

        this.subscription = tab.dragStatusChanged.subscribe((dragStatus: boolean) => {
            zone.runGuarded(() => {
                this.isDraggingFileInTab = dragStatus;
                if (dragStatus) {
                    this.tabDragEnter.emit(undefined);
                } else {
                    this.tabDragLeave.emit(undefined);
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('dragenter', ['$event'])
    private onDragEnter(event: DragEvent): void {
        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) {
            return;
        }

        transfer.dropEffect = 'copy';
        event.preventDefault();
        this.isDraggedOn = true;
        this.fileDragEnter.emit(undefined);
    }

    @HostListener('dragover', ['$event'])
    private onDragOver(event: DragEvent): void {
        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) {
            return;
        }

        transfer.dropEffect = 'copy';
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event'])
    private onDragLeave(event: DragEvent): void {
        if (event.currentTarget !== this.elementRef.nativeElement) {
            return;
        }

        event.preventDefault();
        this.isDraggedOn = false;
        this.fileDragLeave.emit(undefined);
    }

    @HostListener('drop', ['$event'])
    private onDrop(event: DragEvent): void {
        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) { return; }

        event.preventDefault();
        this.isDraggedOn = false;
        if (this.isDraggingFileInTab) {
            this.isDraggingFileInTab = false;
            this.tabDragLeave.emit(undefined);
        }

        this.fileDrop.emit(Array.from(transfer.files));
    }
}
