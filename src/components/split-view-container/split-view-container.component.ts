import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';

// Hammerjs always creates a global Hammer, see https://github.com/hammerjs/hammer.js/issues/1027
require('hammerjs');

export type FocusType = 'left' | 'right';

export const CURSOR_STYLE_CLASS = 'gtx-split-view-container-resizing';

/**
 * A container that provides a ["master-detail" interface](https://en.wikipedia.org/wiki/Master%E2%80%93detail_interface)
 * with two resizable panels denoted by the `left` and `right` attributes on its children.
 *
 * There should only be a single instance of SplitViewContainer used at a time, and it is intended to be the
 * main structural container of the "master/detail" part of the app - i.e. the content listing and editing view.
 *
 * ```html
 * <gtx-split-view-container
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
 *
 * ##### Setting Scroll Positions
 *
 * The SplitViewContainer instance exposes two public methods which can be used to manually set the `scrollTop`
 * property of either the right or left panels: `.scrollLeftPanelTo()` and `.scrollRightPanelTo()`.
 *
 * This can be used, for example, to scroll the contents pane (right panel) back to the top when the route changes.
 * An example usage follows:
 *
 * ```typescript
 * export class App {
 *   @ViewChild(SplitViewContainer)
 *   private splitViewContainer: SplitViewContainer;
 *
 *   constructor(private router: Router) {
 *       this.subscription = router.subscribe(() => {
 *           // scroll the right panel to the top whenever
 *           // the route changes.
 *           this.splitViewContainer.scrollRightPanelTo(0);
 *       });
 *   }
 * }
 * ```
 */
@Component({
    selector: 'gtx-split-view-container',
    templateUrl: './split-view-container.tpl.html'
})
export class SplitViewContainer implements AfterViewInit, OnChanges, OnDestroy {
    /**
     * Tells if a panel is opened on the right side in the split view.
     * Setting to false will also change {@link focusedPanel}.
     */
    @Input() rightPanelVisible: boolean;

    /**
     * Tells the SplitViewContainer which side should be focused.
     * Can be used to double-bind the property:
     * `<split-view-container [(focusedPanel)]="property">`
     */
    @Input() focusedPanel: 'left' | 'right' = 'left';

    /**
     * Width of the left panel in "large" layout in percent of the container width.
     * Use to control split percentage from the parent by double-binding with {@link splitChange}:
     * `<gtx-split-view-container [(split)]="leftWidthPercent">...</gtx-split-view-container>`
     */
    @Input()
    split: number;

    /** Initial width of the left panel in "large" layout in percent of the container width. */
    @Input()
    initialSplit: number = 50;

    /**
     * Emits when the split between the panels is changed. Allows double-binding:
     * `<split-view-container [(split)]="leftWidth">...</split-view-container>`
     */
    @Output()
    splitChange = new EventEmitter<number>();

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
    rightPanelClosed = new EventEmitter<void>(true);

    /**
     * Triggers when the right panel is opened.
     */
    @Output()
    rightPanelOpened = new EventEmitter<void>(true);

    /**
     * Triggers when the left panel is focused.
     */
    @Output()
    leftPanelFocused = new EventEmitter<void>();

    /**
     * Triggers when the right panel is focused.
     */
    @Output()
    rightPanelFocused = new EventEmitter<void>();

    /**
     * Triggers when the focused panel changes.
     * Can be used to double-bind the property:
     * `<split-view-container [(focusedPanel)]="property">`
     */
    @Output()
    focusedPanelChange = new EventEmitter<'left' | 'right'>();

    /**
     * Triggers when the user starts resizing the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    @Output()
    splitDragStart = new EventEmitter<number>(true);

    /**
     * Triggers when the user resizes the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    @Output()
    splitDragEnd = new EventEmitter<number>(true);

    /** @internal EventTarget for tracking when the mouse leaves the page. */
    globalEventTarget: any = window.document;

    /** @internal The Element to which cursor styles are applied. */
    globalCursorStyleTarget: any = window.document && window.document.body;

    @ViewChild('resizeContainer') resizeContainer: ElementRef;
    @ViewChild('leftPanel') leftPanel: ElementRef;
    @ViewChild('rightPanel') rightPanel: ElementRef;
    @ViewChild('resizer') resizer: ElementRef;
    @ViewChild('visibleResizer') visibleResizer: ElementRef;

    resizing: boolean = false;

    // Actual value used in the template. If the focus is set to the right panel,
    // but the right panel has no content, the left panel is focused instead.
    rightPanelActuallyFocused: boolean = false;

    /**
     * When split is passed by the parent component, only emit events on resize.
     * Otherwise, the width is managed by the SplitViewContainer.
     */
    private widthHandledExternally = false;

    /**
     * To prevent race conditions by click events, do not emit a focusedPanelChange
     * when the last change detection changed the focus. Example:
     *  1. element in left panel is clicked, sets focus to "right"
     *  2. click event bubbles to the SplitViewContainer, leftPanelClicked
     *  3. focus would be set to the left panel again, but should be ignored
     */
    private focusJustChanged = false;
    private focusJustChangedTimeout: number;

    private resizeMouseOffset: number;
    private hammerManager: HammerManager;
    private cleanups: Function[] = [];

    constructor(private ownElement: ElementRef,
                private changeDetector: ChangeDetectorRef,
                private renderer: Renderer2) { }

