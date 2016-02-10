import {Component, Input} from 'angular2/core';

@Component({
    selector: 'gtx-list-pane',
    template: require('./list-pane.tpl.html')
})
export class ListPane {
    weirdExample : number[] = [1, 2, 3, 4, 5, 6, 7];
}
