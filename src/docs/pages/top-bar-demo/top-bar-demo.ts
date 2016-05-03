import {Component} from '@angular/core';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./top-bar-demo.tpl.html'),
    directives: [Autodocs, DemoBlock, HighlightedCode]
})
export class TopBarDemo {
    componentSource: string = require('!!raw!../../../components/top-bar/top-bar.component.ts');
}
