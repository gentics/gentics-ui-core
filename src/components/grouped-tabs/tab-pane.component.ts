import { Component, Input, ContentChild, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { GtxTabContent } from './tab-content';
import { GtxTabLabel } from './tab-label';
import { coerceToBoolean } from '../../common/coerce-to-boolean';

/**
 * Tab Pane IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let uniqueTabPaneId = 0;

/**
 * For documentation, see the GroupedTabs
 */
@Component({
    selector: 'gtx-tab-pane',
    exportAs: 'gtxTabPane',
    template: `<ng-template><ng-content></ng-content></ng-template>`
})
export class TabPane  {
  private uniqueId = `gtx-tab-pane-${uniqueTabPaneId++}`;

  /** The unique ID of the tab pane. */
  get id(): string { return this.uniqueId; }
  get content(): GtxTabContent | TemplateRef<any> { return this._explicitContent || this._implicitContent }

  /** Content for the tab label given by `<ng-template gtx-tab-label>`. */
  @ContentChild(GtxTabLabel, { read: TemplateRef, static: true }) templateLabel: GtxTabLabel;

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel: string = '';

  @Input() set id(val: string) {
    this.uniqueId = val;
  }

  /**
   * Hide status icon for this tab
   */
  @Input() set hideStatusIcon(val: any) {
    this.displayStatusIcon = !coerceToBoolean(val);
  }

  /**
   * Sets disabled state
   */
  @Input() set disabled(val: any) {
    this.stateDisabled = coerceToBoolean(val);
  }

  /**
   * Sets read-only state
   */
  @Input() set readonly(val: any) {
    this.stateReadOnly = coerceToBoolean(val);
  }

  /**
   * Sets inactive state
   */
  @Input() set inactive(val: any) {
    this.stateInactive = coerceToBoolean(val);
  }

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(GtxTabContent, { read: TemplateRef, static: true }) _explicitContent: GtxTabContent;

  /** Template inside the TabPane view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, { static: true }) _implicitContent: TemplateRef<any>;

  /**
   * When the tab is clicked, this event is fired with the tab id.
   */
  @Output() select = new EventEmitter<string>();
  active: boolean = false;
  stateDisabled: boolean = false;
  stateReadOnly: boolean = false;
  stateInactive: boolean = false;
  displayStatusIcon: boolean = true;
}
