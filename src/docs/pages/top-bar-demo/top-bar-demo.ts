import {Component} from '@angular/core';

@Component({
    template: require('./top-bar-demo.tpl.html')
})
export class TopBarDemo {
    componentSource: string = require('!!raw-loader!../../../components/top-bar/top-bar.component.ts');
}
