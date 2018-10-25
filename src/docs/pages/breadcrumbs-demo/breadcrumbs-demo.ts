import {Component} from '@angular/core';

@Component({
    templateUrl: './breadcrumbs-demo.tpl.html'
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw-loader!../../../components/breadcrumbs/breadcrumbs.component.ts');
    isDisabled: boolean = true;

    multiline: boolean = false;
    multilineExpanded: boolean = true;
}


