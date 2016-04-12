import {Component, Input} from 'angular2/core';
import {parseDocs, IDocBlock} from './doc-parser';
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
    componentBody: string;
    inputs: IDocBlock[];
    outputs: IDocBlock[];

    ngOnInit(): void {
        let blocks = parseDocs(this.source);
        let componentBlock = blocks.filter((d: IDocBlock) => d.decorator === 'Component')[0];
        this.componentBody = componentBlock ? componentBlock.body : '';
        this.inputs = blocks.filter((d: IDocBlock) => d.decorator === 'Input');
        this.outputs = blocks.filter((d: IDocBlock) => d.decorator === 'Output');
    }
}
