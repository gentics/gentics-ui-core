import {Observable, Subscription} from 'rxjs';

import {SpyEventTarget, subscribeSpyObserver, triggerFakeDragEvent} from '../../testing';
import {DragStateTrackerFactory} from './drag-state-tracker.service';
import {PageFileDragHandler} from './page-file-drag-handler.service';

import {EventEmitter} from '@angular/core';

describe('PageDragDropFileHandler service:', () => {

    const WITHOUT_FILES: any[] = [];

    let spyPageElement: SpyEventTarget;
    let service: PageFileDragHandler;

    beforeEach(() => {
        spyPageElement = new SpyEventTarget();
        let dragStateTrackerFactory = new DragStateTrackerFactory();
        service = new PageFileDragHandler(spyPageElement, dragStateTrackerFactory);
    });

    afterEach(() => {
        service.destroy();
    });

    it('adds event listeners to the page', () => {
        expect(spyPageElement.addEventListener).toHaveBeenCalled();
        let listeners = spyPageElement.listeners.map(l => l.type);
        expect(listeners).toContain('dragenter');
        expect(listeners).toContain('dragover');
        expect(listeners).toContain('drop');
    });

    it('allows removing its event listeners with destroy()', () => {
        expect(spyPageElement.addEventListener).toHaveBeenCalled();
        expect(spyPageElement.listeners.length).toBeGreaterThan(0);
        service.destroy();
        expect(spyPageElement.removeEventListener).toHaveBeenCalled();
        expect(spyPageElement.listeners).toEqual([]);
    });

    describe('fileDragged', () => {

        it('is a list of mime type objects after dragenter', () => {
            expect(service.filesDragged).toEqual([]);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(service.filesDragged).toEqual([{ type: 'text/plain' }]);
        });

        it('remains empty after dragenter if no file is dragged', () => {
            expect(service.filesDragged).toEqual([]);
            triggerFakeDragEvent(spyPageElement, 'dragenter', WITHOUT_FILES);
            expect(service.filesDragged).toEqual([]);
        });

        it('is empty after dragleave', () => {
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(service.filesDragged).toEqual([{ type: 'text/plain' }]);
            triggerFakeDragEvent(spyPageElement, 'dragleave', ['text/plain']);
            expect(service.filesDragged).toEqual([]);
        });

        it('is empty after drop', () => {
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(service.filesDragged).toEqual([{ type: 'text/plain' }]);
            triggerFakeDragEvent(spyPageElement, 'drop', ['text/plain']);
            expect(service.filesDragged).toEqual([]);
        });

    });

    describe('anyDraggedFileIs()', () => {

        it('is true if all dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(true);
        });

        it('is true if some but not all dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain', 'image/jpeg']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(true);
        });

        it('is true if none of the dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['image/jpeg']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
        });

    });

    describe('allDraggedFilesAre()', () => {

        it('is true if all dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(true);
        });

        it('is false if some but not all dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain', 'image/jpeg']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
        });

        it('is true if none of the dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['image/jpeg']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
        });

    });

    describe('events', () => {

        it('emits dragEnter when a file is dragged into the page', () => {
            let dragEnter = subscribeSpyObserver(service, service.dragEnter);
            expect(dragEnter.next).not.toHaveBeenCalled();

            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(dragEnter.next).toHaveBeenCalled();
        });

        it('does not emit dragEnter or filesDragged$ when text is dragged into the page', () => {
            let dragEnter = subscribeSpyObserver(service, service.dragEnter);
            expect(dragEnter.next).not.toHaveBeenCalled();

            triggerFakeDragEvent(spyPageElement, 'dragenter', WITHOUT_FILES);
            expect(dragEnter.next).not.toHaveBeenCalled();
        });

        it('emits dragStop and filesDragged$ when a file is dragged out of the page', () => {
            let dragStop = subscribeSpyObserver(service, service.dragStop);
            expect(dragStop.next).not.toHaveBeenCalled();

            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            triggerFakeDragEvent(spyPageElement, 'dragleave', ['text/plain']);

            expect(dragStop.next).toHaveBeenCalled();
        });

        it('emits dragStop and filesDragged$ when a file is dropped on an element', () => {
            let dragStop = subscribeSpyObserver(service, service.dragStop);

            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            triggerFakeDragEvent(spyPageElement, 'drop', ['text/plain']);
            expect(dragStop.next).toHaveBeenCalled();
        });

    });

    describe('observables', () => {

        it('filesDragged$ emits an empty array before receiving drag events', () => {
            let filesDragged$ = subscribeSpyObserver(service, service.filesDragged$);
            expect(filesDragged$.next).toHaveBeenCalledWith([]);
        });

        it('filesDragged$ emits a mime type list when a file is dragged into the page', () => {
            let filesDragged$ = subscribeSpyObserver(service, service.filesDragged$);
            filesDragged$.next.calls.reset();

            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            expect(filesDragged$.next).toHaveBeenCalledTimes(1);
            expect(filesDragged$.next).toHaveBeenCalledWith([{ type: 'text/plain' }]);
        });

        it('filesDragged$ does not emit when text is dragged into the page', () => {
            let filesDragged$ = subscribeSpyObserver(service, service.filesDragged$);
            filesDragged$.next.calls.reset();

            triggerFakeDragEvent(spyPageElement, 'dragenter', WITHOUT_FILES);
            expect(filesDragged$.next).not.toHaveBeenCalled();
        });

        it('filesDragged$ emits [] when a file is dragged out of the page', () => {
            let filesDragged$ = subscribeSpyObserver(service, service.filesDragged$);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            filesDragged$.next.calls.reset();

            triggerFakeDragEvent(spyPageElement, 'dragleave', ['text/plain']);
            expect(filesDragged$.next).toHaveBeenCalledWith([]);
        });

        it('filesDragged$ emits [] when a file is dropped on an element', () => {
            let filesDragged$ = subscribeSpyObserver(service, service.filesDragged$);
            triggerFakeDragEvent(spyPageElement, 'dragenter', ['text/plain']);
            filesDragged$.next.calls.reset();

            triggerFakeDragEvent(spyPageElement, 'drop', ['text/plain']);
            expect(filesDragged$.next).toHaveBeenCalledWith([]);
        });

    });

});

