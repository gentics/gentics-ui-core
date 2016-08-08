import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {TABS} from '../../../components/tabs/index';

@Component({
    template: require('./tabs-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode, TABS]
})
export class TabsDemo {
    componentSource: string = require('!!raw!../../../components/tabs/tabs.component');
}