    ngOnInit(): void {
        if (!this.split) {
            this.split = this.initialSplit;
        }
    }

    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }

        // Allow any layout changes to stabilize (e.g. divs with ngIf showing/hiding)
        // before we calculate the final position of the SplitViewContainer
        const timeout = setTimeout(() => this.fitContainerToViewport());
        this.cleanups.push(() => clearTimeout(timeout));

        this.initSwipeHandler();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['focusedPanel'] || changes['rightPanelVisible']) {
            // Prevent an invalid state where the SplitViewContainer
            // has no right panel, but the right panel should be focused.
            const shouldFocusRightPanel = this.focusedPanel === 'right' && this.rightPanelVisible;

            if (shouldFocusRightPanel !== this.rightPanelActuallyFocused) {
                this.rightPanelActuallyFocused = shouldFocusRightPanel;

                if (shouldFocusRightPanel) {
                    this.rightPanelFocused.emit();
                } else {
                    this.leftPanelFocused.emit();
                }

                clearTimeout(this.focusJustChangedTimeout);
                this.focusJustChanged = true;
                this.focusJustChangedTimeout = setTimeout(() => {
                    this.focusJustChanged = false;
                }, 50);
            }
        }

        const rightPanelVisibleChange = changes['rightPanelVisible'];
        if (rightPanelVisibleChange && !rightPanelVisibleChange.isFirstChange()) {
            if (rightPanelVisibleChange.currentValue) {
                this.rightPanelOpened.emit();
            } else {
                this.rightPanelClosed.emit();
            }
        }

        if (changes['split']) {
            this.widthHandledExternally = true;
        }
    }

    ngOnDestroy(): void {
        this.cleanups.forEach(cleanup => cleanup());
        this.cleanups = [];
        clearTimeout(this.focusJustChangedTimeout);
        this.destroySwipeHandler();
    }

    /**
     * Set the scrollTop of the left panel
     */
    public scrollLeftPanelTo(scrollTop: number): void {
        this.leftPanel.nativeElement.scrollTop = scrollTop;
    }

    /**
     * Set the scrollTop of the right panel
     */
    public scrollRightPanelTo(scrollTop: number): void {
        this.rightPanel.nativeElement.scrollTop = scrollTop;
    }

    leftPanelClicked(): void {
        if (this.rightPanelActuallyFocused && !this.focusJustChanged) {
            this.focusedPanelChange.emit('left');
        }
    }

    rightPanelClicked(): void {
        if (!this.rightPanelActuallyFocused && !this.focusJustChanged && this.rightPanelVisible) {
            this.focusedPanelChange.emit('right');
        }
    }

    startResizer(event: MouseEvent): void {
        if (event.which != 1 || !this.leftPanel.nativeElement) { return; }
        event.preventDefault();

        const resizeHandle = <HTMLElement & { setCapture(): void, releaseCapture(): void }> event.currentTarget;
        this.resizeMouseOffset = event.clientX - resizeHandle.getBoundingClientRect().left;

        let mouseMoveTarget = this.globalEventTarget;

        // Use setCapture on older browsers, document:mousemove on newer browsers
        if (resizeHandle.setCapture) {
            mouseMoveTarget = resizeHandle;
            resizeHandle.setCapture();
            this.cleanups.push(() => resizeHandle.releaseCapture());
            this.cleanups.push(this.renderer.listen(resizeHandle, 'losecapture', this.endResizing));
        }

        // Set cursor styles & bind events on document (the Angular way)
        this.renderer.addClass(this.globalCursorStyleTarget, CURSOR_STYLE_CLASS);
        this.cleanups.push(
            () => this.renderer.removeClass(this.globalCursorStyleTarget, CURSOR_STYLE_CLASS),
            this.renderer.listen(mouseMoveTarget, 'mousemove', this.moveResizer),
            this.renderer.listen(this.globalEventTarget, 'mouseup', this.endResizing)
        );

        // Start resizing
        let resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.resizing = true;
        this.visibleResizer.nativeElement.style.left = resizerXPosition + '%';
        this.changeDetector.markForCheck();
        this.splitDragStart.emit(resizerXPosition);
    }

    /**
     * (hacky) After initializing the view, make this component fill the height of the viewport.
     * Only applied if the split-view-container element is not styled in the consuming application.
     */
    private fitContainerToViewport(): void {
        const element: HTMLElement = this.ownElement.nativeElement;
        if ((element.firstElementChild as HTMLElement).offsetParent !== element) {
            const css: CSSStyleDeclaration = element.style;
            css.top = element.offsetTop + 'px';
            css.bottom = css.left = css.right = '0';
            css.position = 'absolute';
        }
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

    private moveResizer = (event: MouseEvent) => {
        let resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.visibleResizer.nativeElement.style.left = resizerXPosition + '%';
    }

    private endResizing = (event: MouseEvent) => {
        const adjustedWith = this.getAdjustedPosition(event.clientX);
        this.splitChange.emit(adjustedWith);
        if (!this.widthHandledExternally) {
            this.split = adjustedWith;
        }

        this.resizing = false;
        this.changeDetector.markForCheck();
        this.cleanups.forEach(cleanup => cleanup());
        this.cleanups = [];
        this.splitDragEnd.emit(this.split);
    }

    /**
     * Helper function to keep the resize functionality
     * within its limits (minPanelSizePixels & minPanelSizePercent).
     * @return Returns the adjusted X position in % of the container width.
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
