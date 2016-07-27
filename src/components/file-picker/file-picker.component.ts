import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Optional, Output, Self} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {Button} from '../button/button.component';
import {FileDropArea} from '../file-drop-area/file-drop-area.directive';
import {PageFileDragHandler} from '../file-drop-area/page-file-drag-handler.service';
import {matchesMimeType} from '../file-drop-area/matches-mime-type';


/**
 * A file picker component.
 *
 * ```html
 * <gtx-file-picker (fileSelect)="uploadFiles($event)"></gtx-file-picker>
 * ```
 */
@Component({
    selector: 'gtx-file-picker',
    template: require('./file-picker.tpl.html'),
    directives: [Button, FileDropArea],
    host: {
        '[class.dragged-over]': 'dropArea && dropArea.draggedOver',
        '[class.dragged-in-page]': 'dropArea && dropArea.fileDraggedInPage && !dropArea.draggedOver'
    }
})
export class FilePicker implements OnInit, OnDestroy {
    /**
     * Set to a non-false value to disable the file picker. Defaults to `false` if absent.
     */
    @Input() get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        let newValue = value !== false && <any> value !== 'false';
        if (newValue != this._disabled) {
            this._disabled = newValue;
            this.setDropAreaOptions();
        }
    }

    /**
     * Set to a falsy value to disable picking multiple files at once. Defaults to `true` if absent.
     */
    @Input() get multiple(): boolean {
        return this._multiple;
    }
    set multiple(value: boolean) {
        let newValue = value !== false && <any> value !== 'false';
        if (newValue != this._multiple) {
            this._multiple = newValue;
            this.setDropAreaOptions();
        }
    }

    /**
     * Provides feedback for accepted file types, if supported by the browser. Defaults to `"*"`.
     */
    @Input() get accept(): string {
        return this._accept;
    }
    set accept(value: string) {
        if (value !== this._accept) {
            this._accept = value;
            this.setDropAreaOptions();
        }
    }

    /**
     * Triggered when a file / files are selected via the file picker.
     */
    @Output() fileSelect = new EventEmitter<File[]>();

    /**
     * Triggered when a file / files are selected but do not fit the "accept" option.
     */
    @Output() fileSelectReject = new EventEmitter<File[]>();


    private _accept: string = '*';
    private _disabled = false;
    private _multiple = true;
    private _subscriptions: Subscription[] = [];


    constructor(@Optional() @Self() private dropArea: FileDropArea,
                private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (this.dropArea) {
            this.setDropAreaOptions();
            this._subscriptions = [
                Observable.merge(
                    this.dropArea.pageDragEnter,
                    this.dropArea.pageDragLeave,
                    this.dropArea.fileDragEnter,
                    this.dropArea.fileDragLeave
                ).subscribe(() => this.cd.markForCheck()),

                this.dropArea.fileDrop.subscribe((files: File[]) => {
                    this.fileSelect.emit(files);
                }),

                this.dropArea.fileDropReject.subscribe((files: File[]) => {
                    this.fileSelectReject.emit(files);
                })
            ];
// setInterval(() => console.log(this.dropArea.draggedOver), 300);
        }
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach(s => s.unsubscribe());
    }


    private onChange(event: Event, input: HTMLInputElement): void {
        let files = input && input.files;
        if (files && files.length) {
            let accepted: File[] = [];
            let rejected: File[] = [];
            Array.from(files).forEach(file => {
                (matchesMimeType(file.type, this._accept) ? accepted : rejected).push(file);
            });

            // Remove the Files from the input
            input.value = '';

            if (accepted) {
                this.fileSelect.emit(accepted);
            }
            if (rejected) {
                this.fileSelectReject.emit(rejected);
            }
        }
    }

    private setDropAreaOptions(): void {
        if (this.dropArea) {
            let options = this.dropArea.options || (this.dropArea.options = {});
            options.accept = this._accept;
            options.disabled = this._disabled;
            options.multiple = this._multiple;
        }
    }
}
