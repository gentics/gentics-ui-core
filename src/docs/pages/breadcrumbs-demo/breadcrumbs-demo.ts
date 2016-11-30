import {Component} from '@angular/core';

@Component({
    template: require('./breadcrumbs-demo.tpl.html'),
    styles: [`.columns + .columns { margin-top: -8px; }`]
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw!../../../components/breadcrumbs/breadcrumbs.component.ts');
    isDisabled: boolean = true;
}
