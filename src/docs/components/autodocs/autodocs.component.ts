import {Component, Input} from 'angular2/core';
import {parseDocs, IDocumentation} from './doc-parser';
import {AutodocTable} from './autodoc-table.component';

/**
 * Accepts a string of the component's source code, parses it and renders the
 * resulting documentation.
 */
@Component({
    selector: 'gtx-autodocs',
    template: require('./autodocs.tpl.html'),
    directives: [AutodocTable]
})
export class Autodocs {

    @Input() source: string;
    @Input() type: 'component' | 'service' = 'component';

    docs: IDocumentation;

    ngOnInit(): void {
        this.docs = parseDocs(this.source, this.type);
    }
}
