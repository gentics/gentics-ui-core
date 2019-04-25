import {Component, Input, ContentChild, TemplateRef, ViewChild, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { GtxTabContent } from './tab-content';
import { GtxTabLabel } from './tab-label';

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
  @ContentChild(GtxTabLabel, { read: TemplateRef }) templateLabel: GtxTabLabel;

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel: string = '';

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(GtxTabContent, { read: TemplateRef }) _explicitContent: GtxTabContent;

  /** Template inside the TabPane view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef) _implicitContent: TemplateRef<any>;

  @Input() disabled: boolean;

  /**
   * When the tab is clicked, this event is fired with the tab id.
   */
  @Output() select = new EventEmitter<string>();
  active: boolean = false;
}
