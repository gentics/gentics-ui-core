import {Component, HostBinding, Input} from '@angular/core';
import {coerceToBoolean} from '../../common/coerce-to-boolean';

@Component({
    selector: 'gtx-dropdown-item',
    template: `<ng-content></ng-content>`
})
export class DropdownItem {

    /**
     * If true, the DropdownItem cannot be clicked or selected. *Default: false*
     */
    @Input()
    get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(value: boolean) {
        this.isDisabled = coerceToBoolean(value);
    }

    @HostBinding('tabindex') tabIndex = 0;

    @HostBinding('class.disabled') isDisabled = false;
}
