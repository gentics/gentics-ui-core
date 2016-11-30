import {Component} from '@angular/core';

@Component({
    template: require('./tabs-demo.tpl.html')
})
export class TabsDemo {
    componentSource: string = require('!!raw!../../../components/tabs/tabs.component');
}
