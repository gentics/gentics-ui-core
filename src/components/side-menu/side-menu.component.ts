import {Component, Input, Output, HostBinding, EventEmitter} from '@angular/core';
import {SideMenuToggleButton} from './side-menu-toggle.component';

/**
 * The SideMenu component is an off-canvas menu that features a hamburger toggle button which can be
 * used to toggle the state. The component itself is stateless, and relies on the value passed in as
 * the `opened` prop to set its state. Toggling must also be handled by the host component.
 *
 * ```html
 * <gtx-side-menu [opened]="displayMenu" (toggle)="toggleMenu($event)">
 *    <div class="my-menu-content">
 *        <ul>
 *            <li>Menu item 1</li>
 *            <li>Menu item 2</li>
 *            <li>Menu item 3</li>
 *            <li>Menu item 4</li>
 *            <li>Menu item 5</li>
 *        </ul>
 *    </div>
 * </gtx-side-menu>
 * ```
 */
@Component({
    selector: 'gtx-side-menu',
    template: require('./side-menu.tpl.html'),
    directives: [SideMenuToggleButton]
})
export class SideMenu {

    /**
     * Sets the state of the menu: true = opened, false = closed.
     */
    @Input() opened: boolean = false;

    @HostBinding('class.opened') get hostIsOpen(): boolean {
        return this.opened;
    }

    /**
     * Fired when the toggle button is clicked. The value is equal to
     * the value of the `opened`
     */
    @Output() toggle = new EventEmitter<boolean>();

    toggleState(): void {
        this.toggle.emit(!this.opened);
    }

    close(): void {
        if (this.opened === true) {
            this.toggleState();
        }
    }
}
