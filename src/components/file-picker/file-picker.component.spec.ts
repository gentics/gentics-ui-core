import {Component, EventEmitter, ViewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {FileDropArea} from '../file-drop-area/file-drop-area.directive';
import {FilePicker} from './file-picker.component';
import {Button} from '../button/button.component';

describe('File Picker:', () => {

    beforeEach(() => TestBed.configureTestingModule({
    providers: [
        { provide: FileDropArea, useClass: MockFileDropArea }
    ],
    declarations: [FilePicker, FileDropArea, TestComponent, Button],
    teardown: { destroyAfterEach: false }
}));

    it('is created ok',
        componentTest(() => TestComponent, fixture => {
            expect(fixture).toBeDefined();
        })
    );

    describe('inputs', () => {

        it('copies "disabled" to its native file input',
            componentTest(() => TestComponent, `
                <gtx-file-picker [disabled]="true"></gtx-file-picker>`,
                fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.disabled).toBe(true);
                }
            )
        );

        it('copies "multiple" to its native file input',
            componentTest(() => TestComponent, `
                <gtx-file-picker [multiple]="false"></gtx-file-picker>`,
                fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.multiple).toBe(false);
                }
            )
        );

        it('copies "accept" to its native file input',
            componentTest(() => TestComponent, `
                <gtx-file-picker accept="video/*"></gtx-file-picker>`,
                fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.accept).toBe('video/*');
                }
            )
        );

        it('copies "size" and "icon" to its Button component',
            componentTest(() => TestComponent, `
                <gtx-file-picker size="large" icon></gtx-file-picker>`,
                fixture => {
                    fixture.detectChanges();
                    let button: Button = fixture.debugElement.query(By.directive(Button)).componentInstance;
                    expect(button.size).toBe('large');
                    expect(button.icon).toBe(true);
                }
            )
        );
    });

    describe('integration with FileDropArea', () => {

        it('copies "disabled", "multiple" and "accept" to the FileDropArea options',
            componentTest(() => TestComponent, `
                <gtx-file-picker gtxFileDropArea
                    [disabled]="disabled" [multiple]="multiple" [accept]="accept"
                ></gtx-file-picker>`,
                (fixture, testComponent) => {
                    testComponent.disabled = true;
                    testComponent.multiple = false;
                    testComponent.accept = 'text/*';
                    fixture.detectChanges();

                    expect(testComponent.dropArea.options).toEqual(jasmine.objectContaining({
                        disabled: true,
                        multiple: false,
                        accept: 'text/*'
                    }));

                    testComponent.disabled = false;
                    testComponent.multiple = true;
                    testComponent.accept = 'application/pdf';
                    fixture.detectChanges();

                    expect(testComponent.dropArea.options).toEqual(jasmine.objectContaining({
                        disabled: false,
                        multiple: true,
                        accept: 'application/pdf'
                    }));
                }
            )
        );

        it('emits fileSelect on the component when a file is dropped',
            componentTest(() => TestComponent, `
                <gtx-file-picker gtxFileDropArea
                    (fileSelect)="onFileSelect($event)"
                ></gtx-file-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    instance.dropArea.fileDrop.emit(<File[]> [{ name: 'accepted.txt' }]);
                    expect(instance.onFileSelect).toHaveBeenCalled();
                }
            )
        );

        it('emits fileSelectReject on the component when a file drop is rejected',
            componentTest(() => TestComponent, `
                <gtx-file-picker gtxFileDropArea
                    (fileSelectReject)="onFileSelectReject($event)"
                ></gtx-file-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    instance.dropArea.fileDropReject.emit(<File[]> [{ name: 'rejected.txt' }]);
                    expect(instance.onFileSelectReject).toHaveBeenCalled();
                }
            )
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
        ></gtx-file-picker>`
})
class TestComponent {
    disabled = false;
    multiple = false;
    accept = '*';
    size = 'regular';
    icon = false;

    @ViewChild(FileDropArea, { static: true }) dropArea: MockFileDropArea;

    onFileSelect = jasmine.createSpy('onFileSelect');
    onFileSelectReject = jasmine.createSpy('onFileSelectReject');
}
