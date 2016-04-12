import {Component, Input} from 'angular2/core';
import {IDocBlock} from './doc-parser';

@Component({
    selector: 'gtx-autodoc-table',
    template: require('./autodocsTable.tpl.html')
})
export class AutodocTable {
    @Input() docBlocks: IDocBlock[];
    identifierLabel: string = 'Name';

    ngOnInit(): void {
        let decorator = this.docBlocks[0].decorator;
        if (decorator === 'Input') {
            this.identifierLabel = 'Attribute';
        } else if (decorator === 'Output') {
            this.identifierLabel = 'Event';
        }
    }
}
