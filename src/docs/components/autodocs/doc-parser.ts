const marked = require('marked');
const hljs = require('highlight.js');

// noinspection TsLint
const DOC_BLOCK_RE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\/[\r\n\s]*@(\w+)(?:\(([\w\']*)\)\s+(?:\s*get\s*)?(\w*)(?:\(\))?:\s*([\w<>]+)(?:\s*=\s*([^;]+))?)?/g;

export interface IDocBlock {
    decorator: string;
    identifier: string;
    type: string;
    defaultValue: string;
    body: string;
}

/**
 * Parse a source file and return HTML documentation to be
 * displayed directly in the page.
 */
export function parseDocs(src: string): IDocBlock[] {
    return getDocBlocks(src);
}

/**
 * Use the DOC_BLOCK_RE regex to parse out the doc blocks
 * from the source string. The regex returns the following
 * groups:
 *
 * 0: The full string match (not used)
 * 1: The comment block
 * 2: Decorator (Component, Input, Output etc.)
 * 3: Decorator argument (e.g. "foo" in `@Input('foo')`)
 * 4: Identifier
 * 5: Type
 * 6: Default value
 */
function getDocBlocks(src: string): IDocBlock[] {
    let blocks: IDocBlock[] = [];
    let matches: any;
    marked.setOptions({
        highlight: (code: string): string => {
            return hljs.highlightAuto(code).value;
        }
    });
    while (matches = DOC_BLOCK_RE.exec(src)) {
        let block = <IDocBlock> {
            body: marked(stripStars(matches[1])),
            decorator: matches[2]
        };

        if (matches[3]) {
            block.identifier = matches[3];
        } else if (matches[4]) {
            block.identifier = matches[4];
        }

        if (matches[5]) {
            block.type = matches[5];
        }

        if (matches[6]) {
            block.defaultValue = matches[6];
        }
        blocks.push(block);
    }
    return blocks;
}

/**
 * Remove the `*` and padding from the doc block body.
 */
function stripStars(body: string): string {
    return body.replace(/^\s*\*\s?/mg, '').trim();
}
