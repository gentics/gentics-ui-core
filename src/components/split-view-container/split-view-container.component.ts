import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';

// HACK: workaround for enum type. With TypeScript >= 1.8.0, use:
//   type FocusType: 'left' | 'right';
export class FocusType {
    static LEFT = <FocusType> (<any> 'left');
    static RIGHT = <FocusType> (<any> 'right');
}

/**
 * A container that provides a ["master-detail" interface](https://en.wikipedia.org/wiki/Master%E2%80%93detail_interface)
 * with two resizable panels denoted by the `left` and `right` attributes on its children.
 *
 * There should only be a single instance of SplitViewContainer used at a time, and it is intended to be the
 * main structural container of the "master/detail" part of the app - i.e. the content listing and editing view.
 *
 * ```html
 * <gtx-split-view-container class="split-view-container"
 *     [rightPanelVisible]="hasContent"
 *     [(focusedPanel)]="splitFocus">
 *
 *     <div class="list-pane" left>
 *         <!-- Left panel contents -->
 *     </div>
 *
 *     <div class="content-pane" right>
 *         <!-- Right panel contents -->
 *     </div>
 *
 * </gtx-split-view-container>
 * ```
 */
@Component({
    selector: 'gtx-split-view-container',
    template: require('./split-view-container.tpl.html')
})
export class SplitViewContainer implements AfterViewInit, OnDestroy {
    /**
     * Tells if a panel is opened on the right side in the split view.
     * Setting to false will also change {@link focusedPanel}.
     */
    @Input() get rightPanelVisible(): boolean {
        return this._rightPanelVisible;
    }
    set rightPanelVisible(visible: boolean) {
        if (visible != this._rightPanelVisible) {
            this._rightPanelVisible = visible;
            if (visible) {
                this.rightPanelOpened.emit(null);
            } else {
                this.rightPanelClosed.emit(null);
                if (this._focusedPanel == 'right') {
                    this._focusedPanel = 'left';
                    this.leftPanelFocused.emit(null);
                    this.focusedPanelChange.emit('left');
                }
            }
            this.rightPanelVisibleChange.emit(visible);
        }
    }

    /**
     * Tells the SplitViewContainer which side is focused.
     * Valid values are "left" and "right".
     */
    @Input()
    get focusedPanel(): FocusType {
        return this._focusedPanel;
    }
    set focusedPanel(panel: FocusType) {
        let newFocus: FocusType;
        if (panel == 'right' && this._rightPanelVisible) {
            newFocus = FocusType.RIGHT;
        } else {
            newFocus = FocusType.LEFT;
        }

        if (newFocus != this._focusedPanel) {
            this._focusedPanel = newFocus;

            if (newFocus == 'right') {
                this.rightPanelFocused.emit(null);
            } else {
                this.leftPanelFocused.emit(null);
            }
            this.focusedPanelChange.emit(newFocus);
        } else if (newFocus != panel) {
            this.focusedPanelChange.emit(newFocus);
        }
    }

    /**
     * Changes the container split in "large" layout.
     */
    @Input()
    leftContainerWidthPercent: number = 50;

    /**
     * The smallest panel size in percent the left
     * and right panels will shrink to when resizing.
     */
    @Input()
    minPanelSizePercent: number = 5;

    /**
     * The smallest panel size in pixels the left
     * and right panels will shrink to when resizing.
     */
    @Input()
    minPanelSizePixels: number = 20;


