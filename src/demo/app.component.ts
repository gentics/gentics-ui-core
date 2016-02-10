import {Component} from 'angular2/core';
import {SearchBar, ListPane, ContentPane, SplitViewContainer} from '../index';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [SearchBar, ListPane, ContentPane, SplitViewContainer]
})
export class App {

    onSearch(query : string) : void {
        console.log('searching for', query);
    }

}
