import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';

import {getDataTransfer, getEventTarget, getTransferMimeTypes, transferHasFiles} from './drag-drop-utils';

/**
 * A factory that creates a tracker instance that listens for dragenter/dragleave/drop events
 * on a DOM element and tracks the event state.
 * When the target element contains child elements, DOM events are fired in a confusing order.
 *
 * For example, when the user drags into the div, the into the <a>, then out:
 *   <div><a><span></span></a></div>
 * These events are triggered:
 *   type=dragenter target=<div>
 *   type=dragenter target=<a>
 *   type=dragleave target=<div>
 *   type=dragleave target=<div>
 *
 * This service wraps the browser-specific oddities into an rxjs Observable that emits on changes.
 */
@Injectable()
export class DragStateTrackerFactory {
    public trackElement(target: EventTarget): Observable<FileDragState> {
        let tracker = new DragStateTracker(target);
        return tracker.state$;
    }
}

export type FileDragState = { type: string }[];

/**
 * Helper class that exposes dragenter/dragleave/drop events
 * as an observable stream of the resulting state.
 */
class DragStateTracker {
    state$: Observable<FileDragState>;
    enterLeaveCounter = 0;
    enteredElements = new Set<Element>();
    subscribers: Subscriber<FileDragState>[] = [];

    constructor(private target: EventTarget) {
        this.state$ = new Observable<FileDragState>((subscriber: Subscriber<FileDragState>) => {
            if (this.subscribers.push(subscriber) === 1) {
                this.bindEvents();
            }
            return subscriber.add(() => {
                let index = this.subscribers.indexOf(subscriber);
                this.subscribers.splice(index, 1);
                if (!this.subscribers.length) {
                    this.unbindEvents();
                }
            });
        });

    }

    bindEvents(): void {
        this.target.addEventListener('dragenter', this.onDragEnter, true);
        this.target.addEventListener('dragleave', this.onDragLeave, true);
        this.target.addEventListener('drop', this.onDrop, true);
        this.target.addEventListener('mouseenter', this.detectUntrackedDrop, true);
    }

    unbindEvents(): void {
        this.target.removeEventListener('dragenter', this.onDragEnter, true);
        this.target.removeEventListener('dragleave', this.onDragLeave, true);
        this.target.removeEventListener('drop', this.onDrop, true);
        this.target.removeEventListener('mouseenter', this.detectUntrackedDrop, true);
    }

    emit(state: FileDragState): void {
        this.subscribers.forEach(s => s.next(state));
    }

    onDragEnter = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (this.enteredElements.has(element)) { return; }

        let transfer = getDataTransfer(event);
        if (!transferHasFiles(transfer)) { return; }

        this.enteredElements.add(element);

        if ((++this.enterLeaveCounter) === 1) {
            let types = getTransferMimeTypes(transfer).map(type => ({ type }));
            this.emit(types);
        }
    }

    onDragLeave = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (!transferHasFiles(getDataTransfer(event)) || !this.enteredElements.delete(element)) {
            return;
        }

        if ((--this.enterLeaveCounter) === 0) {
            this.emit([]);
        }
    }

    onDrop = (event: DragEvent) => {
        let element = getEventTarget(event);
        if (!transferHasFiles(getDataTransfer(event)) || !this.enteredElements.delete(element)) {
            return;
        }

        if (this.enterLeaveCounter > 0) {
            this.enterLeaveCounter = 0;
            this.enteredElements = new Set<Element>();
            this.emit([]);
        }
    }

    detectUntrackedDrop = (event: MouseEvent) => {
        if (this.enterLeaveCounter > 0 && event.buttons === 0) {
            this.enterLeaveCounter = 0;
            this.enteredElements = new Set<Element>();
            this.emit([]);
        }
    }
}

