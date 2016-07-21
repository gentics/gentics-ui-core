import {TemplateParser} from '@angular/compiler/src/template_parser';

let parserMonkeyPatched = false;

// TODO: remove when angular template compiler logs errors correctly
export function logTemplateErrors(): any {
    if (!parserMonkeyPatched) {
        let original = TemplateParser.prototype.parse;
        TemplateParser.prototype.parse = function (...args: any[]): any {
            try {
                return original.apply(this, args);
            } catch (err) {
                console.error(err.message);
                throw err;
            }
        };
        parserMonkeyPatched = true;
    }
    return [];
}
