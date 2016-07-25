import {Observable, Subscription} from 'rxjs';

import {PageDragDropFileHandler} from './page-drag-drop-file-handler.service';


describe('PageDragDropFileHandler service:', () => {

    const WITHOUT_FILES: any[] = [];

    let spyPageElement: SpyEventTarget;
    let service: PageDragDropFileHandler;

    beforeEach(() => {
        spyPageElement = new SpyEventTarget();
        service = new PageDragDropFileHandler(spyPageElement);
    });

    afterEach(() => {
        service.unbindEvents();
    });

    it('adds event listeners to the page', () => {
        expect(spyPageElement.addEventListener).toHaveBeenCalled();
        expect(spyPageElement.hasListener('dragenter', true)).toEqual(true);
        expect(spyPageElement.hasListener('dragleave', true)).toEqual(true);
        expect(spyPageElement.hasListener('drop', true)).toEqual(true);
        expect(spyPageElement.hasListener('dragenter', false)).toEqual(true);
        expect(spyPageElement.hasListener('dragover', false)).toEqual(true);
        expect(spyPageElement.hasListener('drop', false)).toEqual(true);
    });

    it('allows removing its event listeners with unbindEvents (internal)', () => {
        expect(spyPageElement.addEventListener).toHaveBeenCalled();
        expect(spyPageElement.listeners.length).toBeGreaterThan(0);
        service.unbindEvents();
        expect(spyPageElement.removeEventListener).toHaveBeenCalled();
        expect(spyPageElement.listeners).toEqual([]);
    });

    function triggerFakeDragEvent(eventType: string, mimeTypes: string[]): boolean {
        return spyPageElement.triggerListeners(eventType, {
            type: eventType,
            dataTransfer: {
                dropEffect: 'none',
                effectAllowed: 'all',
                files: mimeTypes.map((type: string, i: number) => ({ name: `unknown${i}`, type })),
                items: mimeTypes.map(type => ({ kind: 'file', type })),
                types: mimeTypes.length > 0 ? ['Files'] : []
            },
            target: spyPageElement
        });
    }

    describe('fileDraggedInPage', () => {

        it('is true after dragenter', () => {
            expect(service.fileDraggedInPage).toBe(false);
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(service.fileDraggedInPage).toBe(true);
        });

        it('remains false after dragenter if no file is dragged', () => {
            expect(service.fileDraggedInPage).toBe(false);
            triggerFakeDragEvent('dragenter', WITHOUT_FILES);
            expect(service.fileDraggedInPage).toBe(false);
        });

        it('is false after dragleave', () => {
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(service.fileDraggedInPage).toBe(true);
            triggerFakeDragEvent('dragleave', ['text/plain']);
            expect(service.fileDraggedInPage).toBe(false);
        });

        it('is false after drop', () => {
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(service.fileDraggedInPage).toBe(true);
            triggerFakeDragEvent('drop', ['text/plain']);
            expect(service.fileDraggedInPage).toBe(false);
        });

    });

    describe('anyDraggedFileIs()', () => {

        it('is true if all dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(true);
        });

        it('is true if some but not all dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['text/plain', 'image/jpeg']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(true);
        });

        it('is true if none of the dragged files match the allowed mime types', () => {
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['image/jpeg']);
            expect(service.anyDraggedFileIs('text/plain')).toBe(false);
        });

    });

    describe('allDraggedFilesAre()', () => {

        it('is true if all dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(true);
        });

        it('is false if some but not all dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['text/plain', 'image/jpeg']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
        });

        it('is true if none of the dragged files match the allowed mime types', () => {
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
            triggerFakeDragEvent('dragenter', ['image/jpeg']);
            expect(service.allDraggedFilesAre('text/plain')).toBe(false);
        });

    });

    describe('events', () => {

        it('fires draggedIn and dragStatusChanged when a file is dragged into the page', () => {
            let draggedIn = subscribeSpy(service, service.draggedIn);
            let dragStatusChanged = subscribeSpy(service, service.dragStatusChanged);
            expect(draggedIn).not.toHaveBeenCalled();
            expect(dragStatusChanged).not.toHaveBeenCalled();
            triggerFakeDragEvent('dragenter', ['text/plain']);
            expect(draggedIn).toHaveBeenCalled();
            expect(dragStatusChanged).toHaveBeenCalledWith(true);
        });

        it('does not fire draggedIn or dragStatusChanged when text is dragged into the page', () => {
            let draggedIn = subscribeSpy(service, service.draggedIn);
            let dragStatusChanged = subscribeSpy(service, service.dragStatusChanged);
            expect(draggedIn).not.toHaveBeenCalled();
            expect(dragStatusChanged).not.toHaveBeenCalled();
            triggerFakeDragEvent('dragenter', WITHOUT_FILES);
            expect(draggedIn).not.toHaveBeenCalled();
            expect(dragStatusChanged).not.toHaveBeenCalled();
        });

        it('fires draggedOut and dragStatusChanged when a file is dragged out of the page', () => {
            triggerFakeDragEvent('dragenter', ['text/plain']);
            let draggedOut = subscribeSpy(service, service.draggedOut);
            let dragStatusChanged = subscribeSpy(service, service.dragStatusChanged);
            triggerFakeDragEvent('dragleave', ['text/plain']);
            expect(draggedOut).toHaveBeenCalled();
            expect(dragStatusChanged).toHaveBeenCalledWith(false);
        });

        it('fires dropped and dragStatusChanged when a file is dropped on an element', () => {
            triggerFakeDragEvent('dragenter', ['text/plain']);
            let dropped = subscribeSpy(service, service.dropped);
            let dragStatusChanged = subscribeSpy(service, service.dragStatusChanged);
            triggerFakeDragEvent('drop', ['text/plain']);
            expect(dropped).toHaveBeenCalled();
            expect(dragStatusChanged).toHaveBeenCalledWith(false);
        });

    });

});

