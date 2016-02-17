import {Component, Input, Output, HostBinding, EventEmitter} from 'angular2/core';

/**
 * An animated CSS hamburger menu icon, used by the SideMenu component to trigger the
 * "toggle" event. Not exported as it is only used internally.
 */
@Component({
    selector: 'gtx-side-menu-toggle-button',
    template: `<div class="bar top"></div>
               <div class="bar middle"></div>
               <div class="bar bottom"></div>`
})
class SideMenuToggleButton {
    @Input() @HostBinding('class.active') active: boolean = false;
}

/**
 * The SideMenu componponent is an off-canvas menu that features a hamburger toggle button which can be
 * used to toggle the state. The component itself is stateless, and relies on the value passed in as
 * the `opened` prop to set its state. Toggling must also be handled by the host component.
 *
 * @example
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
 */
@Component({
    selector: 'gtx-side-menu',
    template: require('./side-menu.tpl.html'),
    directives: [SideMenuToggleButton]
})
export class SideMenu {
    @Input() @HostBinding('class.opened') opened: boolean = false;
    @Output() toggle: EventEmitter<boolean> = new EventEmitter();

    toggleState(): void {
        this.toggle.emit(!this.opened);
    }

    close(): void {
        if (this.opened === true) {
            this.toggleState();
        }
    }
}
