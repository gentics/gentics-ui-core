import {Component} from '@angular/core';
import {SearchBar} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';
import {Checkbox} from '../../../../dist/components/checkbox/checkbox.component';

@Component({
    template: require('./search-bar-demo.tpl.html'),
    directives: [SearchBar, Checkbox, Autodocs, DemoBlock, HighlightedCode]
})
export class SearchBarDemo {
    componentSource: string = require('!!raw!../../../components/search-bar/search-bar.component.ts');

    changeCount: number = 0;
    searchCount: number = 0;
    clearCount: number = 0;

    term: string = 'search term';
    hideClearButton: boolean = false;
}
