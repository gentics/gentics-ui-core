import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, NgZone} from '@angular/core';
import {Subscription} from 'rxjs';

import {PageDragDropFileHandler} from './page-drag-drop-file-handler.service';
import {clientReportsMimeTypesOnDrag, getDataTransfer, getTransferMimeTypes, transferHasFiles} from './drag-drop-utils';
import {matchesMimeType} from './matches-mime-type';


export interface IFileDropAreaOptions {
    /**
     * A string or list of mime types accepted by the drop area. Defaults to "*".
     * Some mime types will not be reported by the client, they get matched as "unknown/unknown".
     * @example
     *   { accept: ['image/*', '!image/gif'] }
     *   { accept: 'text/*' }
     *   { accept: ['video/*', 'unknown/*'] }
     */
    accept?: string | string[];

    /**
     * Set to true to prevent interaction with the drop area.
     */
    disabled?: boolean;

    /**
     * Allow multiple files to be dropped on the drop area. Defaults to true.
     */
    multiple?: boolean;
}

const defaultOptions: IFileDropAreaOptions = {
    accept: '*',
    disabled: false,
    multiple: true
};

export interface IDraggedFile {
    mimeType: string;
}

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
    public get draggedOver(): boolean {
        return this.isDraggedOn;
    }

    /**
     * Returns true if a file is dragged inside the current page / browser tab.
     */
    public get fileDraggedInPage(): boolean {
        return this.isDraggingFileInPage;
    }

    public get draggedFiles(): IDraggedFile[] {
        return this.draggedFilesList;
    }

    /**
     * Sets options of this drop area.
     */
    @Input('gtxFileDropArea') set options(options: IFileDropAreaOptions) {
        this._options = Object.assign({}, defaultOptions, options);
    }

    /**
     * Fires when a file or files are dragged over the drop area.
     */
    @Output() fileDragEnter = new EventEmitter<void>();

    /**
     * Fires when a file or files are dragged out of the drop area.
     */
    @Output() fileDragLeave = new EventEmitter<void>();

    /**
     * Fires when a file or files are dropped on the drop area.
     */
    @Output() fileDrop = new EventEmitter<File[]>();

    /**
     * Fires when a file or files which do not match the "accepted" option
     * are dropped on the drop area.
     */
    @Output() fileDropRejected = new EventEmitter<File[]>();

    /**
     * Fires when a file or files are dragged into the page.
     */
    @Output() pageDragEnter = new EventEmitter<void>();

    /**
     * Fires when a file or files is dragged out of the page.
     */
    @Output() pageDragLeave = new EventEmitter<void>();


    private draggedFilesList: IDraggedFile[] = [];
    private isDraggedOn: boolean = false;
    private isDraggingFileInPage: boolean = false;
    private acceptCurrentDrag: boolean = false;
    private _options = defaultOptions;
    private subscription: Subscription;


    constructor(private elementRef: ElementRef,
                private dragDropHandler: PageDragDropFileHandler,
                zone: NgZone) {

        this.subscription = dragDropHandler.dragStatusChanged.subscribe((dragStatus: boolean) => {
            zone.runGuarded(() => {
                let allowed = dragStatus && (this._options.accept === '*' || dragDropHandler.allDraggedFilesAre(this._options.accept));
                if (allowed != this.isDraggingFileInPage) {
                    if (this.isDraggingFileInPage = allowed) {
                        this.pageDragEnter.emit(undefined);
                    } else {
                        this.pageDragLeave.emit(undefined);
                    }
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
            this.acceptCurrentDrag = false;
            return;
        }

        // Check if the file is accepted with the current options
        let fileTypes = getTransferMimeTypes(transfer);
        if (this._options.disabled) {
            this.acceptCurrentDrag = false;
        } else if (this._options.multiple === false && transfer.items.length != 1) {
            this.acceptCurrentDrag = false;
        } else if (clientReportsMimeTypesOnDrag() && this._options.accept !== '*') {
            this.acceptCurrentDrag = fileTypes.every(type => matchesMimeType(type, this._options.accept)
            );
        } else {
            this.acceptCurrentDrag = true;
        }

        event.preventDefault();
        if (this.acceptCurrentDrag) {
            transfer.dropEffect = 'none';
            transfer.effectAllowed = 'none';
        } else {
            transfer.dropEffect = 'copy';
            this.isDraggedOn = true;
            this.draggedFilesList = fileTypes.map(type => ({ mimeType: type }));
            this.fileDragEnter.emit(undefined);
        }
    }

    @HostListener('dragover', ['$event'])
    private onDragOver(event: DragEvent): void {
        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) {
            return;
        }

        if (this.acceptCurrentDrag) {
            transfer.dropEffect = 'copy';
        } else {
            transfer.dropEffect = 'none';
            transfer.effectAllowed = 'none';
        }
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event'])
    private onDragLeave(event: DragEvent): void {
        if (event.currentTarget !== this.elementRef.nativeElement || !this.isDraggedOn) {
            return;
        }

        event.preventDefault();
        this.isDraggedOn = false;
        this.draggedFilesList = [];
        this.fileDragLeave.emit(undefined);
    }

    @HostListener('drop', ['$event'])
    private onDrop(event: DragEvent): void {
        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer) || this._options.disabled) {
            return;
        }

        let files = Array.from(transfer.files);
        let acceptedFiles: File[] = [];
        let rejectedFiles: File[] = [];

        // Check if the dropped files match the "accept" option
        if (this._options.accept !== '*') {
            for (let file of files) {
                if (matchesMimeType(file.type, this._options.accept)) {
                    acceptedFiles.push(file);
                } else {
                    rejectedFiles.push(file);
                }
            }
        } else {
            acceptedFiles = [...files];
        }

        this.isDraggedOn = false;
        this.draggedFilesList = [];
        event.preventDefault();
        transfer.dropEffect = 'copy';

        if (acceptedFiles.length > 0) {
            this.fileDrop.emit(acceptedFiles);
        }
        if (rejectedFiles.length > 0) {
            this.fileDropRejected.emit(rejectedFiles);
        }
    }
}
