import {Component} from '@angular/core';

@Component({
    templateUrl: './select-demo.tpl.html'
})
export class SelectDemo {
    componentSource: string = require('!!raw-loader!../../../components/select/select.component.ts');

    options: string[] = ['foo', 'bar', 'baz', 'quux'];
    selectMultiVal: string[] = ['bar', 'baz'];
    selectVal: string = 'bar';
    selectGroup: any;
}
