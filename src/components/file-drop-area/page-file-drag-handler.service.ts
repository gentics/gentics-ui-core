import {EventEmitter, Inject, Injectable, Input, OnInit, OnDestroy, Output, OpaqueToken, Optional} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {DragStateTrackerFactory, FileDragState} from './drag-state-tracker.service';
import {getDataTransfer, getEventTarget, getTransferMimeTypes, transferHasFiles} from './drag-drop-utils';
import {matchesMimeType} from './matches-mime-type';


/**
 * A token that can be used to inject a mock into the service
 * @internal
 */
export const PAGE_FILE_DRAG_EVENT_TARGET = new OpaqueToken('PAGE_FILE_DRAG_EVENT_TARGET');

/**
 * A helper service that listens for dragenter/dragleave/drop events on the window
 * and tracks when files are dragged into or out of the active tab.
 *
 * When files are accidentally dropped on the tab outside of a drop zone, the drop
 * can be cancelled to prevent the browser from opening/downloading the file.
 * See {@link gtxPreventFileDrop} for details.
 */
@Injectable()
export class PageFileDragHandler {

    /**
     * Fires when a file is dragged into the current tab, dragged out or dropped.
     * @exmample
     *   class Component {
     *     constructor(private pageDrag: PageFileDragStatusService) { }
     *   }
     *
     *   <ul *ngIf="pageDrag.filesDragged$ | async"> ... </ul>
     */
    @Output() filesDragged$: Observable<FileDragState>;

    /**
     * Emits a list when a file is dragged into the current tab.
     * The list contains `{ "type": string }` elements.
     */
    @Output() dragEnter: Observable<FileDragState>;

    /**
     * Emits false when a file is dragged out of the current tab.
     */
    @Output() dragStop: Observable<boolean>;

    /**
     * Fires when a drop event is prevented.
     */
    @Output() dropPrevented = new EventEmitter<void>();


    private _filesDragged: FileDragState = [];
    private _subscription: Subscription;
    private _eventTarget: EventTarget;
    private _eventsBound = false;
    private _componentsWantingToPreventFileDrop = new Set<any>();
    private _preventAccidentalFileDrop = false;

    /**
     * Returns true if a file is dragged over the current page/tab.
     * @example
     *   class Component {
     *     constructor(private pageDragStatus: PageFileDragStatusService) {}
     *   }
     *
     *   <ul *ngIf="pageDragStatus.filesDragged"> ... </ul>
     */
    public get filesDragged(): FileDragState {
        return this._filesDragged;
    }

    /**
     * Returns true if files are dragged over the current tab and any file matches the specified mime type.
     * @example
     *   class Component {
     *     constructor(private pageDragStatus: PageFileDragStatusService) {}
     *   }
     *
     *   <ul *ngIf="pageDragStatus.anyDraggedFileIs('image/*')"> ... </ul>
     */
    public anyDraggedFileIs(allowedTypes: string): boolean {
        return !!(this._filesDragged.length && this._filesDragged.some(file =>
            matchesMimeType(file.type, allowedTypes)));
    }

    /**
     * Returns true if files are dragged over the current page and all files match the specified mime type.
     * @example
     *   class Component {
     *     constructor(private pageDragStatus: PageFileDragStatusService) {}
     *   }
     *
     *   <ul *ngIf="pageDragStatus.allDraggedFilesAre('image/*')"> ... </ul>
     */
    public allDraggedFilesAre(allowedTypes: string): boolean {
        return !!(this._filesDragged.length && this._filesDragged.every(file =>
            matchesMimeType(file.type, allowedTypes)));
    }


    constructor(@Optional() @Inject(PAGE_FILE_DRAG_EVENT_TARGET) eventTarget: any,
                dragState: DragStateTrackerFactory) {

        if (eventTarget) {
            this._eventTarget = eventTarget;
        } else if (typeof window === 'object') {
            this._eventTarget = window;
        } else {
            throw new Error('No event target for PageFileDragHandler.');
        }

        this.filesDragged$ = dragState.trackElement(this._eventTarget);
        this.dragEnter = this.filesDragged$.filter(list => list.length > 0);
        this.dragStop = this.filesDragged$.filter(list => list.length === 0).mapTo(false);
        this.bindEvents();
    }

    destroy(): void {
        this.unbindEvents();
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = undefined;
        }
        this._componentsWantingToPreventFileDrop = new Set<HTMLElement>();
        this._preventAccidentalFileDrop = false;
    }

    /** @internal */
    bindEvents(): void {
        if (this._eventsBound) { return; }
        this._subscription = this.filesDragged$.subscribe(dragged => this._filesDragged = dragged);
        this._eventTarget.addEventListener('dragenter', this.preventAccidentalDrop, false);
        this._eventTarget.addEventListener('dragover', this.preventAccidentalDrop, false);
        this._eventTarget.addEventListener('drop', this.preventAccidentalDrop, false);
        this._eventsBound = true;
    }

    /** @internal */
    unbindEvents(): void {
        this._eventTarget.removeEventListener('dragenter', this.preventAccidentalDrop, false);
        this._eventTarget.removeEventListener('dragover', this.preventAccidentalDrop, false);
        this._eventTarget.removeEventListener('drop', this.preventAccidentalDrop, false);
        this._eventsBound = false;
    }

    /** @internal */
    preventFileDropOnPageFor(directive: any, prevent: boolean): void {
        if (prevent) {
            this._componentsWantingToPreventFileDrop.add(directive);
        } else {
            this._componentsWantingToPreventFileDrop.delete(directive);
        }
        this._preventAccidentalFileDrop = this._componentsWantingToPreventFileDrop.size > 0;
    }

    private preventAccidentalDrop = (event: DragEvent) => {
        let dataTransfer = getDataTransfer(event);
        if (this._preventAccidentalFileDrop && !event.defaultPrevented && transferHasFiles(dataTransfer)) {
            event.preventDefault();
            dataTransfer.effectAllowed = 'none';
            dataTransfer.dropEffect = 'none';
            if (event.type === 'drop') {
                this.dropPrevented.emit(undefined);
            }
        }
    }

}
