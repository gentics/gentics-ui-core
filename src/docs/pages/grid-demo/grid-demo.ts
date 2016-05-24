import {Component} from '@angular/core';
import {HighlightedCode} from '../../components';

@Component({
    template: require('./grid-demo.tpl.html'),
    directives: [HighlightedCode]
})
export class GridDemo {}
