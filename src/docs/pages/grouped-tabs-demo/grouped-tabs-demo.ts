import {Component} from '@angular/core';

@Component({
    templateUrl: './grouped-tabs-demo.tpl.html'
})
export class GroupedTabsDemo {
    componentSource: string = require('!!raw-loader!../../../components/grouped-tabs/grouped-tabs.component.ts');
    activeTab: string = 'tab1';
    wrap: boolean = false;
}
