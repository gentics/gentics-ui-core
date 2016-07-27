import {TemplateParser} from '@angular/compiler/src/template_parser';
import {AppView} from '@angular/core/src/linker/view';
import {ElementInjector} from '@angular/core/src/linker/element_injector';
import {ReflectiveInjector_} from '@angular/core/src/di/reflective_injector';
import {DirectiveNormalizer} from '@angular/compiler/src/directive_normalizer';

let monkeyPatched = false;

// TODO: remove when angular template compiler logs errors correctly
export function logTemplateErrors(): any {
    if (!monkeyPatched) {

        TemplateParser.prototype.parse = logErrors(TemplateParser.prototype.parse, (_, err) => err.message);

        AppView.prototype.injectorGet = logErrors(AppView.prototype.injectorGet, token =>
            `No provider for ${token.name}. Did you forget to provide some dependencies?`);

        ElementInjector.prototype.get = logErrors(ElementInjector.prototype.get, token =>
            `No provider for ${token.name}. Did you forget to provide some dependencies?`);

        let refInjectorProto: any = ReflectiveInjector_.prototype;
        refInjectorProto._throwOrNull = logErrors(refInjectorProto._throwOrNull, token =>
            `No provider for ${token.displayName}. Did you forget to provide some dependencies?`);

        DirectiveNormalizer.prototype.normalizeLoadedTemplate = logErrors(
            DirectiveNormalizer.prototype.normalizeLoadedTemplate, (_, err) => err.message);

        monkeyPatched = true;
    }
    return [];
}

function logErrors<T extends Function>(originalMethod: T, handle: (firstArg: any, error: Error) => string): T {
    return <any> function (firstArg: any): any {
        try {
            return originalMethod.apply(this, arguments);
        } catch (err) {
            console.error('[debug] ' + handle(firstArg, err));
            throw err;
        }
    };
}

