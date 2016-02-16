import {Component, Input, HostBinding} from 'angular2/core';


@Component({
    selector: 'gtx-side-menu-toggle-button',
    template: `<div class="bar top"></div>
               <div class="bar middle"></div>
               <div class="bar bottom"></div>`
})
class SideMenuToggleButton {
    @Input() @HostBinding('class.active') active: boolean = false;
}


@Component({
    selector: 'gtx-side-menu',
    template: require('./side-menu.tpl.html'),
    directives: [SideMenuToggleButton]
})
export class SideMenu {
    @Input() @HostBinding('class.opened') opened: boolean = false;

    toggle(): void {
        this.opened = !this.opened;
    }
}

