import {Component, Input, ElementRef} from '@angular/core';
const hljs = require('highlight.js');

/**
 * Code highlighting via highlight.js. To include interpolated vars in the code, use double
 * parents so that Angular does not think the whole thing is a binding. Double parens will get
 * replaced with double curlies in the final output.
 *
 * ```
 * <gtx-highlighted-code language="HTML" code='
 *      My item is (( item ))
 * '></gtx-highlighted-code>
 * ```
 *
 * The above will output "My item is {{ item }}"
 */
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
        this.formattedCode = this.replaceDoubleCurlies(this.formattedCode);
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
        // Remove "ind" characters on whitespace from the start of the line.
        const removeIndentation: Function = (line: string, ind: number) => {
            if (line.substring(0, ind).trim() === '') {
                return line.substring(ind, line.length);
            } else {
                return line;
            }
        };

        let lines: string[] = contents
            .split(/\r?\n/)
            .filter((line: string) => 0 < line.trim().length);
        let indentation: number = lines[0].match(/^\s*/)[0].length;

        return lines.map((line: string) => removeIndentation(line, indentation)).join('\n');
    }

    /**
     * Find any interpolations with `(( var ))` and replace the parens with curlies
     * so it matches the Angular syntax.
     */
    private replaceDoubleCurlies(source: string): string {
        return source.replace(/\(\(\s*(.+)\s*\)\)/g, '{{ $1 }}');
    }

}
