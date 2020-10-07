import {Component, QueryList, ViewChild, ViewChildren, WrappedValue} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TestBed, inject} from '@angular/core/testing';

import {componentTest, SpyEventTarget, triggerFakeDragEvent, subscribeSpyObserver} from '../../testing';
import {DragStateTrackerFactory} from './drag-state-tracker.service';
import {clientReportsMimeTypesOnDrag} from './drag-drop-utils';
import {PageFileDragHandler, PAGE_FILE_DRAG_EVENT_TARGET} from './page-file-drag-handler.service';
import {FileDropArea, FILE_DROPAREA_DRAG_EVENT_TARGET} from './file-drop-area.directive';


let fakePageElement: SpyEventTarget;
let fakeElement: SpyEventTarget;

describe('File Drop Area:', () => {

    beforeEach(() => {
        fakePageElement = new SpyEventTarget();
        fakeElement = new SpyEventTarget();

        TestBed.configureTestingModule({
            providers: [
                { provide: PAGE_FILE_DRAG_EVENT_TARGET, useValue: fakePageElement },
                { provide: FILE_DROPAREA_DRAG_EVENT_TARGET, useValue: fakeElement },
                PageFileDragHandler,
                DragStateTrackerFactory
            ],
            declarations: [FileDropArea, TestComponent]
        });
    });

    afterEach(inject([PageFileDragHandler], (pageDrag: PageFileDragHandler) => {
        pageDrag.destroy();
    }));

    it('is created ok',
        componentTest(() => TestComponent, fixture => {
            expect(fixture).toBeDefined();
            const dropArea: FileDropArea = fixture.componentInstance.directive;
            expect(dropArea).toBeDefined();
        })
    );

    it('removes its event handlers when destroyed',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            fixture.destroy();

            expect(fakePageElement.listeners).toEqual([]);
            expect(fakeElement.listeners).toEqual([]);
        })
    );

    it('removes its event handlers when destroyed (multiple directives)',
        componentTest(() => TestComponent, `
            <div gtxFileDropArea></div>
            <div gtxFileDropArea></div>
            <div gtxFileDropArea></div>`,
            (fixture, instance) => {
                fixture.detectChanges();

                let directives = instance.directives.toArray();
                directives[0].ngOnDestroy();
                expect(fakePageElement.listeners).not.toEqual([]);
                expect(fakeElement.listeners).not.toEqual([]);

                directives[1].ngOnDestroy();
                expect(fakePageElement.listeners).not.toEqual([]);
                expect(fakeElement.listeners).not.toEqual([]);

                directives[2].ngOnDestroy();
                expect(fakePageElement.listeners).toEqual([]);
                expect(fakeElement.listeners).toEqual([]);
            }
        )
    );

    describe('properties', () => {

        describe('.dragHovered', () => {

            it('is false initially',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    expect(dropArea.dragHovered).toBe(false);
                })
            );

            it('is true when a file is dragged over',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;

                    triggerEventsWithFiles('dragenter dragover');
                    fixture.detectChanges();
                    expect(dropArea.dragHovered).toBe(true);
                })
            );

            it('is false when a file is dragged out',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;

                    triggerEventsWithFiles('dragenter dragover dragleave');
                    fixture.detectChanges();
                    expect(dropArea.dragHovered).toBe(false);
                })
            );

            it('is false when a file is dropped',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;

                    triggerEventsWithFiles('dragenter dragover drop');
                    fixture.detectChanges();
                    expect(dropArea.dragHovered).toBe(false);
                })
            );

            it('is only true if the dragged files match the "accept" option',
                componentTest(() => TestComponent, `
                    <div [gtxFileDropArea]="{ accept: 'image/*' }"></div>`,
                    (fixture, instance) => {
                        if (!clientReportsMimeTypesOnDrag()) {
                            return pending('Client does not report MIME type of dragged files.');
                        }

                        fixture.detectChanges();
                        const dropArea: FileDropArea = instance.directive;

                        triggerEventsWithFiles('dragenter dragover', 'text/plain');
                        fixture.detectChanges();
                        expect(dropArea.dragHovered).toBe(false);

                        triggerEventsWithFiles('dragleave', 'text/plain');
                        triggerEventsWithFiles('dragenter dragover', 'image/jpeg');
                        expect(dropArea.dragHovered).toBe(true);
                    }
                )
            );

        });

        describe('.draggedFiles', () => {

            it('is an empty array initially',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    expect(dropArea.draggedFiles).toEqual([]);
                })
            );

            it('is a list of mime types when a file is dragged over the FileDropArea',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover', 'text/plain');
                    expect(dropArea.draggedFiles).toEqual([{ type: 'text/plain' }]);
                })
            );

            it('is an empty array when a file is dragged out of the FileDropArea',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover dragleave', 'text/plain');
                    expect(dropArea.draggedFiles).toEqual([]);
                })
            );

            it('is an empty array when a file is dropped on the FileDropArea',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover drop', 'text/plain');
                    expect(dropArea.draggedFiles).toEqual([]);
                })
            );

        });

        describe('.filesDraggedInPage', () => {

            it('is an empty array initially',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    expect(dropArea.filesDraggedInPage).toEqual([]);
                })
            );

            it('is a list of mime types when a file is dragged over the Page',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover', 'text/plain', fakePageElement);
                    expect(dropArea.filesDraggedInPage).toEqual([{ type: 'text/plain' }]);
                })
            );

            it('is an empty array when a file is dragged out of the Page',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover dragleave', 'text/plain', fakePageElement);
                    expect(dropArea.filesDraggedInPage).toEqual([]);
                })
            );

            it('is an empty array when a file is dropped on the Page',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    triggerEventsWithFiles('dragenter dragover drop', 'text/plain', fakePageElement);
                    expect(dropArea.filesDraggedInPage).toEqual([]);
                })
            );

        });

    });

    describe('observables', () => {

        describe('draggedFiles$', () => {

            it('does not emit anything before drag events happen',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    let draggedFiles$ = subscribeSpyObserver(dropArea, dropArea.draggedFiles$);
                    expect(draggedFiles$.next).not.toHaveBeenCalled();
                })
            );

            it('emits a list of mime types when files are dragged into the directive',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    let draggedFiles$ = subscribeSpyObserver(dropArea, dropArea.draggedFiles$);

                    triggerEventsWithFiles('dragenter dragover', 'text/plain');
                    fixture.detectChanges();
                    expect(draggedFiles$.next).toHaveBeenCalledWith([{ type: 'text/plain' }]);
                })
            );

            it('emits an empty array when files are dragged out of the directive',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    let draggedFiles$ = subscribeSpyObserver(dropArea, dropArea.draggedFiles$);

                    triggerEventsWithFiles('dragenter dragover');
                    fixture.detectChanges();
                    draggedFiles$.next.calls.reset();

                    triggerEventsWithFiles('dragleave');
                    expect(draggedFiles$.next).toHaveBeenCalledWith([]);
                })
            );

            it('emits an empty array when files are dropped on the directive',
                componentTest(() => TestComponent, fixture => {
                    fixture.detectChanges();
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    let draggedFiles$ = subscribeSpyObserver(dropArea, dropArea.draggedFiles$);

                    triggerEventsWithFiles('dragenter dragover');
                    fixture.detectChanges();
                    draggedFiles$.next.calls.reset();

                    triggerEventsWithFiles('drop');
                    expect(draggedFiles$.next).toHaveBeenCalledWith([]);
                })
            );

            // TODO: This does not work in the demo - why?
            it('works with angulars AsyncPipe',
                componentTest(() => TestComponent, fixture => {
                    let pipe: AsyncPipe;
                    const dropArea: FileDropArea = fixture.componentInstance.directive;
                    let cd = fixture.componentRef.changeDetectorRef;

                    pipe = new AsyncPipe(cd);
                    try {
                        const callPipeTransform = () => {
                            let res = pipe.transform(dropArea.draggedFiles$);
                            return res instanceof WrappedValue ? res.wrapped : res;
                        };

                        expect(callPipeTransform()).toBeNull();

                        triggerEventsWithFiles('dragenter dragover', 'image/png');
                        fixture.detectChanges();

                        expect(callPipeTransform()).toEqual([{ type: 'image/png' }],
                            'dragenter/dragover does not cause AsyncPipe to return the expected array');

                        triggerEventsWithFiles('dragleave', 'image/png');
                        fixture.detectChanges();

                        expect(callPipeTransform()).toEqual([],
                            'dragleave does not cause AsyncPipe to return an empty array');
                    } finally {
                        pipe.ngOnDestroy();
                    }
                })
            );

        });

    });

    describe('options', () => {

        describe('accept', () => {

            it('filters result of "draggedFiles"',
                componentTest(() => TestComponent, `
                    <div [gtxFileDropArea]="{ accept: 'image/*' }"></div>`,
                    (fixture, instance) => {

                        if (!clientReportsMimeTypesOnDrag()) {
                            return pending('Client does not report MIME type of dragged files.');
                        }

                        fixture.detectChanges();
                        const dropArea: FileDropArea = instance.directive;

                        triggerEventsWithFiles('dragenter dragover', 'text/plain');
                        fixture.detectChanges();
                        expect(dropArea.draggedFiles).toEqual([]);

                        triggerEventsWithFiles('dragleave', 'text/plain');
                        triggerEventsWithFiles('dragenter dragover', 'image/jpeg');
                        expect(dropArea.draggedFiles).toEqual([{ type: 'image/jpeg' }]);
                    }
                )
            );

            it('filters the result of "filesDraggedInPage"',
                componentTest(() => TestComponent, `
                    <div [gtxFileDropArea]="{ accept: 'image/*' }"></div>`,
                    (fixture, instance) => {

                        if (!clientReportsMimeTypesOnDrag()) {
                            return pending('Client does not report MIME type of dragged files.');
                        }

                        fixture.detectChanges();
                        const dropArea: FileDropArea = instance.directive;

                        triggerEventsWithFiles('dragenter dragover', 'text/plain', fakePageElement);
                        fixture.detectChanges();
                        expect(dropArea.filesDraggedInPage).toEqual([]);

                        triggerEventsWithFiles('dragleave', 'text/plain', fakePageElement);
                        triggerEventsWithFiles('dragenter dragover', 'image/jpeg', fakePageElement);
                        expect(dropArea.filesDraggedInPage).toEqual([{ type: 'image/jpeg' }]);
                    }
                )
            );

        });

        describe('disabled', () => {

            it('denies dragging into the drop area',
                componentTest(() => TestComponent, `
                    <div [gtxFileDropArea]="{ disabled: true }"></div>`,
                    (fixture, instance) => {
                        fixture.detectChanges();
                        const dropArea = instance.directive;
                        for (let eventType of ['dragenter', 'dragover']) {
                            let event = triggerFakeDragEvent(fakeElement, eventType, ['text/plain']);
                            expect(event.dataTransfer.dropEffect).toBe('none', `dropEffect for ${eventType}`);
                            expect(event.dataTransfer.effectAllowed).toBe('none', `effectAllowed for ${eventType}`);
                            expect(event.defaultPrevented).toBe(true, `default not prevented for ${eventType}`);
                        }
                    }
                )
            );

        });

    });

    describe('events', () => {

        it('fires fileDragEnter when a files is dragged into the element',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();

                expect(instance.onFileDragEnter).not.toHaveBeenCalled();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');
                expect(instance.onFileDragEnter).toHaveBeenCalledWith([{ type: 'image/gif' }]);
            })
        );

        it('fires fileDragLeave when a files is dragged off the element',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');

                expect(instance.onFileDragLeave).not.toHaveBeenCalled();
                triggerEventsWithFiles('dragleave', 'image/gif');
                expect(instance.onFileDragLeave).toHaveBeenCalled();
            })
        );

        it('fires fileDrop when a files is dropped on the element',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');

                expect(instance.onFileDrop).not.toHaveBeenCalled();
                triggerEventsWithFiles('drop', 'image/gif');
                expect(instance.onFileDrop)
                    .toHaveBeenCalledWith([jasmine.objectContaining({ type: 'image/gif' })]);
            })
        );

        it('fires fileDropReject when dropped file does not match the "accept" option',
            componentTest(() => TestComponent, `
                <div [gtxFileDropArea]="{ accept: 'image/*, !image/gif' }"
                    (fileDropReject)="onFileDropRejected($event)"
                ></div>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    triggerEventsWithFiles('dragenter dragover', 'image/gif');

                    expect(instance.onFileDropRejected).not.toHaveBeenCalled();
                    triggerEventsWithFiles('drop', 'image/gif');
                    expect(instance.onFileDropRejected)
                        .toHaveBeenCalledWith([jasmine.objectContaining({ type: 'image/gif' })]);
                }
            )
        );

        it('fires fileDrop and fileDropReject when only some dropped files match the "accept" option',
            componentTest(() => TestComponent, `
                <div [gtxFileDropArea]="{ accept: 'image/*' }"
                    (fileDrop)="onFileDrop($event)"
                    (fileDropReject)="onFileDropRejected($event)"
                ></div>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    triggerEventsWithFiles('dragenter dragover', ['text/plain', 'image/gif']);

                    triggerEventsWithFiles('drop', ['text/plain', 'image/gif']);

                    expect(instance.onFileDrop).toHaveBeenCalled() &&
                    expect(instance.onFileDrop.calls.mostRecent().args[0])
                        .toEqual([jasmine.objectContaining({ type: 'image/gif' })],
                        'image file should be accepted but is not');

                    expect(instance.onFileDropRejected).toHaveBeenCalled() &&
                    expect(instance.onFileDropRejected.calls.mostRecent().args[0])
                        .toEqual([jasmine.objectContaining({ type: 'text/plain' })],
                        'text file should be rejected but is not');
                }
            )
        );

        it('fires pageDragEnter when a files is dragged into the page',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();

                expect(instance.onFileDragEnter).not.toHaveBeenCalled();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');
                expect(instance.onFileDragEnter).toHaveBeenCalledWith([{ type: 'image/gif' }]);
            })
        );

        it('fires pageDragLeave when a files is dragged off the page',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');

                expect(instance.onFileDragLeave).not.toHaveBeenCalled();
                triggerEventsWithFiles('dragleave', 'image/gif');
                expect(instance.onFileDragLeave).toHaveBeenCalled();
            })
        );

        it('fires pageDragLeave when a files is dropped',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                triggerEventsWithFiles('dragenter dragover', 'image/gif');

                expect(instance.onFileDragLeave).not.toHaveBeenCalled();
                triggerEventsWithFiles('dragleave', 'image/gif');
                expect(instance.onFileDragLeave).toHaveBeenCalled();
            })
        );

    });

});


