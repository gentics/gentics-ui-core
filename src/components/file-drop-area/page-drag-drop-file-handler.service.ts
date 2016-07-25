import {EventEmitter, Inject, Injectable, Input, OnInit, OnDestroy, Output, OpaqueToken, Optional} from '@angular/core';

import {getDataTransfer, getEventTarget, getTransferMimeTypes, transferHasFiles} from './drag-drop-utils';
import {matchesMimeType} from './matches-mime-type';

/**
 * A token that can be used to inject a mock into the service
 */
export const PAGE_FILE_DRAG_EVENT_TARGET = new OpaqueToken('PAGE_FILE_DRAG_EVENT_TARGET');


const noopEventTarget: EventTarget = {
    addEventListener(): void { },
    dispatchEvent(): boolean { return false; },
    removeEventListener(): void { }
};

/**
 * A helper service that listens for dragenter/dragleave/drop events on the window
 * and tracks when files are dragged into or out of the active tab.
 *
 * When files are accidentally dropped on the tab outside of a drop zone, the drop
 * can be cancelled to prevent the browser from opening/downloading the file.
 * See {@link gtxPreventFileDrop} for details.
 */
@Injectable()
export class PageDragDropFileHandler {

    /**
     * Fires when a file is dragged into the current tab, dragged out or dropped.
     */
    @Output() dragStatusChanged = new EventEmitter<boolean>();

    /**
     * Fires when a file is dragged into the current tab.
     */
    @Output() draggedIn = new EventEmitter<void>();

    /**
     * Fires when a file is dragged out of the current tab.
     */
    @Output() draggedOut = new EventEmitter<void>();

    /**
     * Fires when a file is dragged out of the current tab.
     */
    @Output() dropped = new EventEmitter<void>();

    /**
     * Fires when a drop event is prevented.
     */
    @Output() dropPrevented = new EventEmitter<void>();


    private draggingOverPage = false;
    private draggedFileTypes: { mimeType: string }[] = [];
    private enterLeaveCounter = 0;
    private enteredElements = new WeakSet<Element>();
    private eventTarget: EventTarget;
    private eventsBound = false;
    private componentsWantingToPreventFileDrop = new Set<any>();
    private isAccidentalFileDropPrevented = false;

    /**
     * Returns true if a file is dragged over the current page/tab.
     * @example
     *   class Component {
     *     constructor(private dragdrop: PageDragDropFileHandler) {}
     *   }
     *
     *   <ul *ngIf="dragdrop.fileDraggedInPage"> ... </ul>
     */
    public get fileDraggedInPage(): boolean {
        return this.draggingOverPage;
    }

    /**
     * Returns true if files are dragged over the current tab and any file matches the specified mime type.
     * @example
     *   class Component {
     *     constructor(private dragdrop: PageDragDropFileHandler) {}
     *   }
     *
     *   <ul *ngIf="dragdrop.anyDraggedFileIs('image/*')"> ... </ul>
     */
    public anyDraggedFileIs(allowedTypes: string | string[]): boolean {
        if (!this.draggingOverPage) { return false; }
        return this.draggedFileTypes.some(file => matchesMimeType(file.mimeType, allowedTypes));
    }

    /**
     * Returns true if files are dragged over the current page and all files match the specified mime type.
     * @example
     *   class Component {
     *     constructor(private dragdrop: PageDragDropFileHandler) {}
     *   }
     *
     *   <ul *ngIf="dragdrop.allDraggedFilesAre('image/*')"> ... </ul>
     */
    public allDraggedFilesAre(allowedTypes: string | string[]): boolean {
        if (!this.draggingOverPage) { return false; }
        return this.draggedFileTypes.every(file => matchesMimeType(file.mimeType, allowedTypes));
    }


    constructor(@Optional() @Inject(PAGE_FILE_DRAG_EVENT_TARGET) eventTarget: EventTarget) {
        if (eventTarget) {
            this.eventTarget = eventTarget;
        } else if (typeof window === 'object') {
            this.eventTarget = window;
        } else {
            this.eventTarget = noopEventTarget;
        }

        this.bindEvents();
    }

