import {Component} from 'angular2/core';
import {TopBar, SearchBar, ListPane, ContentPane, SideMenu, SplitViewContainer} from '../index';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [TopBar, SearchBar, ListPane, ContentPane, SplitViewContainer, SideMenu],
    styles: [require('./app.scss').toString()]
})
export class App {

    displayMenu: boolean = false;

    onSearch(query: string): void {
        console.log('searching for', query);
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }
}
