import {Component} from '@angular/core';
import {SearchBar} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./search-bar-demo.tpl.html'),
    directives: [SearchBar, Autodocs, DemoBlock, HighlightedCode]
})
export class SearchBarDemo {
    componentSource: string = require('!!raw!../../../components/search-bar/search-bar.component.ts');

    changeCount: number = 0;
    searchCount: number = 0;
    clearCount: number = 0;
}
