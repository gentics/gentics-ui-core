import {Component} from 'angular2/core';
import {TopBar, SearchBar, ListPane, ContentPane, SplitViewContainer} from '../index';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [TopBar, SearchBar, ListPane, ContentPane, SplitViewContainer],
    styles: [require('./app.scss').toString()]
})
export class App {

    onSearch(query : string) : void {
        console.log('searching for', query);
    }

}
