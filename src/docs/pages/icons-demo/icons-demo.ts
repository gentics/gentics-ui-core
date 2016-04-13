import {Component} from 'angular2/core';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {GTX_FORM_DIRECTIVES, Button, DropdownList} from '../../../index';

@Component({
    template: require('./icons-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button, DropdownList, Autodocs, DemoBlock, HighlightedCode]
})
export class IconsDemo {}
