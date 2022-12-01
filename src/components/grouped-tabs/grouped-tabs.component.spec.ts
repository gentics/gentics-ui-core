import {Component, ViewChild, ElementRef} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';

import {componentTest} from '../../testing';
import { GroupedTabs } from './grouped-tabs.component';
import { TabPane } from './tab-pane.component';
import { TabGroup } from './tab-group.component';
import { Icon } from '../icon/icon.directive';
import { Subject } from 'rxjs';
import { GtxTabLabel } from './tab-label';
import { GtxTabContent } from './tab-content';

export class MockElementRef extends ElementRef {
    constructor() { super(null); }
}

describe('Grouped Tabs:', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: ElementRef, useClass: MockElementRef }
        ],
        declarations: [
            Icon,
            GroupedTabs,
            TabGroup,
            TabPane,
            GtxTabLabel,
            GtxTabContent,
            TestComponent
        ]
    }));

    it('is created ok',
        componentTest(() => TestComponent, fixture => {
            expect(fixture).toBeDefined();
        })
    );

    describe('tabs', () => {
        it('tab panes created correctly',
            componentTest(() => TestComponent,
            `<gtx-grouped-tabs>
                <gtx-tab-pane label="Test Label">Test Content</gtx-tab-pane>
                <gtx-tab-pane label="Test Label 2">Second Test Content</gtx-tab-pane>
            </gtx-grouped-tabs>`,
            fixture => {
                let tabId = 0;
                let testLabels = ['Test Label', 'Test Label 2'];
                let testContents = ['Test Content', 'Second Test Content'];

                // Check if everything created as assumed
                fixture.detectChanges();
                let tabs = fixture.componentInstance.groupedTabs.tabPanes.toArray() as TabPane[];
                let tabGroups = fixture.componentInstance.groupedTabs.tabGroups.toArray() as TabGroup[];

                expect(tabGroups.length).toBe(0);

                let tabContent: HTMLDivElement = fixture.nativeElement.querySelector('div.grouped-tab-content');
                expect(tabContent.innerText).toEqual(testContents[tabId]);
                checkTabPaneLabels(fixture, tabId, testLabels);

                // Switch to the second tab
                tabId = 1;
                fixture.componentInstance.groupedTabs.selectTab(tabs[tabId]);

                // Check if everything re-rendered as assumed
                fixture.detectChanges();
                expect(tabContent.innerText).toEqual(testContents[tabId]);
                checkTabPaneLabels(fixture, tabId, testLabels);
            })
        );

        it('tab panes with groups created correctly',
            componentTest(() => TestComponent,
            `<gtx-grouped-tabs>
                <gtx-tab-pane label="Test Label">Test Content</gtx-tab-pane>
                <gtx-tab-group label="Test Group">
                    <gtx-tab-pane label="Test Label 2">Second Test Content</gtx-tab-pane>
                    <gtx-tab-pane label="Test Label 3">Third Test Content</gtx-tab-pane>
                </gtx-tab-group>
            </gtx-grouped-tabs>`,
            fixture => {
                let tabId = 0;
                let groupId = 0;
                let testLabels = ['Test Label', 'Test Label 2', 'Test Label 3'];
                let testContents = ['Test Content', 'Second Test Content', 'Third Test Content'];
                let collectedTabs = fixture.componentInstance.groupedTabs.tabs$;

                // Check if everything created as assumed
                fixture.detectChanges();
                let tabs = fixture.componentInstance.groupedTabs.tabPanes.toArray() as TabPane[];
                let tabGroups = fixture.componentInstance.groupedTabs.tabGroups.toArray() as TabGroup[];

                expect(tabGroups.length).toBe(1);

                let tabContent: HTMLDivElement = fixture.nativeElement.querySelector('div.grouped-tab-content');
                expect(tabContent.innerText).toEqual(testContents[tabId]);
                checkTabPaneLabels(fixture, tabId, testLabels);

                // Switch to the third tab in first group
                tabId = 2;
                groupId = 1;

                expect((collectedTabs.value[groupId] as TabGroup).hasActiveChild).toBeFalsy();

                fixture.componentInstance.groupedTabs.selectTab(tabs[tabId]);

                // Check if everything re-rendered as assumed
                fixture.detectChanges();
                expect(tabContent.innerText).toEqual(testContents[tabId]);
                expect((collectedTabs.value[groupId] as TabGroup).hasActiveChild).toBeTruthy();
                checkTabPaneLabels(fixture, tabId, testLabels);
            })
        );

        it('tabs are rendered in correct order',
            componentTest(() => TestComponent,
            `<gtx-grouped-tabs>
                <gtx-tab-pane label="Test Label">Test Content</gtx-tab-pane>
                <gtx-tab-group label="Test Group">
                    <gtx-tab-pane label="Test Label 2">Second Test Content</gtx-tab-pane>
                    <gtx-tab-pane label="Test Label 3">Third Test Content</gtx-tab-pane>
                </gtx-tab-group>
                <gtx-tab-pane label="Test Label 4">Test Content 4</gtx-tab-pane>
                <gtx-tab-group label="Test Group 2">
                    <gtx-tab-pane label="Test Label 5">Second Test Content 2</gtx-tab-pane>
                    <gtx-tab-pane label="Test Label 6">Third Test Content 2</gtx-tab-pane>
                </gtx-tab-group>
            </gtx-grouped-tabs>`,
            fixture => {
                let testLabels = ['Test Label', 'Test Label 2', 'Test Label 3', 'Test Label 4', 'Test Label 5', 'Test Label 6'];
                let testContents = ['Test Content', 'Second Test Content', 'Third Test Content', 'Test Content 4', 'Second Test Content 2', 'Third Test Content 2'];
                let collectedTabs = fixture.componentInstance.groupedTabs.tabs$;

                // Check if everything created as assumed
                fixture.detectChanges();
                let tabs = fixture.componentInstance.groupedTabs.tabPanes.toArray() as TabPane[];
                let tabGroups = fixture.componentInstance.groupedTabs.tabGroups.toArray() as TabGroup[];

                expect(tabGroups.length).toBe(2);
                expect(tabs.length).toBe(6);
                expect(collectedTabs.value.length).toBe(4);
                expect(collectedTabs.value[0] instanceof TabPane).toBeTruthy();
                expect(collectedTabs.value[1] instanceof TabGroup).toBeTruthy();
                expect(collectedTabs.value[2] instanceof TabPane).toBeTruthy();
                expect(collectedTabs.value[3] instanceof TabGroup).toBeTruthy();

                let tabContent: HTMLDivElement = fixture.nativeElement.querySelector('div.grouped-tab-content');

                const checkTab = (tabId, groupId?) => {
                    fixture.componentInstance.groupedTabs.selectTab(tabs[tabId]);
                    fixture.detectChanges();
                    expect(tabContent.innerText).toEqual(testContents[tabId]);

                    if (groupId !== undefined) {
                        expect((collectedTabs.value[groupId] as TabGroup).hasActiveChild).toBeTruthy();
                    }

                    checkTabPaneLabels(fixture, tabId, testLabels);
                }

                collectedTabs.value.forEach((item, index) => {
                    if (item instanceof TabGroup) {
                        item.tabs.forEach((gitem, gindex) => {
                            const tabId = tabs.findIndex((tab) => tab === gitem);
                            checkTab(tabId);
                        });
                    } else {
                        const tabId = tabs.findIndex((tab) => tab === item);
                        checkTab(tabId);
                    }
                });
            })
        );

        it('add tabs asynchronously with templates',
            componentTest(() => TestComponent,
            `<gtx-grouped-tabs>
                <gtx-tab-pane>
                    <ng-template gtx-tab-label>Test Label</ng-template>
                    <ng-template gtx-tab-content>Test Content</ng-template>
                </gtx-tab-pane>
                <gtx-tab-group *ngFor="let tabGroup of asyncTabs$ | async">
                    <ng-template gtx-tab-label>{{ tabGroup.label }}</ng-template>
                    <gtx-tab-pane *ngFor="let tab of tabGroup.tabs">
                        <ng-template gtx-tab-label>{{ tab.label }}</ng-template>
                        <ng-template gtx-tab-content>{{ tab.content }}</ng-template>
                    </gtx-tab-pane>
                </gtx-tab-group>
            </gtx-grouped-tabs>`,
            fixture => {
                let changeCalls = 0;
                let collectSpy = spyOn(fixture.componentInstance.groupedTabs, 'collectTabs').and.callThrough();
                let testLabelsBase = ['Test Label'];
                let testLabels = [];
                let testContents = ['Test Content'];
                let collectedTabs = fixture.componentInstance.groupedTabs.tabs$;
                let testAsync = [{
                    label: 'Test Async Group 1', tabs: [
                        { label: 'Test Async Tab 1', content: 'Test Async Tab 1 Content' },
                        { label: 'Test Async Tab 2', content: 'Test Async Tab 2 Content' },
                    ]
                },
                {
                    label: 'Test Async Group 2', tabs: [
                        { label: 'Test Async Tab 3', content: 'Test Async Tab 3 Content' },
                        { label: 'Test Async Tab 4', content: 'Test Async Tab 4 Content' },
                        { label: 'Test Async Tab 5', content: 'Test Async Tab 5 Content' },
                    ]
                }];

                // Check if everything created as assumed
                fixture.detectChanges();
                changeCalls++;
                let tabs = fixture.componentInstance.groupedTabs.tabPanes.toArray() as TabPane[];
                let tabGroups = fixture.componentInstance.groupedTabs.tabGroups.toArray() as TabGroup[];
                let tabContent: HTMLDivElement = fixture.nativeElement.querySelector('div.grouped-tab-content');

                expect(tabGroups.length).toBe(0);
                expect(tabs.length).toBe(1);
                expect(collectedTabs.value.length).toBe(1);

                const checkTab = (tabId, groupId?, tabItem?) => {
                    fixture.componentInstance.groupedTabs.selectTab(tabs[tabId]);
                    fixture.detectChanges();
                    if (tabId === 0) {
                        expect(tabContent.innerText).toEqual(testContents[tabId]);
                    } else {
                        expect(tabContent.innerText).toEqual(tabItem.content);
                    }

                    if (groupId !== undefined) {
                        expect((collectedTabs.value[groupId] as TabGroup).hasActiveChild).toBeTruthy();
                    }

                    checkTabPaneLabels(fixture, tabId, testLabels);
                }

                fixture.componentInstance.asyncTabs$.subscribe((item) => {
                    changeCalls++;
                    fixture.detectChanges();
                    // Same value as debounceTime in grouped-tabs.component.ts
                    tick(5);

                    expect(collectSpy).toHaveBeenCalledTimes(changeCalls);

                    tabs = fixture.componentInstance.groupedTabs.tabPanes.toArray() as TabPane[];
                    tabGroups = fixture.componentInstance.groupedTabs.tabGroups.toArray() as TabGroup[];
                    expect(tabGroups.length).toBe(item.length);
                    expect(tabs.length).toBe(item.map(i => i.tabs.length).reduce((acc, val) => acc + val) + 1);
                    expect(collectedTabs.value.length).toBe(item.length + 1);

                    // Collect all testable labels
                    const itemLabels = item.map(group => {
                        return group.tabs.map(groupItem => groupItem.label);
                    })
                    .reduce((acc, val) => acc.concat(val), []);

                    testLabels = [].concat(testLabelsBase, itemLabels);

                    collectedTabs.value.forEach((citem, index) => {
                        if (citem instanceof TabGroup) {
                            citem.tabs.forEach((gitem, gindex) => {
                                const tabId = tabs.findIndex((tab) => tab === gitem);
                                checkTab(tabId, index, item[index - 1].tabs[gindex]);
                            });
                        } else {
                            const tabId = tabs.findIndex((tab) => tab === citem);
                            checkTab(tabId);
                        }
                    })
                });

                testAsync.forEach((item) => {
                    fixture.componentInstance.asyncTabs$.next([item]);
                });

                fixture.componentInstance.asyncTabs$.next(testAsync);
            })
        );
    });
});

@Component({
    template: `<gtx-grouped-tabs>
        </gtx-grouped-tabs>`
})
class TestComponent {
    @ViewChild(GroupedTabs, { static: true }) groupedTabs: GroupedTabs;
    asyncTabs$ = new Subject<Array<any>>();
}

function checkTabPaneLabels(fixture, tabId, testLabels): void {
    let tabPanesLabels: HTMLLIElement[] = fixture.nativeElement.querySelectorAll('li.tab-link');

    tabPanesLabels.forEach((label, index: number) => {
        let tabPaneLabelActive = expect(tabPanesLabels[index].classList.contains('is-active'));
        if (tabId === index) {
            tabPaneLabelActive.toBeTruthy();
        } else {
            tabPaneLabelActive.toBeFalsy();
        }
        expect(label.innerText).toEqual(testLabels[index]);
    });
}
