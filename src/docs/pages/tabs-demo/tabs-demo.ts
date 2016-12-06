import {Component} from '@angular/core';

@Component({
    templateUrl: './tabs-demo.tpl.html'
})
export class TabsDemo {
    componentSource: string = require('!!raw-loader!../../../components/tabs/tabs.component');
    activeTab: string;
}
