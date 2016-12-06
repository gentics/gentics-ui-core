import {Component} from '@angular/core';

@Component({
    templateUrl: './contents-list-item-demo.tpl.html'
})
export class ContentsListItemDemo {

    componentSource: string = require('!!raw-loader!../../../components/contents-list-item/contents-list-item.component.ts');

    listItems: string[] = [
        'foo',
        'bar',
        'baz'
    ];
}
