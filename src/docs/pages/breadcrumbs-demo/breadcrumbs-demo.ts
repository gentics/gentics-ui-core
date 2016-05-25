import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Breadcrumbs} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./breadcrumbs-demo.tpl.html'),
    styles: [`gtx-breadcrumbs { margin-bottom: 10px; }`],
    directives: [GTX_FORM_DIRECTIVES, Breadcrumbs, Autodocs, DemoBlock, HighlightedCode]
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw!../../../components/breadcrumbs/breadcrumbs.component.ts');
}
