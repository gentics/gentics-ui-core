import {parseDocs, IDocBlock} from './doc-parser';

export abstract class BaseDoc {
    
    protected docBlocks: IDocBlock[];
    
    constructor(src?: string) {
        if (src !== undefined) {
            this.docBlocks = parseDocs(src);
        }
    }
}
