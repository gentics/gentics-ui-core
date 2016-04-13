import {Component, Input, HostBinding} from 'angular2/core';

/**
 * An animated CSS hamburger menu icon, used by the SideMenu component to trigger the
 * "toggle" event. Only used internally by the SideMenu component.
 */
@Component({
    selector: 'gtx-side-menu-toggle-button',
    template: `<div class="bar top"></div>
               <div class="bar middle"></div>
               <div class="bar bottom"></div>`
})
export class SideMenuToggleButton {
    @Input() @HostBinding('class.active') active: boolean = false;
}
