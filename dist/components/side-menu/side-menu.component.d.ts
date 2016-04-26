import { EventEmitter } from 'angular2/core';
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
export declare class SideMenu {
    /**
     * Sets the state of the menu: true = opened, false = closed.
     */
    opened: boolean;
    hostIsOpen: boolean;
    /**
     * Fired when the toggle button is clicked. The value is equal to
     * the value of the `opened`
     */
    toggle: EventEmitter<boolean>;
    toggleState(): void;
    close(): void;
}
