import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopBar, SearchBar, ListPane, ContentPane, SideMenu, SplitViewContainer} from '../index';
import {Colors} from './components/colors/colors.component';
import {Typography} from './components/typography/typography.component';
import {FormComponents} from './components/form-components/form-components.component';
import {UiComponents} from './components/ui-components/ui-components.component';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [ROUTER_DIRECTIVES, TopBar, SearchBar, ListPane, ContentPane, SplitViewContainer, SideMenu],
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

    onSearch(query: string): void {
        console.log('searching for', query);
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }
}
