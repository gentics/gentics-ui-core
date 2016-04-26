"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
// HACK: workaround for enum type. With TypeScript >= 1.8.0, use:
//   type FocusType: 'left' | 'right';
var FocusType = (function () {
    function FocusType() {
    }
    FocusType.LEFT = 'left';
    FocusType.RIGHT = 'right';
    return FocusType;
}());
exports.FocusType = FocusType;
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
var SplitViewContainer = (function () {
    function SplitViewContainer(ownElement) {
        this.ownElement = ownElement;
        /**
         * Changes the container split in "large" layout.
         */
        this.leftContainerWidthPercent = 50;
        /**
         * The smallest panel size in percent the left
         * and right panels will shrink to when resizing.
         */
        this.minPanelSizePercent = 5;
        /**
         * The smallest panel size in pixels the left
         * and right panels will shrink to when resizing.
         */
        this.minPanelSizePixels = 20;
        /**
         * Triggers when the right panel is closed.
         */
        this.rightPanelClosed = new core_1.EventEmitter();
        /**
         * Triggers when the right panel is opened.
         */
        this.rightPanelOpened = new core_1.EventEmitter();
        /**
         * Triggers when the value of {@link rightPanelVisible} changes.
         * Allows to double-bind the property.
         * `<split-view-container [(rightPanelVisible)]="property">`
         */
        this.rightPanelVisibleChange = new core_1.EventEmitter();
        /**
         * Triggers when the left panel is focused.
         */
        this.leftPanelFocused = new core_1.EventEmitter();
        /**
         * Triggers when the right panel is focused.
         */
        this.rightPanelFocused = new core_1.EventEmitter();
        /**
         * Triggers when the value of {@link focusedPanel} changes.
         * Allows to double-bind the property.
         * `<split-view-container [(focusedPanel)]="property">`
         */
        this.focusedPanelChange = new core_1.EventEmitter();
        /**
         * Triggers when the user starts resizing the split amount between the panels.
         * Receives the size of the left panel in % of the container width as argument.
         */
        this.splitDragStart = new core_1.EventEmitter();
        /**
         * Triggers when the user resizes the split amount between the panels.
         * Receives the size of the left panel in % of the container width as argument.
         */
        this.splitDragEnd = new core_1.EventEmitter();
        this._rightPanelVisible = false;
        this._focusedPanel = 'left';
        this.resizing = false;
    }
    Object.defineProperty(SplitViewContainer.prototype, "rightPanelVisible", {
        /**
         * Tells if a panel is opened on the right side in the split view.
         * Setting to false will also change {@link focusedPanel}.
         */
        get: function () {
            return this._rightPanelVisible;
        },
        set: function (visible) {
            if (visible != this._rightPanelVisible) {
                this._rightPanelVisible = visible;
                if (visible) {
                    this.rightPanelOpened.emit(null);
                }
                else {
                    this.rightPanelClosed.emit(null);
                    if (this._focusedPanel == 'right') {
                        this._focusedPanel = 'left';
                        this.leftPanelFocused.emit(null);
                        this.focusedPanelChange.emit('left');
                    }
                }
                this.rightPanelVisibleChange.emit(visible);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitViewContainer.prototype, "focusedPanel", {
        /**
         * Tells the SplitViewContainer which side is focused.
         * Valid values are "left" and "right".
         */
        get: function () {
            return this._focusedPanel;
        },
        set: function (panel) {
            var newFocus;
            if (panel == 'right' && this._rightPanelVisible) {
                newFocus = FocusType.RIGHT;
            }
            else {
                newFocus = FocusType.LEFT;
            }
            if (newFocus != this._focusedPanel) {
                this._focusedPanel = newFocus;
                if (newFocus == 'right') {
                    this.rightPanelFocused.emit(null);
                }
                else {
                    this.leftPanelFocused.emit(null);
                }
                this.focusedPanelChange.emit(newFocus);
            }
            else if (newFocus != panel) {
                this.focusedPanelChange.emit(newFocus);
            }
        },
        enumerable: true,
        configurable: true
    });
    // (hacky) After initializing the view, make this component fill the height of the viewport
    SplitViewContainer.prototype.ngAfterViewInit = function () {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        var element = this.ownElement.nativeElement;
        var css = element.style;
        css.top = element.offsetTop + 'px';
        css.bottom = css.left = css.right = '0';
        css.position = 'absolute';
        this.initSwipeHandler();
    };
    SplitViewContainer.prototype.ngOnDestroy = function () {
        this.unbindBodyEvents();
        this.destroySwipeHandler();
    };
    /**
     * Set the scrollTop of the left panel
     */
    SplitViewContainer.prototype.scrollLeftPanelTo = function (scrollTop) {
        this.leftPanel.nativeElement.scrollTop = scrollTop;
    };
    /**
     * Set the scrollTop of the right panel
     */
    SplitViewContainer.prototype.scrollRightPanelTo = function (scrollTop) {
        this.rightPanel.nativeElement.scrollTop = scrollTop;
    };
    /**
     * Set up a Hammerjs-based swipe gesture handler to allow swiping between two panes.
     */
    SplitViewContainer.prototype.initSwipeHandler = function () {
        var _this = this;
        // set up swipe gesture handler
        this.hammerManager = new Hammer(this.ownElement.nativeElement);
        this.hammerManager.on('swipe', function (e) {
            if (e.pointerType === 'touch') {
                // Hammerjs represents directions with an enum,
                // 2 = left, 4 = right.
                if (e.direction === 4) {
                    _this.leftPanelClicked();
                }
                if (e.direction === 2) {
                    _this.rightPanelClicked();
                }
            }
        });
    };
    SplitViewContainer.prototype.destroySwipeHandler = function () {
        this.hammerManager.destroy();
    };
    SplitViewContainer.prototype.leftPanelClicked = function () {
        if (this._focusedPanel == FocusType.RIGHT) {
            this.focusedPanel = FocusType.LEFT;
        }
    };
    SplitViewContainer.prototype.rightPanelClicked = function () {
        if (this._focusedPanel == FocusType.LEFT && this._rightPanelVisible) {
            this.focusedPanel = FocusType.RIGHT;
        }
    };
    SplitViewContainer.prototype.startResizer = function (event) {
        if (event.which != 1 || !this.leftPanel.nativeElement) {
            return;
        }
        event.preventDefault();
        var resizeHandle = this.resizer.nativeElement;
        this.resizeMouseOffset = event.clientX - resizeHandle.getBoundingClientRect().left;
        // Bind mousemove and mouseup on body (the Angular2 way)
        this.boundBodyMouseMove = this.moveResizer.bind(this);
        this.boundBodyMouseUp = this.endResizing.bind(this);
        var body = dom_adapter_1.DOM.query('body');
        dom_adapter_1.DOM.addClass(body, 'gtx-split-view-container-resizing');
        body.addEventListener('mousemove', this.boundBodyMouseMove);
        body.addEventListener('mouseup', this.boundBodyMouseUp);
        // Start resizing
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
        this.resizing = true;
        this.splitDragStart.emit(this.resizerXPosition);
    };
    SplitViewContainer.prototype.moveResizer = function (event) {
        this.resizerXPosition = this.getAdjustedPosition(event.clientX);
    };
    SplitViewContainer.prototype.endResizing = function (event) {
        this.leftContainerWidthPercent = this.getAdjustedPosition(event.clientX);
        this.resizing = false;
        this.unbindBodyEvents();
        this.splitDragEnd.emit(this.leftContainerWidthPercent);
    };
    SplitViewContainer.prototype.unbindBodyEvents = function () {
        if (this.boundBodyMouseMove) {
            var body = dom_adapter_1.DOM.query('body');
            dom_adapter_1.DOM.removeClass(body, 'gtx-split-view-container-resizing');
            body.removeEventListener('mousemove', this.boundBodyMouseMove);
            body.removeEventListener('mouseup', this.boundBodyMouseUp);
            this.boundBodyMouseMove = null;
            this.boundBodyMouseUp = null;
        }
    };
    /**
     * Helper function to keep the resize functionality
     * within its limits (minPanelSizePixels & minPanelSizePercent).
     * @return {number} Returns the adjusted X position in % of the container width.
     */
    SplitViewContainer.prototype.getAdjustedPosition = function (mouseClientX) {
        var container = this.resizeContainer.nativeElement;
        var containerOffset = container.getBoundingClientRect().left;
        var containerWidth = container.clientWidth;
        var resizerWidth = this.resizer.nativeElement.offsetWidth;
        var maxXPixels = containerWidth - resizerWidth - this.minPanelSizePixels;
        var maxXPercent = 100 * (1 - resizerWidth / containerWidth) - this.minPanelSizePercent;
        var relativeX = mouseClientX - this.resizeMouseOffset - containerOffset;
        if (relativeX < this.minPanelSizePixels) {
            relativeX = this.minPanelSizePixels;
        }
        else if (relativeX > maxXPixels) {
            relativeX = maxXPixels;
        }
        var percentX = 100 * (relativeX / containerWidth);
        if (percentX < this.minPanelSizePercent) {
            percentX = this.minPanelSizePercent;
        }
        else if (percentX > maxXPercent) {
            percentX = maxXPercent;
        }
        return percentX;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SplitViewContainer.prototype, "rightPanelVisible", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', FocusType)
    ], SplitViewContainer.prototype, "focusedPanel", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SplitViewContainer.prototype, "leftContainerWidthPercent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SplitViewContainer.prototype, "minPanelSizePercent", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SplitViewContainer.prototype, "minPanelSizePixels", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "rightPanelClosed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "rightPanelOpened", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "rightPanelVisibleChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "leftPanelFocused", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "rightPanelFocused", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "focusedPanelChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "splitDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SplitViewContainer.prototype, "splitDragEnd", void 0);
    __decorate([
        core_1.ViewChild('resizeContainer'), 
        __metadata('design:type', core_1.ElementRef)
    ], SplitViewContainer.prototype, "resizeContainer", void 0);
    __decorate([
        core_1.ViewChild('leftPanel'), 
        __metadata('design:type', core_1.ElementRef)
    ], SplitViewContainer.prototype, "leftPanel", void 0);
    __decorate([
        core_1.ViewChild('rightPanel'), 
        __metadata('design:type', core_1.ElementRef)
    ], SplitViewContainer.prototype, "rightPanel", void 0);
    __decorate([
        core_1.ViewChild('resizer'), 
        __metadata('design:type', core_1.ElementRef)
    ], SplitViewContainer.prototype, "resizer", void 0);
    SplitViewContainer = __decorate([
        core_1.Component({
            selector: 'gtx-split-view-container',
            template: require('./split-view-container.tpl.html')
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SplitViewContainer);
    return SplitViewContainer;
}());
exports.SplitViewContainer = SplitViewContainer;
