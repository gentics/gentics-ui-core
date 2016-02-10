import {Component} from 'angular2/core';
import {SearchBar} from '../components/search-bar/search-bar.component';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [SearchBar]
})
export class App {

    onSearch(query : string) : void {
        console.log('searching for', query);
    }

}
