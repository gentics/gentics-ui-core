import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';

declare var $: JQueryStatic;

export type FocusType = 'left' | 'right';

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
            newFocus = 'right';
        } else {
            newFocus = 'left';
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
    rightPanelClosed = new EventEmitter<void>(true);

    /**
     * Triggers when the right panel is opened.
     */
    @Output()
    rightPanelOpened = new EventEmitter<void>(true);

    /**
     * Triggers when the value of {@link rightPanelVisible} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(rightPanelVisible)]="property">`
     */
    @Output()
    rightPanelVisibleChange = new EventEmitter<boolean>(true);

    /**
     * Triggers when the left panel is focused.
     */
    @Output()
    leftPanelFocused = new EventEmitter<void>(true);

    /**
     * Triggers when the right panel is focused.
     */
    @Output()
    rightPanelFocused = new EventEmitter<void>(true);

    /**
     * Triggers when the value of {@link focusedPanel} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(focusedPanel)]="property">`
     */
    @Output()
    focusedPanelChange = new EventEmitter<FocusType>(true);

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


    private _rightPanelVisible: boolean = false;
    private _focusedPanel: FocusType = 'left';
    private resizing: boolean = false;
    private resizeMouseOffset: number;
    private boundBodyMouseUp: EventListener;
    private boundBodyMouseMove: EventListener;
    private hammerManager: HammerManager;

    @ViewChild('resizeContainer') private resizeContainer: ElementRef;
    @ViewChild('leftPanel') private leftPanel: ElementRef;
    @ViewChild('rightPanel') private rightPanel: ElementRef;
    @ViewChild('resizer') private resizer: ElementRef;
    @ViewChild('visibleResizer') private visibleResizer: ElementRef;

    constructor(private ownElement: ElementRef,
                private changeDetector: ChangeDetectorRef) { }

    // (hacky) After initializing the view, make this component fill the height of the viewport
    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        // inside a setTimeout to allow any layout changes to stabilize (e.g. divs with ngIf showing/hiding)
        // before we calculate the final position of the SplitViewContainer
        setTimeout(() => {
            const element: HTMLElement = this.ownElement.nativeElement;
            const css: CSSStyleDeclaration = element.style;
            css.top = element.offsetTop + 'px';
            css.bottom = css.left = css.right = '0';
            css.position = 'absolute';
        });
        this.initSwipeHandler();
    }

    ngOnDestroy(): void {
        this.unbindBodyEvents();
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

    private leftPanelClicked(): void {
        if (this._focusedPanel == 'right') {
            this.focusedPanelChange.emit('left');
            this.changeDetector.markForCheck();
        }
    }

    private rightPanelClicked(): void {
        if (this._focusedPanel == 'left' && this._rightPanelVisible) {
            this.focusedPanelChange.emit('right');
            this.changeDetector.markForCheck();
        }
    }

    private startResizer(event: MouseEvent): void {
        if (event.which != 1 || !this.leftPanel.nativeElement) { return; }
        event.preventDefault();

        const resizeHandle: HTMLElement = <HTMLElement> this.resizer.nativeElement;
        this.resizeMouseOffset = event.clientX - resizeHandle.getBoundingClientRect().left;

        // Bind mousemove and mouseup on body (the Angular2 way)
        this.boundBodyMouseMove = this.moveResizer.bind(this);
        this.boundBodyMouseUp = this.endResizing.bind(this);
        const $body: JQuery = $('body');
        $body.addClass('gtx-split-view-container-resizing');
        $body.on('mousemove', this.boundBodyMouseMove);
        $body.on('mouseup', this.boundBodyMouseUp);

        // Start resizing
        let resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.resizing = true;
        this.visibleResizer.nativeElement.style.left = resizerXPosition + '%';
        this.changeDetector.markForCheck();
        this.splitDragStart.emit(resizerXPosition);
    }

    private moveResizer(event: MouseEvent): void {
        let resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.visibleResizer.nativeElement.style.left = resizerXPosition + '%';
    }

    private endResizing(event: MouseEvent): void {
        this.leftContainerWidthPercent = this.getAdjustedPosition(event.clientX);
        this.resizing = false;
        this.changeDetector.markForCheck();
        this.unbindBodyEvents();
        this.splitDragEnd.emit(this.leftContainerWidthPercent);
    }

    private unbindBodyEvents(): void {
        if (this.boundBodyMouseMove) {
            const $body: JQuery = $('body');
            $body.removeClass('gtx-split-view-container-resizing');
            $body.off('mousemove', this.boundBodyMouseMove);
            $body.off('mouseup', this.boundBodyMouseUp);
            this.boundBodyMouseMove = undefined;
            this.boundBodyMouseUp = undefined;
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
