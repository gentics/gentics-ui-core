import {Component} from '@angular/core';

@Component({
    templateUrl: './breadcrumbs-demo.tpl.html'
})
export class BreadcrumbsDemo {
    componentSource: string = require('!!raw-loader!../../../components/breadcrumbs/breadcrumbs.component.ts');
    isDisabled: boolean = true;

    routerLinks: any[] = [
        { text: 'Index' },
        { text: 'Demo' },
        { text: 'Hardware' },
        { text: 'Components' },
        { text: 'Monitors' },
        { text: 'Index' },
        { text: 'Demo' },
        { text: 'Hardware' },
        { text: 'Index' },
        { text: 'Demo' },
        { text: 'Hardware' }
    ];

    isChanged: boolean = false;

    multiline: boolean = false;
    multilineExpanded: boolean = true;

    onClick() {
        this.isChanged = !this.isChanged;
        if (this.isChanged) {
            this.routerLinks = [
                { text: 'Index' },
                { text: 'Some Item' },
                { text: 'Some Item 2 '},
                { text: 'Index' },
                { text: 'Some Item' },
                { text: 'Some Item 2 '},
                { text: 'Index' },
                { text: 'Some Item' },
                { text: 'Some Item 2 '}
            ];
        } else {
            this.routerLinks = [
                { text: 'Index' },
                { text: 'Demo' },
                { text: 'Hardware' },
                { text: 'Components' },
                { text: 'Monitors' },
                { text: 'Index' },
                { text: 'Demo' },
                { text: 'Hardware' },
                { text: 'Index' },
                { text: 'Demo' },
                { text: 'Hardware' }
            ];
        }

    }
}


