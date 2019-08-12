import {Component, OnInit} from '@angular/core';

@Component({
    templateUrl: './tabs-demo.tpl.html'
})
export class TabsDemo implements OnInit {
    componentSource: string = require('!!raw-loader!../../../components/tabs/tabs.component.ts');
    activeTab: string = 'tab1';
    wrap: boolean = false;

    canUseInbox: boolean = false;

    ngOnInit(): void {
        setTimeout(() => {
            this.canUseInbox = true;
        }, 3000);
    }
}
