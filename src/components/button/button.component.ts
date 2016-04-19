import {Component, Input} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';

/**
 * A Button component.
 *
 * ```html
 * <gtx-button>Click me</gtx-button>
 * <gtx-button size="large">Buy Now!</gtx-button>
 * <gtx-button type="alert">Delete all stuff</gtx-button>
 * ```
 */
@Component({
    selector: 'gtx-button',
    template: require('./button.tpl.html')
})
export class Button {

    /**
     * Buttons can be "small", "regular" or "large"
     */
    @Input() size: string = 'regular';

    /**
     * Type determines the style of the button. Can be "default", "secondary",
     * "success", "warning" or "alert".
     */
    @Input() type: string = 'default';

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
     * Controls whether the button is disabled.
     */
    @Input() disabled: boolean = false;

    private isFlat: boolean = false;

    getButtonClasses(): string[] {
        let classes = [this.size, this.type];
        if (this.isFlat) {
            classes.push('btn-flat');
        }
        return classes.join(' ');
    }

}
