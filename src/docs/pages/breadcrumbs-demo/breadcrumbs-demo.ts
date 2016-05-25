import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, Breadcrumbs} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./breadcrumbs-demo.tpl.html'),
    styles: [`.columns + .columns { margin-top: -8px; }`],
    directives: [GTX_FORM_DIRECTIVES, Breadcrumbs, Autodocs, DemoBlock, HighlightedCode]
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw!../../../components/breadcrumbs/breadcrumbs.component.ts');
    isDisabled: boolean = true;
}
