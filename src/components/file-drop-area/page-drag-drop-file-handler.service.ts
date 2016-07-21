import {EventEmitter, Inject, Injectable, Input, OnInit, OnDestroy, Output, OpaqueToken, Optional} from '@angular/core';

import {getDataTransfer, getEventTarget, transferHasFiles} from './drag-drop-utils';

/**
 * A token that can be used to inject a mock into the service
 */
export const TAB_FILE_DRAG_EVENT_TARGET = new OpaqueToken('TAB_FILE_DRAG_EVENT_TARGET');


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

    public get fileDraggedInTab(): boolean {
        return this.draggingOverTab;
    }


    /**
     * Can be overwritten for testing purposes
     * @internal
     */
    eventTarget: EventTarget;


    private draggingOverTab = false;
    private enterLeaveCounter = 0;
    private enteredElements = new WeakSet<Element>();
    private eventsBound = false;
    private componentsWantingToPreventFileDrop = new Set<any>();
    private isAccidentalFileDropPrevented = false;


    constructor(@Optional() @Inject(TAB_FILE_DRAG_EVENT_TARGET) eventTarget: EventTarget) {
        if (eventTarget) {
            this.eventTarget = eventTarget;
        } else if (typeof window === 'object') {
            this.eventTarget = window;
        } else {
            this.eventTarget = noopEventTarget;
        }

        this.bindEvents();
    }

    bindEvents(): void {
        if (this.eventsBound) { return; }
        const on: any = (...args: any[]) => this.eventTarget.addEventListener.apply(this.eventTarget, args);
        on('dragenter', this.fileDraggedIntoElement, true);
        on('dragleave', this.fileDraggedOutOfElement, true);
        on('drop', this.fileDroppedOnElement, true);
        on('dragenter', this.preventAccidentalDrop);
        on('dragover', this.preventAccidentalDrop);
        on('drop', this.preventAccidentalDrop);
        this.eventsBound = true;
    }

    unbindEvents(): void {
        this.eventTarget.removeEventListener('dragenter', this.fileDraggedIntoElement, true);
        this.eventTarget.removeEventListener('dragleave', this.fileDraggedOutOfElement, true);
        this.eventTarget.removeEventListener('drop', this.fileDroppedOnElement, true);
        this.eventTarget.removeEventListener('dragenter', this.preventAccidentalDrop);
        this.eventTarget.removeEventListener('dragover', this.preventAccidentalDrop);
        this.eventTarget.removeEventListener('drop', this.preventAccidentalDrop);
        this.eventsBound = false;
    }


    /**
     * @internal
     */
    requestPreventingFileDropGlobally(directive: any, prevent: boolean): void {
        if (prevent) {
            this.componentsWantingToPreventFileDrop.add(directive);
        } else {
            this.componentsWantingToPreventFileDrop.delete(directive);
        }
        this.isAccidentalFileDropPrevented = this.componentsWantingToPreventFileDrop.size > 0;
    }

    private fileDraggedIntoElement = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (this.enteredElements.has(element) || !transferHasFiles(getDataTransfer(event))) {
            return;
        }

        this.enterLeaveCounter += 1;
        this.enteredElements.add(element);

        if (this.enterLeaveCounter === 1) {
            this.draggingOverTab = true;

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
            this.draggingOverTab = false;

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

        if (this.draggingOverTab) {
            this.draggingOverTab = false;
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
}

