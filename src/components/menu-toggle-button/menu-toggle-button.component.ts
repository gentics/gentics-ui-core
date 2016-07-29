import {Component, HostBinding, Input} from '@angular/core';

/**
 * An animated CSS hamburger menu icon. Works well with [SideMenu](#/side-menu), but can be used for any kind of menu.
 *
 * ```HTML
 * <gtx-menu-toggle-button [active]="isActive"
 *                         (click)="isActive = !isActive">
 * </gtx-menu-toggle-button>
 * ```
 *
 * The colors can be configured by locally defining the following rules:
 * ```css
 * gtx-menu-toggle-button .bar { background-color: someColor; }
 * gtx-menu-toggle-button.active .bar { background-color: someOtherColor; }
 * ```
 */
@Component({
    selector: 'gtx-menu-toggle-button',
    template: `
        <div>
            <div class="bar top"></div>
            <div class="bar middle"></div>
            <div class="bar bottom"></div>
        </div>`
})
export class MenuToggleButton {
    @HostBinding('class.active')
    /**
     * When "active", the button will be an "x", otherwise it will be a "hamburger"
     */
    @Input() active: boolean = false;
}
