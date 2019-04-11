import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

/**
 *
 */
@Component({
    selector: 'gtx-split-button',
    templateUrl: './split-button.tpl.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitButton implements OnInit {

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
    @Input() flat: boolean;

    /**
     * Setting the "icon" attribute turns the button into an "icon button", which is
     * like a flat button without a border, suitable for wrapping an icon.
     */
    @Input() icon: boolean;
    /**
     * Controls whether the button is disabled.
     */
    @Input() disabled: boolean;

    constructor() { }

    ngOnInit(): void {
    }

}
