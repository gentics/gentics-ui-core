import {Component, HostListener, EventEmitter} from '@angular/core';

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
