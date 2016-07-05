import {Component, Input, ElementRef} from '@angular/core';
import {parseDocs, IDocumentation} from './doc-parser';
import {AutodocTable} from './autodoc-table.component';
import {TrustedHTMLPipe} from '../trusted-html/trusted-html.pipe';

/**
 * Accepts a string of the component's source code, parses it and renders the
 * resulting documentation.
 */
@Component({
    selector: 'gtx-autodocs',
    template: require('./autodocs.tpl.html'),
    directives: [AutodocTable],
    pipes: [TrustedHTMLPipe]
})
export class Autodocs {

    @Input() source: string;
    @Input() type: 'component' | 'service' = 'component';

    docs: IDocumentation;

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.docs = parseDocs(this.source, this.type);
        setTimeout(() => $(this.elementRef.nativeElement).find('pre>code').addClass('hljs'));
    }
}
