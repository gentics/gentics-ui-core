import {Component, HostListener, EventEmitter} from '@angular/core';

/**
 * The scroll mask is a transparent div covering the entire viewport which is intended to prevent scrolling.
 */
@Component({
    selector: 'gtx-scroll-mask',
    template: ``
})
export class ScrollMask {
    close = new EventEmitter<any>();

    @HostListener('click')
    clicked(): void {
        this.close.emit(true);
    }
}