    /** @internal */
    bindEvents(): void {
        if (this.eventsBound) { return; }
        const bind = this.eventTarget.addEventListener.bind(this.eventTarget);
        bind('dragenter', this.fileDraggedIntoElement, true);
        bind('dragleave', this.fileDraggedOutOfElement, true);
        bind('drop', this.fileDroppedOnElement, true);
        bind('mouseenter', this.detectUntrackedDrop, true);
        bind('dragenter', this.preventAccidentalDrop, false);
        bind('dragover', this.preventAccidentalDrop, false);
        bind('drop', this.preventAccidentalDrop, false);
        this.eventsBound = true;
    }

    /** @internal */
    unbindEvents(): void {
        const unbind = this.eventTarget.removeEventListener.bind(this.eventTarget);
        unbind('dragenter', this.fileDraggedIntoElement, true);
        unbind('dragleave', this.fileDraggedOutOfElement, true);
        unbind('drop', this.fileDroppedOnElement, true);
        unbind('mouseenter', this.detectUntrackedDrop, true);
        unbind('dragenter', this.preventAccidentalDrop, false);
        unbind('dragover', this.preventAccidentalDrop, false);
        unbind('drop', this.preventAccidentalDrop, false);
        this.eventsBound = false;
    }


    /** @internal */
    preventFileDropOnPageFor(directive: any, prevent: boolean): void {
        if (prevent) {
            this.componentsWantingToPreventFileDrop.add(directive);
        } else {
            this.componentsWantingToPreventFileDrop.delete(directive);
        }
        this.isAccidentalFileDropPrevented = this.componentsWantingToPreventFileDrop.size > 0;
    }

    private fileDraggedIntoElement = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (this.enteredElements.has(element)) { return; }

        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) { return; }

        this.enterLeaveCounter += 1;
        this.enteredElements.add(element);

        if (this.enterLeaveCounter === 1) {
            this.draggingOverPage = true;
            this.draggedFileTypes = getTransferMimeTypes(transfer).map(mimeType => ({ mimeType }));

            this.dragStatusChanged.emit(true);
            this.draggedIn.emit(undefined);
        }
    }

    private fileDraggedOutOfElement = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (!transferHasFiles(getDataTransfer(event)) || !this.enteredElements.delete(element)) {
            return;
        }

        this.enterLeaveCounter -= 1;

        if (this.enterLeaveCounter === 0) {
            this.draggingOverPage = false;
            this.draggedFileTypes = [];

            this.dragStatusChanged.emit(false);
            this.draggedOut.emit(undefined);
        }
    }

    private fileDroppedOnElement = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (!transferHasFiles(getDataTransfer(event)) || !this.enteredElements.delete(element)) {
            return;
        }

        this.enterLeaveCounter = 0;
        this.enteredElements = new WeakSet();

        if (this.draggingOverPage) {
            this.draggingOverPage = false;
            this.draggedFileTypes = [];

            this.dragStatusChanged.emit(false);
            this.dropped.emit(undefined);
        }
    }

    private preventAccidentalDrop = (event: DragEvent) => {
        let dataTransfer = getDataTransfer(event);
        if (this.isAccidentalFileDropPrevented && !event.defaultPrevented && transferHasFiles(dataTransfer)) {
            event.preventDefault();
            dataTransfer.effectAllowed = 'none';
            dataTransfer.dropEffect = 'none';
            if (event.type === 'drop') {
                this.dropPrevented.emit(undefined);
            }
        }
    }

    /**
     * Fixes a bug when drop events are handled incorrectly
     */
    private detectUntrackedDrop = (event: MouseEvent) => {
        if (this.draggingOverPage && event.buttons === 0) {
            this.draggingOverPage = false;
            this.draggedFileTypes = [];

            this.dragStatusChanged.emit(false);
            this.dropped.emit(undefined);
        }
    }
}
