import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, EventEmitter, ViewChild} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {FileDropArea} from '../file-drop-area/file-drop-area.directive';
import {FilePicker} from './file-picker.component';
import {Button} from '../button/button.component';


describe('File Picker:', () => {

    beforeEach(() => addProviders([
        { provide: FileDropArea, useClass: MockFileDropArea }
    ]));

    it('is created ok',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(FilePicker).then(fixture => {
                expect(fixture).toBeDefined();
            });
        }))
    );

    describe('inputs', () => {

        it('copies "disabled" to its native file input',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker [disabled]="true"></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.disabled).toBe(true);
                });
            }))
        );

        it('copies "multiple" to its native file input',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker [multiple]="false"></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.multiple).toBe(false);
                });
            }))
        );

        it('copies "accept" to its native file input',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker accept="video/*"></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.accept).toBe('video/*');
                });
            }))
        );

        it('copies "size" and "icon" to its Button component',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker size="large" icon></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let button: Button = fixture.debugElement.query(By.directive(Button)).componentInstance;
                    expect(button.size).toBe('large');
                    expect(button.icon).toBe(true);
                });
            }))
        );
    });

    describe('integration with FileDropArea', () => {

        it('copies "disabled", "multiple" and "accept" to the FileDropArea options',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker gtxFileDropArea
                        [disabled]="disabled" [multiple]="multiple" [accept]="accept"
                    ></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    let testInstance = fixture.componentRef.instance;
                    testInstance.disabled = true;
                    testInstance.multiple = false;
                    testInstance.accept = 'text/*';
                    fixture.detectChanges();

                    expect(testInstance.dropArea.options).toEqual(jasmine.objectContaining({
                        disabled: true,
                        multiple: false,
                        accept: 'text/*'
                    }));

                    testInstance.disabled = false;
                    testInstance.multiple = true;
                    testInstance.accept = 'application/pdf';
                    fixture.detectChanges();

                    expect(testInstance.dropArea.options).toEqual(jasmine.objectContaining({
                        disabled: false,
                        multiple: true,
                        accept: 'application/pdf'
                    }));
                });
            }))
        );

        it('emits fileSelect on the component when a file is dropped',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker gtxFileDropArea
                        (fileSelect)="onFileSelect($event)"
                    ></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let testInstance = fixture.componentRef.instance;
                    testInstance.dropArea.fileDrop.emit(<File[]> [{ name: 'accepted.txt' }]);
                    expect(testInstance.onFileSelect).toHaveBeenCalled();
                });
            }))
        );

        it('emits fileSelectReject on the component when a file drop is rejected',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-file-picker gtxFileDropArea
                        (fileSelectReject)="onFileSelectReject($event)"
                    ></gtx-file-picker>
                `)
                .createAsync(TestComponent).then(fixture => {
                    fixture.detectChanges();
                    let testInstance = fixture.componentRef.instance;
                    testInstance.dropArea.fileDropReject.emit(<File[]> [{ name: 'rejected.txt' }]);
                    expect(testInstance.onFileSelectReject).toHaveBeenCalled();
                });
            }))
        );

    });

});


class MockFileDropArea {
    dragHovered = false;
    draggedFiles: any[] = [];
    pageDragHovered = false;
    filesDraggedInPage: any[] = [];
    options: any = {};
    draggedFiles$ = new EventEmitter<any[]>();
    filesDraggedInPage$ = new EventEmitter<any[]>();
    fileDragEnter = new EventEmitter<any[]>();
    fileDragLeave = new EventEmitter<void>();
    pageDragEnter = new EventEmitter<any[]>();
    pageDragLeave = new EventEmitter<void>();
    fileDrop = new EventEmitter<any[]>();
    fileDropReject = new EventEmitter<any[]>();
}

@Component({
    template: `
        <gtx-file-picker
            (fileSelect)="onFileSelect($event)"
            (fileSelectReject)="onFileSelectReject($event)"
        ></gtx-file-picker>`,
    directives: [FilePicker, FileDropArea]
})
class TestComponent {
    disabled = false;
    multiple = false;
    accept = '*';
    size = 'regular';
    icon = false;

    @ViewChild(FileDropArea) dropArea: MockFileDropArea;

    onFileSelect = jasmine.createSpy('onFileSelect');
    onFileSelectReject = jasmine.createSpy('onFileSelectReject');
}
