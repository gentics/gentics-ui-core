import {Component, HostBinding} from '@angular/core';

@Component({
    selector: 'gtx-dropdown-item',
    template: `<ng-content></ng-content>`
})
export class DropdownItem {
    @HostBinding('tabindex') tabIndex = 0;
}
