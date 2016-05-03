import {Component} from '@angular/core';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./split-view-container-demo.tpl.html'),
    directives: [Autodocs, DemoBlock, HighlightedCode]
})
export class SplitViewContainerDemo {
    componentSource: string = require('!!raw!../../../components/split-view-container/split-view-container.component.ts');
}
