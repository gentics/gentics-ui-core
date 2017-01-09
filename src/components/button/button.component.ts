import {Component, ElementRef, Input, OnDestroy, Renderer} from '@angular/core';

/**
 * A Button component.
 *
 * ```html
 * <gtx-button>Click me</gtx-button>
 * <gtx-button size="large">Buy Now!</gtx-button>
 * <gtx-button type="alert">Delete all stuff</gtx-button>
 * <gtx-button icon>
 *     <i class="material-icons">settings</i>
 * </gtx-button>
 * ```
 */
@Component({
    selector: 'gtx-button',
    templateUrl: './button.tpl.html'
})
export class Button implements OnDestroy {
    /**
     * Sets the input field to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /**
     * Specify the size of the button. Can be "small", "regular" or "large".
     */
    @Input() size: 'small' | 'regular' | 'large' = 'regular';

    /**
     * Type determines the style of the button. Can be "default", "secondary",
     * "success", "warning" or "alert".
     */
    @Input() type: 'default' | 'secondary' | 'success' | 'warning' | 'alert' = 'default';

    /**
     * Setting the "flat" attribute gives the button a transparent background
     * and only depth on hover.
     */
    @Input()
    get flat(): boolean {
        return this.isFlat;
    }
    set flat(val: boolean) {
        this.isFlat = val != null && val !== false;
    }

    /**
     * Setting the "icon" attribute turns the button into an "icon button", which is
     * like a flat button without a border, suitable for wrapping an icon.
     */
    @Input()
    get icon(): boolean {
        return this.isIcon;
    }
    set icon(val: boolean) {
        this.isIcon = val != null && val !== false;
    }

    /**
     * Controls whether the button is disabled.
     */
    @Input()
    get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(disabled: boolean) {
        this.isDisabled = (<any> disabled) === '' || !!disabled;
    }

    /**
     * Set button as a submit button.
     */
    @Input()
    set submit(value: boolean) {
        this.buttonType = (value != null && value !== false) ? 'submit' : 'button';
    }


    private buttonType = 'button';
    private isFlat: boolean = false;
    private isIcon: boolean = false;
    private isDisabled: boolean = false;
    private unbindClickHandler: Function;

    constructor(elementRef: ElementRef,
                renderer: Renderer) {

        if (elementRef.nativeElement) {
            // This bind call really needs to be in the constructor, not in ngOnInit. Sorry!
            this.unbindClickHandler = renderer.listen(elementRef.nativeElement, 'click', this.onClickEvent);
        }

    }

    ngOnDestroy(): void {
        if (this.unbindClickHandler) {
            this.unbindClickHandler();
        }
    }

    // Disabled elements don't fire mouse events in some browsers, but bubble up the DOM tree.
    // To not trigger actions when the button is disabled, we need to prevent them manually.
    onClickEvent = (event: Event): void => {
        if (event && this.isDisabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}
