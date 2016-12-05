import {Component} from '@angular/core';

@Component({
    template: require('./search-bar-demo.tpl.html')
})
export class SearchBarDemo {
    componentSource: string = require('!!raw-loader!../../../components/search-bar/search-bar.component.ts');

    changeCount: number = 0;
    searchCount: number = 0;
    clearCount: number = 0;

    term: string = 'search term';
    hideClearButton: boolean = false;
}
