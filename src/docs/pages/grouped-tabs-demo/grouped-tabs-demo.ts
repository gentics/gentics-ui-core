import { Component } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
    templateUrl: './grouped-tabs-demo.tpl.html'
})
export class GroupedTabsDemo {
    componentSource: string = require('!!raw-loader!../../../components/grouped-tabs/grouped-tabs.component.ts');
    activeTab: string = 'tab1';
    wrap: boolean = false;
    asyncTabData$ = new Subject<Array<any>>();
    asyncTabGroupsData$ = new Subject<Array<any>>();

    addTabAsync(): void {
        this.asyncTabData$.next([
            { id: 'async-tab-1', label: 'Test Label 1', content: 'Test content 1' },
            { id: 'async-tab-2', label: 'Test Label 2', content: 'Test content 2' }
        ]);
    }

    addGroupsAsync(): void {
        this.asyncTabGroupsData$.next([
            {
                label: 'Test Group Label 2', tabs: [
                    { label: 'Test Label 4', content: 'Test content 1' },
                    { label: 'Test Label 5', content: 'Test content 2' }
                ],
            },
            {
                label: 'Test Group Label 3', tabs: [
                    { label: 'Test Label 6', content: 'Test content 1' },
                    { label: 'Test Label 7', content: 'Test content 2' }
                ],
            },
        ]);
    }
}
