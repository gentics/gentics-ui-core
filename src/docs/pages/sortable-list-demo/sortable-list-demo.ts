import {Component} from '@angular/core';
import {ISortableEvent} from '../../../index';

@Component({
    templateUrl: './sortable-list-demo.tpl.html',
    styles: [
        `.auto-scroll-demo { max-height: 300px; overflow-y: scroll; }`
    ]
})
export class SortableListDemo {
    componentSource: string = require('!!raw-loader!../../../components/sortable-list/sortable-list.component.ts');

    items: any[] = [
        {
            name: 'John',
            age: 21
        },
        {
            name: 'Mary',
            age: 26
        },
        {
            name: 'Barry',
            age: 43
        },
        {
            name: 'Susan',
            age: 32
        }
    ];
    longList: string[] = [];
    disabled: boolean = false;

    constructor() {
        for (let i = 1; i < 30; i++) {
            this.longList.push(`Item ${i}`);
        }
    }

    sortList(e: ISortableEvent): void {
        this.items = e.sort(this.items);
    }

    sortLongList(e: ISortableEvent): void {
        this.longList = e.sort(this.longList);
    }
}
