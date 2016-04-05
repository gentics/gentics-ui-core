import {Component} from 'angular2/core';
import {GTX_FORM_DIRECTIVES, SortableList, SortableListDragHandle, ISortableEvent, ContentsListItem} from '../../../index';

@Component({
    template: require('./sortable-list-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, SortableList, SortableListDragHandle, ContentsListItem],
    styles: [
        `.auto-scroll-demo { max-height: 300px; overflow-y: scroll; }`
    ]
})
export class SortableListDemo {

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
}
