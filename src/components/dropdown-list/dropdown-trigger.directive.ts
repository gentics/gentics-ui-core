import {Directive, ElementRef} from '@angular/core';

export const FOCUSABLE_SELECTOR = `gtx-dropdown-item, a[href], area[href], input:not([disabled]), select:not([disabled]), 
    textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]`;

@Directive({
    selector: 'gtx-dropdown-trigger'
})
export class DropdownTriggerDirective {
    constructor(public elementRef: ElementRef) {}

    /**
     * Focus the first focusable descendant of this element.
     */
    focus(): void {
        const focusable = this.elementRef.nativeElement.querySelector(FOCUSABLE_SELECTOR);
        if (focusable && focusable.focus) {
            focusable.focus();
        }
    }
}
