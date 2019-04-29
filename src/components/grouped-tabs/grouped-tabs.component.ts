import { Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { TabPane } from './tab-pane.component';
import { TabGroup } from './tab-group.component';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { coerceToBoolean } from '../../common/coerce-to-boolean';

let uniqueGroupedTabsId = 0;

/**
 * GroupedTabs supports tabs either with and without groups.
 *
 * Pure tabs will only change the active tab when the `activeId` property is updated.
 *
 * ##### Tabs with simple labels
 * ```html
 * <gtx-grouped-tabs>
 *      <gtx-tab-item label="First without Group">Content 1</gtx-tab-item>
 *      <gtx-tab-group label="1st Group name" expand="true">
 *          <gtx-tab-item label="First">Content 2</gtx-tab-item>
 *          <gtx-tab-item label="Second">Content 3</gtx-tab-item>
 *      </gtx-tab-group>
 *      <gtx-tab-group label="2nd Group name">
 *          <gtx-tab-item label="First">Content 4</gtx-tab-item>
 *          <gtx-tab-item label="Second">Content 5</gtx-tab-item>
 *      </gtx-tab-group>
 * </gtx-grouped-tabs>
 * ```
 * 
 * ##### Tabs with template labels
 * ```html
 * <gtx-grouped-tabs>
 *      <gtx-tab-item>
 *          <ng-template gtx-tab-label>First without Group</ng-template>
 *          Implicit Content 1
 *      </gtx-tab-item>
 *      <gtx-tab-group expand="true">
 *          <ng-template gtx-tab-label>
 *              <icon>add</icon> 1st Group name
 *          </ng-template>
 *          <gtx-tab-item>
 *              <ng-template gtx-tab-label>First</ng-template>
 *              <ng-template gtx-tab-content>
 *                  Content 2
 *              </ng-template>
 *          </gtx-tab-item>
 *          <gtx-tab-item label="Second">Content 3</gtx-tab-item>
 *      </gtx-tab-group>
 *      <gtx-tab-group label="2nd Group name">
 *          <gtx-tab-item label="First">Content 4</gtx-tab-item>
 *          <gtx-tab-item label="Second">Content 5</gtx-tab-item>
 *      </gtx-tab-group>
 * </gtx-grouped-tabs>
 * ```
 * 
 * ##### Export components to use in templates
 * ```html
 * <gtx-grouped-tabs #groupedTabs="gtxGroupedTabs">
 *      <gtx-tab-item label="First" #tab1>First content</gtx-tab-item>
 *      <gtx-tab-item label="Second">
 *          Seconds content
 *          <gtx-button (click)="groupedTabs.selectTab(tab1)">Switch to Tab 1</gtx-button>
 *      </gtx-tab-item>
 * </gtx-grouped-tabs>
 * ```
 *
 */
@Component({
    selector: 'gtx-grouped-tabs',
    exportAs: 'gtxGroupedTabs',
    templateUrl: './grouped-tabs.tpl.html'
})
export class GroupedTabs implements AfterContentInit {

    /** Unique id for this input. */
    private uniqueId = `gtx-grouped-tabs-${uniqueGroupedTabsId++}`;

    tabs: Array<TabPane|TabGroup> = [];

    /** All of the defined tab panes. */
    @ContentChildren(TabPane, { descendants: true }) tabPanes: QueryList<TabPane>;

    /** All of the defined groups of tab panes. */
    @ContentChildren(TabGroup) tabGroups: QueryList<TabGroup>;

    /**
     * Fires an event whenever the active tab changes. Argument is the id of the selected tab.
     */
    @Output() tabChange = new EventEmitter<string>();

    /**
     * The id of the active tab. Should only be used in pure (stateless) mode.
     */
    @Input() activeId: string;

    @Input() set id(val: string) {
        this.uniqueId = val;
    }

    get id(): string { return this.uniqueId; }

    /**
     * When present, sets the tabs to pure (stateless) mode.
     */
    @Input() set pure(val: any) {
        this.isPure = val != null;
    }

    /**
     * When present (or set to true), tabs title will wrap onto a new line. Otherwise, tabs will remain on one line
     * and the contents will be elided if all the available space is filled.
     */
    @Input() set wrap(val: any) {
        this.tabsShouldWrap = coerceToBoolean(val);
    }

    get currentTab(): TabPane { return this.tabPanes.filter(tab => tab.active === true)[0]; }

    tabsShouldWrap: boolean = false;
    private isPure: boolean = false;
    private subscriptions = new Subscription();

    constructor(private elementRef: ElementRef) {}

    isTabGroup(item) { return item.expand !== undefined; }

    collectTabs(): void {
        // Clear existing tabs
        this.tabs = [];

        // Collect all the available tabs and groups
        this.tabPanes.map(item => {
            const tabGroup = this.tabGroups.find(group => group.tabs.some(tab => tab === item));
            if (tabGroup !== undefined) {
                if (this.tabs.indexOf(tabGroup) === -1) {
                    this.tabs.push(tabGroup);
                }
            } else {
                this.tabs.push(item);
            }
        });

        // Activates the first tab if there are no active currently
        this.preActivateTab();
    }

    preActivateTab(): void {
        if (this.isPure) {
            setTimeout(() => this.setActiveTab());
        } else {
            let activeTabs = this.tabPanes.filter(tab => tab.active);

            // if there is no active tab set, activate the first
            if (activeTabs.length === 0) {
                this.tabPanes.first.active = true;
            }
        }
    }

    ngAfterContentInit(): void {
        const tabChanges = combineLatest(
            this.tabPanes.changes,
            this.tabGroups.changes
        ).pipe(switchMap(([tabPaneChanges, tabGroupChanges]) => {
            let allChanges = [tabPaneChanges, tabGroupChanges];

            this.tabGroups.map((group) => {
                group.tabs.notifyOnChanges();
                allChanges.push(group.tabs.changes);
            });

            return combineLatest(allChanges);
        }));

        this.subscriptions.add(tabChanges.subscribe(() => {
            this.collectTabs();
        }));

        this.tabPanes.notifyOnChanges();
        this.tabGroups.notifyOnChanges();

        this.collectTabs();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setActiveTab();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Sets the tab with id === this.activeId to active.
     */
    setActiveTab(): void {
        if (this.tabPanes) {
            let tabToActivate = this.tabPanes.filter(t => t.id === this.activeId)[0];
            if (tabToActivate) {
                this.setAsActive(tabToActivate);
            }
        }
    }

    /**
     * Invoked when a tab link is clicked.
     */
    selectTab(tab: TabPane): void {
        if (tab.disabled) {
            return;
        }
        if (!this.isPure) {
            this.setAsActive(tab);
            this.tabChange.emit(tab.id);
        } else {
            tab.select.emit(tab.id);
        }
    }

    /**
     * Toggle TabGroup open/close state.
     */
    toggleGroup(group: TabGroup): void {
        group.toggle();
    }

    /**
     * Calculates TabGroup body height to to make it correctly animateable.
     */
    tabsHeight(group: TabGroup): number {
        if (group.expand) {
            let body = this.elementRef.nativeElement.querySelector(`li#${group.uniqueId} div.collapsible-body > ul`);
            return body.getBoundingClientRect().height + 30;
        } else {
            return 0;
        }
    }

    private setAsActive(tab: TabPane): void {
        this.tabPanes.toArray().forEach(tab => tab.active = false);
        this.tabGroups.map(group => {
            if (group.tabs.some(currentTab => currentTab === tab)) {
                group.expand = true;
            }
        });
        tab.active = true;
    }
}
