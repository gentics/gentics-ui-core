import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';

/**
 * Handles autofocus for all ui-core form elements.
 */
@Directive({
    selector: `
        gtx-button[autofocus],
        gtx-checkbox[autofocus],
        gtx-date-time-picker[autofocus],
        gtx-file-picker[autofocus],
        gtx-input[autofocus],
        gtx-radio-button[autofocus],
        gtx-search-bar[autofocus],
        gtx-select[autofocus],
        gtx-textarea[autofocus]`
})
export class AutofocusDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() get autofocus(): boolean {
        return this._autofocus;
    }
    set autofocus(value: boolean) {
        this._autofocus = value != null && value !== false;
    }

    private _autofocus: boolean = false;
    private inputElement: HTMLButtonElement | HTMLInputElement | HTMLDivElement | HTMLTextAreaElement;
    private timeout: number;


    constructor(private element: ElementRef) { }

    ngAfterViewInit(): void {
        if (this.element && this.element.nativeElement) {
            this.inputElement = this.element.nativeElement.querySelector('input, .select-input, textarea, button');

            if (this._autofocus) {
                if (!(this.inputElement instanceof HTMLDivElement)) {
                    this.inputElement.autofocus = true;
                }
                this.focusNativeInput();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change = changes['autofocus'];
        if (change && this.inputElement) {
            if (!(this.inputElement instanceof HTMLDivElement)) {
                this.inputElement.autofocus = change.currentValue;
            }
        }
    }

    ngOnDestroy(): void {
        this.cleanupTimer();
        this.inputElement = undefined;
    }

    // HTML autofocus does not work with ngIf or modals.
    // Therefore, the input element is focused programatically.
    private focusNativeInput(): void {
        this.cleanupTimer();
        this.timeout = setTimeout(() => {
            this.inputElement.focus();

            if (typeof (<any> HTMLInputElement.prototype).scrollIntoViewIfNeeded === 'function') {
                (<any> this.inputElement).scrollIntoViewIfNeeded();
            } else {
                this.inputElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        });
    }

    private cleanupTimer(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }
}
