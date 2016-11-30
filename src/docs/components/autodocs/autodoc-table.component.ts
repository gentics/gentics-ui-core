import {Component, Input} from '@angular/core';
import {DocBlock} from './doc-parser';

@Component({
    selector: 'gtx-autodoc-table',
    template: require('./autodoc-table.tpl.html')
})
export class AutodocTable {
    @Input() docBlocks: DocBlock[];
    identifierLabel: string = 'Name';
    headers: string[];
    props: string[];

    ngOnInit(): void {
        let firstBlock = this.docBlocks[0];
        if (firstBlock.decorator === 'Input') {
            // Inputs
            this.headers = ['Attribute', 'Type', 'Default Value', 'Comments'];
            this.props = ['identifier', 'type', 'defaultValue', 'body'];
        } else if (firstBlock.decorator === 'Output') {
            // Outputs
            this.headers = ['Event', 'Type', 'Default Value', 'Comments'];
            this.props = ['identifier', 'type', 'defaultValue', 'body'];
        } else if (firstBlock.methodArgs) {
            // Methods
            this.headers = ['Method', 'Args', 'Return Value', 'Comments'];
            this.props = ['identifier', 'methodArgs', 'type', 'body'];
        } else {
            // Properties
            this.headers = ['Property', 'Type', 'Default Value', 'Comments'];
            this.props = ['identifier', 'type', 'defaultValue', 'body'];
        }
    }

}
