import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output
} from 'angular2/core';

@Component({
    selector: 'gtx-split-view-container',
    template: require('./split-view-container.tpl.html')
})
export class SplitViewContainer implements AfterViewInit {
    /**
     * Tells if a content panel is opened on the right side in the split view.
     * Setting to false will also change [contentFocused]{@link SplitViewContainer#contentFocused}.
     */
    @Input()
    @HostBinding('class.hasContent')
    set hasContent(content: boolean) {
        if (content != this._hasContentPanel) {
            this._hasContentPanel = content;
            if (content) {
                this.contentPanelOpened.emit(null);
            } else {
                this.contentPanelClosed.emit(null);
                if (!content && this._contentFocused) {
                    this._contentFocused = false;
                    this.listPanelFocused.emit(null);
                }
            }
        }
    }
    get hasContent(): boolean {
        return this._hasContentPanel;
    }

    /**
     * Brings the content panel to the foreground or background.
     */
    @Input()
    @HostBinding('class.contentFocused')
    set contentFocused(focused: boolean) {
        focused = focused && this._hasContentPanel;
        if (focused != this._contentFocused) {
            this._contentFocused = focused;
            if (focused) {
                this.contentPanelFocused.emit(null);
            } else {
                this.listPanelFocused.emit(null);
            }
        }
    }
    get contentFocused(): boolean {
        return this._contentFocused;
    }

    /**
     * Triggers when the content panel is closed.
     */
    @Output()
    contentPanelClosed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the content panel is closed.
     */
    @Output()
    contentPanelOpened: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the list panel is focused.
     */
    @Output()
    listPanelFocused: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the content panel is focused.
     */
    @Output()
    contentPanelFocused: EventEmitter<void> = new EventEmitter<void>();


    private _hasContentPanel: boolean = false;
    private _contentFocused: boolean = false;

    constructor(private ownElement: ElementRef) {
    }

    toggleContentPanel(): void {
        this.hasContent = !this.hasContent;
    }

    toggleFocus(): void {
        this.contentFocused = !this.contentFocused;
    }

    // (hacky) After initializing the view, make this component fill the height of the viewport
    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        let element: HTMLElement = this.ownElement.nativeElement;
        let css: CSSStyleDeclaration = element.style;
        css.top = element.offsetTop + 'px';
        css.position = 'absolute';
        css.bottom = '0';
    }
}
