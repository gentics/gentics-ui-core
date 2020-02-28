import {Component} from '@angular/core';

@Component({
    templateUrl: './breadcrumbs-demo.tpl.html'
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw-loader!../../../components/breadcrumbs/breadcrumbs.component.ts');
    collapsedEnabledColor: string = '#0096DC';
    collapsedDisabledColor: string = 'rgb(110, 110, 110)';
    isDisabled: boolean = true;

    isChanged: boolean = false;

    multiline: boolean = true;
    multilineExpanded: boolean = false;
}
