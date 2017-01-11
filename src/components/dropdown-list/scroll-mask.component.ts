import {Component, HostListener, EventEmitter} from '@angular/core';

/**
 * The scroll mask is a transparent div covering the entire viewport which is intended to prevent scrolling.
 */
@Component({
    selector: 'gtx-scroll-mask',
    template: ``
})
export class ScrollMask {
    clicked = new EventEmitter<any>();

    @HostListener('click')
    clickHandler(): void {
        this.clicked.emit(true);
    }
}
