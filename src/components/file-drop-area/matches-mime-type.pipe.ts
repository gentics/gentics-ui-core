import {Pipe, PipeTransform} from '@angular/core';

import {matchesMimeType} from './matches-mime-type';

@Pipe({ name: 'matchesMimeType', pure: true })
export class MatchesMimeTypePipe implements PipeTransform {

    transform(input: string, allowedMimeTypes: string): boolean;
    transform(input: { type: string }[], allowedMimeTypes: string): { type: string }[];
    transform(input: { type: string }[], mode: 'all' | 'any', allowedMimeTypes: string): { type: string }[];
    transform(input: { type: string }[], allowedMimeTypes: string, mode: 'all' | 'any'): { type: string }[];
    transform(value: string | { type: string }[], secondArg: string, thirdArg?: any): any {
        if (typeof value === 'string') {
            return matchesMimeType(value, secondArg);
        } else if (!value) {
            return value;
        } else if (!value.length || !Array.isArray(value)) {
            return undefined;
        }

        let array = <{ type: string }[]> value;
        if (secondArg === 'all') {
            return array.every(val => matchesMimeType(val.type, thirdArg));
        } else if (secondArg === 'any') {
            return array.some(val => matchesMimeType(val.type, thirdArg));
        }
        if (thirdArg === 'all') {
            return array.every(val => matchesMimeType(val.type, secondArg));
        } else if (thirdArg === 'any') {
            return array.some(val => matchesMimeType(val.type, secondArg));
        }

        return false;
    }

}
