import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output
} from 'angular2/core';

export class FocusType {
    static LEFT = <FocusType> (<any> 'left');
    static RIGHT = <FocusType> (<any> 'right');
}

@Component({
    selector: 'gtx-split-view-container',
    template: require('./split-view-container.tpl.html')
})
export class SplitViewContainer implements AfterViewInit {
    /**
     * Tells if a panel is opened on the right side in the split view.
     * Setting to false will also change {@link focusedPanel}.
     */
    @Input() get rightPanelVisible(): boolean {
        return this._rightPanelVisible;
    }
    set rightPanelVisible(visible: boolean) {
        console.log('set rightPanelVisible(', visible, ')');
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
        console.log('set focusedPanel(', panel, ')');
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
     * Triggers when the right panel is closed.
     */
    @Output()
    rightPanelClosed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the right panel is closed.
     */
    @Output()
    rightPanelOpened: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Triggers when the value of {@link rightPanelVisible} changes.
     * Allows to double-bind the property.
     * @example
     *     <split-view-container [(rightPanelVisible)]="property">
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
     * @example
     *     <split-view-container [(focusedPanel)]="property">
     */
    @Output()
    focusedPanelChange: EventEmitter<FocusType> = new EventEmitter<FocusType>();


    private _rightPanelVisible: boolean = false;
    private _focusedPanel: FocusType = 'left';

    constructor(private ownElement: ElementRef) {
    }

    // (hacky) After initializing the view, make this component fill the height of the viewport
    ngAfterViewInit(): void {
        if (!this.ownElement || !this.ownElement.nativeElement) {
            return;
        }
        let element: HTMLElement = this.ownElement.nativeElement;
        let css: CSSStyleDeclaration = element.style;
        css.top = element.offsetTop + 'px';
        css.bottom = css.left = css.right = '0';
        css.position = 'absolute';
    }

    private leftPanelClicked() {
        if (this._focusedPanel == FocusType.RIGHT) {
            this.focusedPanel = FocusType.LEFT;
        }
    }

    private rightPanelClicked() {
        if (this._focusedPanel == FocusType.LEFT) {
            this.focusedPanel = FocusType.RIGHT;
        }
    }
}
