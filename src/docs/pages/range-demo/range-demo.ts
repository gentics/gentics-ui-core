import {Component} from '@angular/core';

@Component({
    templateUrl: './range-demo.tpl.html'
})
export class RangeDemo {
    componentSource: string = require('!!raw-loader!../../../components/range/range.component.ts');
    rangeValDynamic: number = 35;
    rangeVal: any = 0;
    newRangeVal: any = 25;
    showThumb: boolean = true;
    readonly: boolean = false;
}
