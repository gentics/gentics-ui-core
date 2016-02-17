import {Component, Input} from 'angular2/core';

@Component({
    selector: 'gtx-content-pane',
    template: require('./content-pane.tpl.html')
})
export class ContentPane {
    weirdExample: number[] = [1, 2, 3, 4, 5, 6];
}
