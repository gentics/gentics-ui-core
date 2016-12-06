import {Directive, HostListener, Input, OnDestroy} from '@angular/core';

import {PageFileDragHandler} from './page-file-drag-handler.service';
import {DragStateTrackerFactory} from './drag-state-tracker.service';
import {getDataTransfer, transferHasFiles} from './drag-drop-utils';

/**
 * Prevents accidentally dropping files outside of a {@link FileDropArea}
 */
@Directive({
    selector: '[gtxPreventFileDrop]',
    providers: [PageFileDragHandler, DragStateTrackerFactory]
})
export class PreventFileDrop implements OnDestroy {

    prevent: boolean | 'page' = true;

    constructor(private dragHandler: PageFileDragHandler) { }

    ngOnDestroy(): void {
        this.dragHandler.preventFileDropOnPageFor(this, false);
    }

    @Input() set gtxPreventFileDrop(val: boolean | 'true' | 'false' | 'page') {
        let mode: boolean | 'page' = val === 'page' ? 'page' : (val !== false && val !== 'false');
        if (mode != this.prevent) {
            this.dragHandler.preventFileDropOnPageFor(this, mode === 'page');
            this.prevent = mode;
        }
    }

    @HostListener('dragenter', ['$event'])
    @HostListener('dragover', ['$event'])
    @HostListener('drop', ['$event'])
    preventAccidentalDrop(event: Event): void {
        if (this.prevent !== true || event.defaultPrevented) { return; }
        let dataTransfer = getDataTransfer(event);
        if (transferHasFiles(dataTransfer)) {
            event.preventDefault();
            dataTransfer.effectAllowed = 'none';
            dataTransfer.dropEffect = 'none';
        }
    }
}
