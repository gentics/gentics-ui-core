import {Component} from '@angular/core';

@Component({
    templateUrl: './select-demo.tpl.html'
})
export class SelectDemo {
    componentSource: string = require('!!raw-loader!../../../components/select/select.component.ts');

    options: string[] = ['foo', 'bar', 'baz', 'quux', 'qwerty', 'dump', 'lorem',
                         'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    selectMultiVal: string[] = ['bar', 'baz'];
    smallOptions: string[] = ['foo', 'bar', 'baz'];
    people: any[] = [
        { name: 'John', age: 22, disabled: false },
        { name: 'Susan', age: 34, disabled: true },
        { name: 'Paul', age: 30, disabled: false }
    ];
    selectVal: string = 'bar';
    selectNewVal: string = 'baz';
    clearableSelectVal: string = null;
    placeholderSelectVal: string = null;
    selectGroup: any;
    selectedPerson: any;
    disableEntireControl: boolean = false;
    disableSingleOption: boolean = false;
    disableOptionGroup: boolean = false;
    readonly: boolean = false;
}
