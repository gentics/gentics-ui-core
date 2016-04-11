import {Component, Input} from 'angular2/core';
import {IDocBlock} from './doc-parser';
import {AutodocTable} from './autodoc-table.component';

@Component({
    selector: 'gtx-autodocs',
    template: require('./autodocs.tpl.html'),
    directives: [AutodocTable]
})
export class Autodocs {

    @Input() docBlocks: IDocBlock[];
    inputs: IDocBlock[];
    outputs: IDocBlock[];

    ngOnInit(): void {
        this.inputs = this.docBlocks.filter((d: IDocBlock) => d.decorator === 'Input');
        this.outputs = this.docBlocks.filter((d: IDocBlock) => d.decorator === 'Output');
    }

    /**
     * Return the body text of the main component doc block.
     */
    getComponentBody(): string {
        let componentBlock = this.docBlocks.filter((d: IDocBlock) => d.decorator === 'Component')[0];
        return componentBlock ? componentBlock.body : '';
    }
}
