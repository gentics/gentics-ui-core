import {Component} from '@angular/core';

@Component({
    template: require('./range-demo.tpl.html')
})
export class RangeDemo {
    componentSource: string = require('!!raw!../../../components/range/range.component.ts');
    rangeValDynamic: number = 35;
}