    /**
     * Triggers when the right panel is closed.
     */
    @Output()
    rightPanelClosed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the right panel is opened.
     */
    @Output()
    rightPanelOpened: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the value of {@link rightPanelVisible} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(rightPanelVisible)]="property">`
     */
    @Output()
    rightPanelVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Triggers when the left panel is focused.
     */
    @Output()
    leftPanelFocused: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the right panel is focused.
     */
    @Output()
    rightPanelFocused: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the value of {@link focusedPanel} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(focusedPanel)]="property">`
     */
    @Output()
    focusedPanelChange: EventEmitter<FocusType> = new EventEmitter<FocusType>();

    /**
     * Triggers when the user starts resizing the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    @Output()
    splitDragStart: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Triggers when the user resizes the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    @Output()
    splitDragEnd: EventEmitter<number> = new EventEmitter<number>();


    private _rightPanelVisible: boolean = false;
    private _focusedPanel: FocusType = 'left';
    private resizing: boolean = false;
    private resizeMouseOffset: number;
    private resizerXPosition: number;
    private boundBodyMouseUp: EventListener;
    private boundBodyMouseMove: EventListener;
    private hammerManager: HammerManager;

    @ViewChild('resizeContainer') private resizeContainer: ElementRef;
    @ViewChild('leftPanel') private leftPanel: ElementRef;
    @ViewChild('resizer') private resizer: ElementRef;

    constructor(private ownElement: ElementRef) {
    }

    // (hacky) After initializing the view, make this component fill the height of the viewport
    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        const element: HTMLElement = this.ownElement.nativeElement;
        const css: CSSStyleDeclaration = element.style;
        css.top = element.offsetTop + 'px';
        css.bottom = css.left = css.right = '0';
        css.position = 'absolute';

        this.initSwipeHandler();
    }

    ngOnDestroy(): void {
        this.unbindBodyEvents();
        this.destroySwipeHandler();
    }

    /**
     * Set up a Hammerjs-based swipe gesture handler to allow swiping between two panes.
     */
    private initSwipeHandler(): void {
        // set up swipe gesture handler
        this.hammerManager = new Hammer(this.ownElement.nativeElement);
        this.hammerManager.on('swipe', (e: HammerInput) => {
            if (e.pointerType === 'touch') {
                // Hammerjs represents directions with an enum,
                // 2 = left, 4 = right.
                if (e.direction === 4) {
                    this.leftPanelClicked();
                }
                if (e.direction === 2) {
                    this.rightPanelClicked();
                }
            }
        });
    }

    private destroySwipeHandler(): void {
        this.hammerManager.destroy();
    }

    private leftPanelClicked() {
        if (this._focusedPanel == FocusType.RIGHT) {
            this.focusedPanel = FocusType.LEFT;
        }
    }

    private rightPanelClicked() {
        if (this._focusedPanel == FocusType.LEFT && this._rightPanelVisible) {
            this.focusedPanel = FocusType.RIGHT;
        }
    }

    private startResizer(event: MouseEvent) {
        if (event.which != 1 || !this.leftPanel.nativeElement) { return; };
        event.preventDefault();

        const resizeHandle: HTMLElement = <HTMLElement> this.resizer.nativeElement;
        this.resizeMouseOffset = event.clientX - resizeHandle.getBoundingClientRect().left;

        // Bind mousemove and mouseup on body (the Angular2 way)
        this.boundBodyMouseMove = this.moveResizer.bind(this);
        this.boundBodyMouseUp = this.endResizing.bind(this);
        const body: HTMLBodyElement = DOM.query('body');
        DOM.addClass(body, 'gtx-split-view-container-resizing');
        body.addEventListener('mousemove', this.boundBodyMouseMove);
        body.addEventListener('mouseup', this.boundBodyMouseUp);

        // Start resizing
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.resizing = true;
        this.splitDragStart.emit(this.resizerXPosition);
    }

    private moveResizer(event: MouseEvent) {
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
    }

    private endResizing(event: MouseEvent) {
        this.leftContainerWidthPercent = this.getAdjustedPosition(event.clientX);
        this.resizing = false;
        this.unbindBodyEvents();
        this.splitDragEnd.emit(this.leftContainerWidthPercent);
    }

    private unbindBodyEvents(): void {
        if (this.boundBodyMouseMove) {
            const body: HTMLBodyElement = DOM.query('body');
            DOM.removeClass(body, 'gtx-split-view-container-resizing');
            body.removeEventListener('mousemove', this.boundBodyMouseMove);
            body.removeEventListener('mouseup', this.boundBodyMouseUp);
            this.boundBodyMouseMove = null;
            this.boundBodyMouseUp = null;
        }
    }

    /**
     * Helper function to keep the resize functionality
     * within its limits (minPanelSizePixels & minPanelSizePercent).
     * @return {number} Returns the adjusted X position in % of the container width.
     */
    private getAdjustedPosition(mouseClientX: number): number {
        const container: HTMLElement = <HTMLElement> this.resizeContainer.nativeElement;
        const containerOffset: number = container.getBoundingClientRect().left;
        const containerWidth: number = container.clientWidth;
        const resizerWidth: number = (<HTMLElement> this.resizer.nativeElement).offsetWidth;
        const maxXPixels: number = containerWidth - resizerWidth - this.minPanelSizePixels;
        const maxXPercent: number = 100 * (1 - resizerWidth / containerWidth) - this.minPanelSizePercent;

        let relativeX: number = mouseClientX - this.resizeMouseOffset - containerOffset;
        if (relativeX < this.minPanelSizePixels) {
            relativeX = this.minPanelSizePixels;
        } else if (relativeX > maxXPixels) {
            relativeX = maxXPixels;
        }

        let percentX: number = 100 * (relativeX / containerWidth);
        if (percentX < this.minPanelSizePercent) {
            percentX = this.minPanelSizePercent;
        } else if (percentX > maxXPercent) {
            percentX = maxXPercent;
        }

        return percentX;
    }
}
