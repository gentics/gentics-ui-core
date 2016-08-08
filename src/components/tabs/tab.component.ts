import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * For documentation, see the Tabs
 */
@Component({
    selector: 'gtx-tab',
    template: `
    <div [class.is-active]="active" class="tab-content">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {
    @Input() title: string;
    @Input() id: string;
    @Input() routerLink: any[];
    @Input() disabled: boolean;
    /**
     * When the tab is clicked, this event is fired with the tab id.
     */
    @Output() select = new EventEmitter<string>();
    active: boolean = false;
}
