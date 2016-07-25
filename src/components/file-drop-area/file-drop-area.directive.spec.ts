import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, EventEmitter, ViewChild} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';

import {FileDropArea} from './file-drop-area.directive';
import {PageDragDropFileHandler} from './page-drag-drop-file-handler.service';

describe('File Drop Area:', () => {

    let fakeService: MockPageDragDropFileHandler;

    beforeEach(() => {
        fakeService = new MockPageDragDropFileHandler();
        addProviders([
            { provide: PageDragDropFileHandler, useValue: fakeService }
        ]);
    });

    it('is created ok',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                expect(fixture).toBeDefined();
            })
        ))
    );

    //
    // Disabled for now.
    // DebugElement.triggerEventHandler seems not to work for drag/drop events
    // TODO: Find a way to test this.
    xit('exposes a "draggedOver" boolean',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                const directive: FileDropArea = fixture.componentInstance.directive;
                const onDragEnter = spyOn(directive, 'onDragEnter');
                expect(directive).toBeDefined();
                expect(directive.draggedOver).toBe(false);
                fakeFilesDragged(fixture, ['text/plain']);
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(directive.draggedOver).toBe(true);
            })
        ))
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

class MockPageDragDropFileHandler {
    dragStatusChanged = new EventEmitter<boolean>();
    draggedIn = new EventEmitter<void>();
    draggedOut = new EventEmitter<void>();
    dropped = new EventEmitter<void>();
    dropPrevented = new EventEmitter<void>();

    public get fileDraggedInPage(): boolean {
        return false;
    }
    public anyDraggedFileIs(types: string | string[]): boolean {
        return false;
    }
    public allDraggedFilesAre(types: string | string[]): boolean {
        return false;
    }
}

function createFakeDragEvent(eventName: string, mimeTypes: string[]): DragEvent {
    return <any> {
        type: eventName,
        dataTransfer: {
            dropEffect: 'none',
            effectAllowed: 'all',
            files: mimeTypes.map((type: string, i: number) => ({ name: `unknown${i}`, type })),
            items: mimeTypes.map(type => ({ kind: 'file', type })),
            types: ['Files']
        }
    };
}

function fakeFilesDragged(fixture: ComponentFixture<TestComponent>, mimeTypes: string[]): void {
    fixture.debugElement.triggerEventHandler('dragenter', createFakeDragEvent('dragenter', mimeTypes));
    fixture.debugElement.triggerEventHandler('dragover', createFakeDragEvent('dragover', mimeTypes));
}

function fakeFilesDraggedAndDropped(fixture: ComponentFixture<TestComponent>, mimeTypes: string[]): void {
    fixture.debugElement.triggerEventHandler('dragenter', createFakeDragEvent('dragenter', mimeTypes));
    fixture.debugElement.triggerEventHandler('dragover', createFakeDragEvent('dragover', mimeTypes));
    fixture.debugElement.triggerEventHandler('drop', createFakeDragEvent('drop', mimeTypes));
}
