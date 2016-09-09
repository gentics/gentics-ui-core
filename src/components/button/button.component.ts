import {Component, Input} from '@angular/core';
import {isPresent} from '@angular/core/src/facade/lang';

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
    template: require('./button.tpl.html')
})
export class Button {

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
        return this.isFlat === true;
    }
    set flat(val: boolean) {
        this.isFlat = isPresent(val) && val !== false;
    }

    /**
     * Setting the "icon" attribute turns the button into an "icon button", which is
     * like a flat button without a border, suitable for wrapping an icon.
     */
    @Input()
    get icon(): boolean {
        return this.isIcon === true;
    }
    set icon(val: boolean) {
        this.isIcon = isPresent(val) && val !== false;
    }
    /**
     * Controls whether the button is disabled.
     */
    @Input() disabled: boolean = false;

    private isFlat: boolean = false;
    private isIcon: boolean = false;
}
