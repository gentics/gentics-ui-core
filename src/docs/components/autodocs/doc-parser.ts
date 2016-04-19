const marked = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
    highlight: (code: string, lang: string): string => {
        if (lang !== undefined) {
            return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// noinspection TsLint
const COMPONENT_RE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\/[\r\n\s]*(?:@|)(\w+)(?:\(([\w']*)\)\s+(?:\s*(?:get|set)\s*)?(\w*)(?:\([\w:\s]*\))?(?::\s*([\w<>\|\[\]]+)(?:\s*=\s*([^;]+))?)?)?/g;
// noinspection TsLint
const SERVICE_RE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\/ *[\r\n] *(private|public|@Injectable)? *([\w\-]*)(?:\(([\w :]*)\))?(?:: ([\w<>\{} :\(\)=]*))?[^\r\n]+/g;


export interface IDocBlock {
    identifier: string;
    body: string;
    type: string;
    defaultValue: string;
    decorator?: string;
    accessModifier?: 'public' | 'private';
    methodArgs?: string;
}

export interface IDocumentation {
    type: 'component' | 'service';
    main: string;
    inputs: IDocBlock[];
    outputs: IDocBlock[];
    properties: IDocBlock[];
    methods: IDocBlock[];
}

/**
 * Parse a source file and return HTML documentation to be
 * displayed directly in the page.
 */
export function parseDocs(src: string, type: 'component' | 'service' = 'component'): IDocumentation {
    if (type === 'component') {
        let blocks = parseComponentSource(src);
        let mainBlock = blocks.filter((d: IDocBlock) => d.decorator === 'Component')[0];
        return {
            type,
            main: mainBlock.body,
            inputs: blocks.filter((d: IDocBlock) => d.decorator === 'Input'),
            outputs: blocks.filter((d: IDocBlock) => d.decorator === 'Output'),
            properties: [],
            methods: []
        };
    } else if (type === 'service') {
        let blocks = parseServiceSource(src);
        let mainBlock = blocks.filter((d: IDocBlock) => d.accessModifier === '@Injectable')[0];
        let publicBlocks = blocks.filter((d: IDocBlock) => d.accessModifier === 'public');
        return {
            type,
            main: mainBlock.body,
            inputs: [],
            outputs: [],
            properties: publicBlocks.filter((d: IDocBlock) => d.methodArgs === undefined),
            methods: publicBlocks.filter((d: IDocBlock) => d.methodArgs !== undefined)
        };
    }
}

/**
 * Use the COMPONENT_RE regex to parse out the doc blocks
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
function parseComponentSource(src: string): IDocBlock[] {
    let blocks: IDocBlock[] = [];
    let matches: any;

    while (matches = COMPONENT_RE.exec(src)) {
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
 * Use the SERVICE_RE regex to parse out the doc blocks
 * from the source string. The regex returns the following
 * groups:
 *
 * 0: The full string match (not used)
 * 1: The comment block
 * 2: Access modifier (or @Injectable in the case of the class itself)
 * 3: Identifier
 * 4: Method args. If undefined, this is not a method.
 * 5: Type or Return Type
 */
function parseServiceSource(src: string): IDocBlock[] {
    let blocks: IDocBlock[] = [];
    let matches: any;

    while (matches = SERVICE_RE.exec(src)) {
        let block = <IDocBlock> {
            body: marked(stripStars(matches[1])),
            identifier: matches[3]
        };

        if (matches[2]) {
            block.accessModifier = matches[2];
        }

        if (matches[4] !== undefined) {
            block.methodArgs = matches[4];
        }

        if (matches[5]) {
            block.type = matches[5];
        }
        blocks.push(block);
    }
    return blocks;
}

/**
 * Remove the `*` and padding from the doc block body.
 */
function stripStars(body: string): string {
    return body.replace(/^\s*\*(\s?)/mg, '$1').trim();
}
