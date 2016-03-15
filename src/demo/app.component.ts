import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopBar, SearchBar, ListPane, ContentPane, SideMenu, SplitViewContainer, ContentsListItem} from '../index';
import {Colors} from './components/colors/colors.component';
import {Typography} from './components/typography/typography.component';
import {FormComponents} from './components/form-components/form-components.component';
import {UiComponents} from './components/ui-components/ui-components.component';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [
        ROUTER_DIRECTIVES,
        TopBar,
        SearchBar,
        ListPane,
        ContentPane,
        SplitViewContainer,
        SideMenu,
        ContentsListItem
    ],
    styles: [require('./app.scss').toString()]
})
@RouteConfig([
    { path: '/colors', name: 'Colors', component: Colors },
    { path: '/typography', name: 'Typography', component: Typography },
    { path: '/form-components', name: 'FormComponents', component: FormComponents },
    { path: '/ui-components', name: 'UiComponents', component: UiComponents }
])
export class App {
    displayMenu: boolean = false;
    listItems: any[] = [
        {
            title: 'Colors',
            route: 'Colors',
            icon: 'color_lens'
        },
        {
            title: 'Typography',
            route: 'Typography',
            icon: 'text_format'
        },
        {
            title: 'Form Components',
            route: 'FormComponents',
            icon: 'check_box'
        },
        {
            title: 'Other UI Components',
            route: 'UiComponents',
            icon: 'view_quilt'
        }
    ];

    private hasContent: boolean = false;
    private splitFocus: string = 'left';

    constructor(private router: Router) {
        router.subscribe(route => { this.hasContent = !!route; });
    }

    closeContent(): void {
        this.hasContent = false;
    }

    onSearch(query: string): void {
        console.log('searching for', query);
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }
}

@Component({
    template: ''
})
class EmptyComponent {}
