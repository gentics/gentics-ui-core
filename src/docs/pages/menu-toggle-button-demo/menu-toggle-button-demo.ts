import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {MenuToggleButton} from '../../../components/menu-toggle-button/menu-toggle-button.component';

@Component({
    template: require('./menu-toggle-button-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Autodocs, DemoBlock, HighlightedCode, MenuToggleButton]
})
export class MenuToggleButtonDemo {
    componentSource: string = require('!!raw!../../../components/menu-toggle-button/menu-toggle-button.component');

}
