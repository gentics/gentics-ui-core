import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './grouped-tabs-demo.tpl.html'
})
export class GroupedTabsDemo {
    componentSource: string = require('!!raw-loader!../../../components/grouped-tabs/grouped-tabs.component.ts');
    activeTab: string = 'tab1';
    wrap: boolean = false;
    asyncTabData$ = new Subject<Array<any>>();

    addTabAsync(): void {
        this.asyncTabData$.next([
            { id: 'async-tab-1', label: 'Test Label 1', content: 'Test content 1' },
            { id: 'async-tab-2', label: 'Test Label 2', content: 'Test content 2' }
        ]);
    }
}
