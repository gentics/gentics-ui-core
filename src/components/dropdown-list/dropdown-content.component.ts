import {Component, ContentChildren, HostListener, EventEmitter, forwardRef, QueryList, ElementRef} from '@angular/core';
import {DropdownItem} from './dropdown-item.component';
import {KeyCode} from '../../common/keycodes';
import {FOCUSABLE_SELECTOR} from './dropdown-trigger.directive';

/**
 * Wraps the content and handles keyboard control (tabbing and focus) of the contents.
 */
@Component({
    selector: 'gtx-dropdown-content',
    template: `<ng-content></ng-content>`
})
export class DropdownContent {
    focusLost = new EventEmitter<boolean>();
    focusableItems: HTMLElement[] = [];

    @ContentChildren(forwardRef(() => DropdownItem), { read: ElementRef }) items: QueryList<ElementRef>;

    constructor(public elementRef: ElementRef) {}

    @HostListener('keydown', ['$event'])
    keyHandler(e: KeyboardEvent): void {
        if (e.keyCode === KeyCode.Tab) {
            if (e.shiftKey) {
                this.focusPrevious(e.target as HTMLElement, e);
            } else {
                this.focusNext(e.target as HTMLElement, e);
            }
        }
    }

    ngAfterContentInit(): void {
        this.focusableItems = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll(FOCUSABLE_SELECTOR));
    }

    focusFirstItem(): void {
        const firstItem = this.focusableItems[0];
        if (firstItem && firstItem.focus) {
            firstItem.focus();
        }
    }

    focusNext(currentElement: HTMLElement, e: KeyboardEvent): void {
        const items = this.focusableItems;
        const index = this.getIndexOfElement(currentElement);
        if (index === items.length - 1) {
            e.preventDefault();
            this.focusLost.emit(true);
        }
    }

    focusPrevious(currentElement: HTMLElement, e: KeyboardEvent): void {
        const index = this.getIndexOfElement(currentElement);
        if (index === 0) {
            e.preventDefault();
            this.focusLost.emit(true);
        }
    }

    private getIndexOfElement(element: HTMLElement): number {
        return this.focusableItems.indexOf(element);
    }
}
