import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, ContentsListItem, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./contents-list-item-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, Button, ContentsListItem, Autodocs, DemoBlock, HighlightedCode]
})
export class ContentsListItemDemo {

    componentSource: string = require('!!raw!../../../components/contents-list-item/contents-list-item.component.ts');

    listItems: string[] = [
        'foo',
        'bar',
        'baz'
    ];
}
