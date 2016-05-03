import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
export declare type FocusType = 'left' | 'right';
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
export declare class SplitViewContainer implements AfterViewInit, OnDestroy {
    private ownElement;
    /**
     * Tells if a panel is opened on the right side in the split view.
     * Setting to false will also change {@link focusedPanel}.
     */
    rightPanelVisible: boolean;
    /**
     * Tells the SplitViewContainer which side is focused.
     * Valid values are "left" and "right".
     */
    focusedPanel: FocusType;
    /**
     * Changes the container split in "large" layout.
     */
    leftContainerWidthPercent: number;
    /**
     * The smallest panel size in percent the left
     * and right panels will shrink to when resizing.
     */
    minPanelSizePercent: number;
    /**
     * The smallest panel size in pixels the left
     * and right panels will shrink to when resizing.
     */
    minPanelSizePixels: number;
    /**
     * Triggers when the right panel is closed.
     */
    rightPanelClosed: EventEmitter<void>;
    /**
     * Triggers when the right panel is opened.
     */
    rightPanelOpened: EventEmitter<void>;
    /**
     * Triggers when the value of {@link rightPanelVisible} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(rightPanelVisible)]="property">`
     */
    rightPanelVisibleChange: EventEmitter<boolean>;
    /**
     * Triggers when the left panel is focused.
     */
    leftPanelFocused: EventEmitter<void>;
    /**
     * Triggers when the right panel is focused.
     */
    rightPanelFocused: EventEmitter<void>;
    /**
     * Triggers when the value of {@link focusedPanel} changes.
     * Allows to double-bind the property.
     * `<split-view-container [(focusedPanel)]="property">`
     */
    focusedPanelChange: EventEmitter<FocusType>;
    /**
     * Triggers when the user starts resizing the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    splitDragStart: EventEmitter<number>;
    /**
     * Triggers when the user resizes the split amount between the panels.
     * Receives the size of the left panel in % of the container width as argument.
     */
    splitDragEnd: EventEmitter<number>;
    private _rightPanelVisible;
    private _focusedPanel;
    private resizing;
    private resizeMouseOffset;
    private resizerXPosition;
    private boundBodyMouseUp;
    private boundBodyMouseMove;
    private hammerManager;
    private resizeContainer;
    private leftPanel;
    private rightPanel;
    private resizer;
    constructor(ownElement: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Set the scrollTop of the left panel
     */
    scrollLeftPanelTo(scrollTop: number): void;
    /**
     * Set the scrollTop of the right panel
     */
    scrollRightPanelTo(scrollTop: number): void;
    /**
     * Set up a Hammerjs-based swipe gesture handler to allow swiping between two panes.
     */
    private initSwipeHandler();
    private destroySwipeHandler();
    private leftPanelClicked();
    private rightPanelClicked();
    private startResizer(event);
    private moveResizer(event);
    private endResizing(event);
    private unbindBodyEvents();
    /**
     * Helper function to keep the resize functionality
     * within its limits (minPanelSizePixels & minPanelSizePercent).
     * @return {number} Returns the adjusted X position in % of the container width.
     */
    private getAdjustedPosition(mouseClientX);
}
