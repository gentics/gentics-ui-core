import {Component, Input, ElementRef} from '@angular/core';
import {parseDocs, IDocumentation, ISource} from './doc-parser';

/**
 * Accepts a string of the component's source code, parses it and renders the
 * resulting documentation.
 */
@Component({
    selector: 'gtx-autodocs',
    templateUrl: './autodocs.tpl.html'
})
export class Autodocs {

    @Input() source: ISource;
    @Input() type: 'component' | 'service' = 'component';

    docs: IDocumentation;

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.docs = parseDocs(this.source, this.type);
        setTimeout(() => this.addClassToElements('pre>code', 'hljs'));
    }

    private addClassToElements(selector: string, className: string): void {
        const elements = this.elementRef.nativeElement.querySelectorAll(selector);
        Array.from<HTMLElement>(elements).forEach(el => el.classList.add(className));
    }
}
