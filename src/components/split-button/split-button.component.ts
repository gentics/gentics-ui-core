import {ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {DropdownItem} from '../dropdown-list/dropdown-item.component';

/**
 * A split button component.
 *
 * The main content of the button and the handler of the main click event is specified by
 * using a `<gtx-split-button-primary-action>` child element.
 *
 * Secondary actions can be defined using `<gtx-dropdown-item>` child elements and
 * their click handlers. If secondary actions are defined a dropdown trigger
 * will be displayed to the right of the main content.
 *
 * All input properties of `<gtx-button>`, except for `icon` are supported.
 *
 * ```html
 * <gtx-split-button>
 *     <gtx-split-button-primary-action (click)="save()">Save Document</gtx-split-button-primary-action>
 *     <gtx-dropdown-item (click)="saveAndPublish()">Save and Publish</gtx-dropdown-item>
 *     <gtx-dropdown-item (click)="saveAndEmail()">Save and Send via E-Mail</gtx-dropdown-item>
 * </gtx-split-button>
 * ```
 */
@Component({
    selector: 'gtx-split-button',
    templateUrl: './split-button.tpl.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitButton {

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
     * Controls whether the button is disabled.
     */
    @Input() disabled: boolean;

    @ContentChildren(DropdownItem)
    secondaryActions: QueryList<DropdownItem>;

    constructor() {}

}
