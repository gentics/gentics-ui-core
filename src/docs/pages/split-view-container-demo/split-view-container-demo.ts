import {Component} from '@angular/core';

@Component({
    template: require('./split-view-container-demo.tpl.html')
})
export class SplitViewContainerDemo {
    componentSource: string = require('!!raw-loader!../../../components/split-view-container/split-view-container.component.ts');
}