@Component({
    template: `
        <div gtxFileDropArea
            (fileDragEnter)="onFileDragEnter($event)"
            (fileDragLeave)="onFileDragLeave($event)"
            (fileDrop)="onFileDrop($event)"
            (fileDropRejected)="onFileDropRejected($event)"
            (pageDragEnter)="onPageDragEnter($event)"
            (pageDragLeave)="onPageDragLeave($event)"
        >
        </div>`
})
class TestComponent {
    @ViewChild(FileDropArea, { static: true }) directive: FileDropArea;
    @ViewChildren(FileDropArea) directives: QueryList<FileDropArea>;

    onFileDragEnter = jasmine.createSpy('onFileDragEnter');
    onFileDragLeave = jasmine.createSpy('onFileDragLeave');
    onFileDrop = jasmine.createSpy('onFileDrop');
    onFileDropRejected = jasmine.createSpy('onFileDropRejected');
    onPageDragEnter = jasmine.createSpy('onPageDragEnter');
    onPageDragLeave = jasmine.createSpy('onPageDragLeave');
}


function triggerEventsWithFiles(events: string, mimeTypes: string | string[] = 'text/plain', target: SpyEventTarget = fakeElement): void {
    for (let eventType of events.split(' ')) {
        triggerFakeDragEvent(target, eventType, [].concat(mimeTypes));
    }
}

function triggerEventsWithoutFiles(eventsSpaceSeparated: string, target: SpyEventTarget = fakeElement): void {
    for (let eventType of eventsSpaceSeparated.split(' ')) {
        triggerFakeDragEvent(target, eventType, []);
    }
}
