import {Component, Input, ElementRef} from 'angular2/core';
const hljs = require('highlight.js');

@Component({
    selector: 'gtx-highlighted-code',
    template: `<pre><code [class]="language">{{ formattedCode }}</code></pre>`
})
export class HighlightedCode {

    @Input() language: string;
    @Input() code: string;

    formattedCode: string;

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.formattedCode = this.formatCodeContents(this.code);
    }

    ngAfterViewInit(): void {
        let codeEl = this.elementRef.nativeElement.querySelector('code');
        hljs.highlightBlock(codeEl);
    }

    /**
     * Remove extra whitespace from start and end, and automatically detect the
     * extra indentation and remove it from each line.
     */
    private formatCodeContents(contents: string): string {
        let lines: string[] = contents
            .split(/\r?\n/)
            .filter((line: string) => 0 < line.trim().length);
        let indentation: number = lines[0].match(/^\s*/)[0].length;
        return lines.map((line: string) => {
            if (line.substring(0, indentation).trim() === '') {
                return line.substring(indentation, line.length);
            } else {
                return line;
            }
        }).join('\n');
    }

}
