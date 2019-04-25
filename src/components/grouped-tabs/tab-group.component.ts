import {Component, ContentChildren, QueryList, Input, TemplateRef} from '@angular/core';
import { TabPane } from './tab-pane.component';
import { GtxTabLabel } from './tab-label';
import { coerceToBoolean } from '../../common/coerce-to-boolean';

// Counter for unique group ids.
let uniqueTabGroupId = 0;

/**
 * For documentation, see the GroupedTabs
 */
@Component({
  selector: 'gtx-tab-group',
  exportAs: 'gtxTabGroup',
  template: ``
})
export class TabGroup {
  /** Unique id for the tab group. */
  uniqueId: string = `gtx-tag-group-${uniqueTabGroupId++}`;

  /** Content for the tab label given by `<ng-template gtx-tab-label>`. */
  @ContentChildren(GtxTabLabel, { read: TemplateRef, descendants: false }) templateLabels: QueryList<GtxTabLabel>;

  get templateLabel(): GtxTabLabel {
    return this.templateLabels.first || null;
  }

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel: string = '';

  @Input() set expanded(val: any) {
    this.expand = coerceToBoolean(val);
  }

  expand: boolean = false;

  /** All of the defined tab panes. */
  @ContentChildren(TabPane, { descendants: false }) tabs: QueryList<TabPane>;

  get hasActiveChild(): boolean {
    return this.tabs.some(tab => tab.active)
  }
  
  toggle(): void {
    this.expand = !this.expand;
  }
}
