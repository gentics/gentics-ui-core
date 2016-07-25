import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Optional, Output, Self, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {Button} from '../button/button.component';
import {FileDropArea} from '../file-drop-area/file-drop-area.directive';
import {PageDragDropFileHandler} from '../file-drop-area/page-drag-drop-file-handler.service';
import {matchesMimeType} from '../file-drop-area/matches-mime-type';


/**
 * A file picker component.
 *
 * ```html
 * <gtx-file-picker></gtx-file-picker>
 * ```
 */
@Component({
    selector: 'gtx-file-picker',
    template: require('./file-picker.tpl.html'),
    directives: [Button, FileDropArea],
    host: {
        '[class.dragged-over]': 'dropArea && dropArea.isDraggedOver',
        '[class.would-accept]': 'dropArea && dropArea.fileDraggedInPage && !dropArea.isDraggedOver'
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
    @Output() fileReject = new EventEmitter<File[]>();



    private _accept: string = '*';
    private _disabled = false;
    private _multiple = true;
    private _subscription: Subscription;
    @ViewChild('nativeInput') private _nativeInput: HTMLInputElement;

    constructor(@Optional() @Self() private dropArea: FileDropArea,
                private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.setDropAreaOptions();
        if (this.dropArea) {
            this._subscription = Observable.merge(
                this.dropArea.pageDragEnter,
                this.dropArea.pageDragLeave,
                this.dropArea.fileDragEnter,
                this.dropArea.fileDragLeave
            ).subscribe(() => this.cd.markForCheck());
        }
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    private onChange(event: Event): void {
        let files = this._nativeInput && this._nativeInput.files;
        if (files) {
            let accepted: File[] = [];
            let rejected: File[] = [];
            Array.from(files).forEach(file => {
                (matchesMimeType(file.type, this._accept) ? accepted : rejected).push(file);
            });

            if (accepted) {
                this.fileSelect.emit(accepted);
            }
            if (rejected) {
                this.fileReject.emit(rejected);
            }
        }
    }

    private setDropAreaOptions(): void {
        if (this.dropArea) {
            this.dropArea.options.accept = this._accept;
            this.dropArea.options.disabled = this._disabled;
            this.dropArea.options.multiple = this._multiple;
        }
    }
}
