import {Component, Input, ElementRef} from '@angular/core';
import {parseDocs, IDocumentation} from './doc-parser';

/**
 * Accepts a string of the component's source code, parses it and renders the
 * resulting documentation.
 */
@Component({
    selector: 'gtx-autodocs',
    template: require('./autodocs.tpl.html')
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
