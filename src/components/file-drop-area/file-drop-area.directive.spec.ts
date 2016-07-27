import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';

import {SpyEventTarget, triggerFakeDragEvent} from '../../testing';
import {DragStateTrackerFactory} from './drag-state-tracker.service.ts';
import {PageFileDragHandler, PAGE_FILE_DRAG_EVENT_TARGET} from './page-file-drag-handler.service';
import {FileDropArea, FILE_DROPAREA_DRAG_EVENT_TARGET} from './file-drop-area.directive';


describe('File Drop Area:', () => {

    // let fakeService: MockPageDragDropFileHandler;
    let fakePageElement: SpyEventTarget;
    let fakeDragElement: SpyEventTarget;

    beforeEach(() => {
        // fakeService = new MockPageDragDropFileHandler();
        fakePageElement = new SpyEventTarget();
        fakeDragElement = new SpyEventTarget();

        addProviders([
            { provide: PAGE_FILE_DRAG_EVENT_TARGET, useValue: fakePageElement },
            { provide: FILE_DROPAREA_DRAG_EVENT_TARGET, useValue: fakeDragElement },
            PageFileDragHandler,
            DragStateTrackerFactory
        ]);
    });

    it('is created ok',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>  {
            tcb.createAsync(TestComponent).then(fixture => {
                expect(fixture).toBeDefined();
            });
        }))
    );

    fit('exposes a "dragHovered" boolean',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                const directive: FileDropArea = fixture.componentInstance.directive;
                expect(directive).toBeDefined();
                expect(directive.dragHovered).toBe(false);

                fakeFilesDragged(fakeDragElement, ['text/plain']);
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(directive.dragHovered).toBe(true);
            });
        }))
    );

    //
    // Disabled for now.
    // DebugElement.triggerEventHandler seems not to work for drag/drop events
    // TODO: Find a way to test this.
    xit('exposes a "dragHovered" boolean',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                const directive: FileDropArea = fixture.componentInstance.directive;
                const onDragEnter = spyOn(directive, 'onDragEnter');
                expect(directive).toBeDefined();
                expect(directive.dragHovered).toBe(false);
                fakeFilesDragged(fakeDragElement, ['text/plain']);
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(directive.dragHovered).toBe(true);
            })
        }))
    );

});

@Component({
    template: `
        <div gtxFileDropArea
            #directive="gtxFileDropArea"
            (fileDragEnter)="onFileDragEnter($event)"
            (fileDragLeave)="onFileDragLeave($event)"
            (fileDrop)="onFileDrop($event)"
            (fileDropRejected)="onFileDropRejected($event)"
            (pageDragEnter)="onPageDragEnter($event)"
            (pageDragLeave)="onPageDragLeave($event)"
        >
        </div>`,
    directives: [FileDropArea]
})
class TestComponent {
    @ViewChild('directive') directive: FileDropArea;
    onFileDragEnter = jasmine.createSpy('onFileDragEnter');
    onFileDragLeave = jasmine.createSpy('onFileDragLeave');
    onFileDrop = jasmine.createSpy('onFileDrop');
    onFileDropRejected = jasmine.createSpy('onFileDropRejected');
    onPageDragEnter = jasmine.createSpy('onPageDragEnter');
    onPageDragLeave = jasmine.createSpy('onPageDragLeave');
}

// class MockPageDragDropFileHandler {
//     dragStatusChanged = new EventEmitter<boolean>();
//     draggedIn = new EventEmitter<void>();
//     draggedOut = new EventEmitter<void>();
//     dropped = new EventEmitter<void>();
//     dropPrevented = new EventEmitter<void>();

//     public get fileDraggedInPage(): boolean {
//         return false;
//     }
//     public anyDraggedFileIs(types: string | string[]): boolean {
//         return false;
//     }
//     public allDraggedFilesAre(types: string | string[]): boolean {
//         return false;
//     }
// }


function fakeFilesDragged(target: SpyEventTarget, mimeTypes: string[]): void {
    triggerFakeDragEvent(target, 'dragenter', mimeTypes);
    triggerFakeDragEvent(target, 'dragover', mimeTypes);
}

function fakeFilesDraggedAndDropped(target: SpyEventTarget, mimeTypes: string[]): void {
    triggerFakeDragEvent(target, 'dragenter', mimeTypes);
    triggerFakeDragEvent(target, 'dragover', mimeTypes);
    triggerFakeDragEvent(target, 'drop', mimeTypes);
}
