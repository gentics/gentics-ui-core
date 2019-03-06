const marked = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
    highlight: (code: string, lang: string): string => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code, true).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
});

/* tslint:disable:max-line-length */
// noinspection TsLint
const COMPONENT_RE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\/[\r\n\s]*(?:@|)(\w+)(?:\(([\w']*)\)\s+(?:\s*(?:get|set)\s*)?(\w*)(?:\([\w:\s]*\))?(?:(?::\s*([\w<>\|\[\]'\s]+))?(?:\s*=\s*([^;]+))?)?)?/g;
// noinspection TsLint
const SERVICE_RE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\/ *(?:\r\n?|\n) *(private|public|@Injectable)? *([\w\-< >]*)(?:\(([\w :,\?\[\]\{\}\r\n\t<>]*)\))?(?:: ([\w<>\{} :\(\)=]*))?[^\r\n]+/g;
/* tslint:enable */


export interface DocBlock {
    identifier: string;
    body: string;
    type: string;
    defaultValue?: string;
    decorator?: string;
    accessModifier?: 'public' | 'private';
    methodArgs?: string[];
}

export interface IDocumentation {
    type: 'component' | 'service';
    main: string;
    inputs: DocBlock[];
    outputs: DocBlock[];
    properties: DocBlock[];
    methods: DocBlock[];
}

/**
 * Parse a source file and return HTML documentation to be
 * displayed directly in the page.
 */
export function parseDocs(src: string, type: 'component' | 'service' = 'component'): IDocumentation {
    if (type === 'component') {
        let blocks = parseComponentSource(src);
        let mainBlock = blocks.filter((d: DocBlock) => d.decorator === 'Component')[0];
        return {
            type,
            main: mainBlock.body,
            inputs: blocks.filter((d: DocBlock) => d.decorator === 'Input'),
            outputs: blocks.filter((d: DocBlock) => d.decorator === 'Output'),
            properties: [],
            methods: []
        };
    } else if (type === 'service') {
        let blocks = parseServiceSource(src);
        let mainBlock = blocks.filter((d: DocBlock) => d.accessModifier as any === '@Injectable')[0];
        let publicBlocks = blocks.filter((d: DocBlock) => d.accessModifier === 'public');
        return {
            type,
            main: mainBlock.body,
            inputs: [],
            outputs: [],
            properties: publicBlocks.filter((d: DocBlock) => d.methodArgs === undefined || d.identifier.indexOf('get ') === 0),
            methods: publicBlocks.filter((d: DocBlock) => d.methodArgs !== undefined && d.identifier.indexOf('get ') !== 0)
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
function parseComponentSource(src: string): DocBlock[] {
    const blocks: DocBlock[] = [];
    const regex = new RegExp(COMPONENT_RE);
    let matches: RegExpExecArray;

    while (matches = regex.exec(src)) {
        const [, body, decorator, decoratorArgument, varName, blockType, defaultValue] = matches;

        const block: DocBlock = {
            body: marked(stripStars(body)),
            decorator,
            identifier: decoratorArgument || varName,
            type: blockType,
            defaultValue
        };

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
function parseServiceSource(src: string): DocBlock[] {
    const blocks: DocBlock[] = [];
    const regex = new RegExp(SERVICE_RE);
    let matches: RegExpExecArray;

    while (matches = regex.exec(src)) {
        const [, body, accessModifier, identifier, methodArgs, typeOrReturnType] = matches;

        const block: DocBlock = {
            body: marked(stripStars(matches[1])),
            identifier,
            accessModifier: accessModifier as 'public' | 'private',
            methodArgs: methodArgs
                && methodArgs.split(',').map(arg => arg.trim()).filter(arg => arg !== ''),
            type: typeOrReturnType
        };

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