class SpyEventTarget implements EventTarget {

    listeners: { type: string, listener: any, useCapture: boolean }[] = [];

    constructor() {
        spyOn(this, 'addEventListener').and.callThrough();
        spyOn(this, 'dispatchEvent').and.callThrough();
        spyOn(this, 'removeEventListener').and.callThrough();
    }
    addEventListener(type: string, listener?: any, useCapture?: boolean): void {
        this.listeners.push({
            type,
            listener: listener || (() => {}),
            useCapture: useCapture !== undefined ? useCapture : false
        });
    }
    dispatchEvent(evt: Event): boolean {
        return this.triggerListeners(evt.type, evt);
    }
    removeEventListener(type: string, listener?: any, useCapture?: boolean): void {
        let index = this.listeners.findIndex(l =>
            l.type === type && l.listener === listener && l.useCapture === useCapture);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    hasListener(type: string, useCapture: boolean = false): boolean {
        return this.listeners.some(l => l.type === type && l.useCapture === useCapture);
    }
    triggerListeners(type: string, data?: any): boolean {
        // Add event methods
        let eventData = Object.assign(Object.create(Object.getPrototypeOf(data)), {
            defaultPrevented: false,
            preventDefault(): void { this.defaultPrevented = true; },
            stopPropagation(): void {},
            immediatePropagationStopped: false,
            stopImmediatePropagation(): void { this.immediatePropagationStopped = true; }
        }, data);

        // Run capture & bubbling phase
        let lastResult: boolean = true;
        this.listeners
            .filter(listener => listener.type === type)
            .sort((a, b) => (+b.useCapture) - (+a.useCapture))
            .forEach(l => {
                let result = lastResult = l.listener.call(this, eventData);
                if (result === false || eventData.immediatePropagationStopped) {
                    return false;
                }
            });

        return lastResult;
    }
}

function subscribeSpy(subject: any, observable: Observable<any>): jasmine.Spy {
    let name: string = 'unknown';
    for (let k in subject) {
        if (subject[k] === observable) {
            name = k;
            break;
        }
    }

    let spy = jasmine.createSpy(name);
    let subscription = observable.subscribe(spy);
    jasmine.getEnv().afterAll(() => { subscription.unsubscribe(); });

    return spy;
}
