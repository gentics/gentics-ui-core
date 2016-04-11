import {Component, Input} from 'angular2/core';
import {IDocBlock} from './doc-parser';

@Component({
    selector: 'gtx-autodoc-table',
    template: require('./autodocsTable.tpl.html')
})
export class AutodocTable {
    @Input() docBlocks: IDocBlock[];
}
