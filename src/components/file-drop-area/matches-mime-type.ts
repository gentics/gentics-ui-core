/**
 * Matches a mime type against a list of allowed/disallowed types.
 * @example
 *   matchesMimeType('text/plain', 'text/*')                  // true
 *   matchesMimeType('image/jpeg', 'text/*')                  // false
 *   matchesMimeType('text/plain', ['text/*', 'image/*'])     // true
 *   matchesMimeType('image/gif', ['image/*', '!image/gif'])  // false
 */
export function matchesMimeType(type: string, allowedTypes: string | string[]): boolean {
    if (typeof type !== 'string' || !allowedTypes || !allowedTypes.length) {
        return false;
    }

    if (allowedTypes.length === 1 && allowedTypes[0] === '*') {
        return true;
    }

    let patterns = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    let regex = compilePatternsToRegex(patterns);
    return regex.test(type);
}

const patternCache: { [k: string]: RegExp } = {};
function compilePatternsToRegex(patterns: string[]): RegExp {
    let hash = patterns.join('||');
    if (patternCache[hash]) {
        return patternCache[hash];
    }

    let parts = patterns.map(pattern => pattern.replace(/([\/\.\\\?\(\)\[\]\{\}])/g, '\\$1').replace(/\*/g, '.+'));
    let inclusions: string = parts.filter(part => part[0] !== '!').map(s => s === '.+' ? '.*' : s).join('|');
    let exclusions: string = parts.filter(part => part[0] === '!').map(s => s.substr(1)).join('|');
    if (exclusions && (!inclusions || inclusions === '.+')) {
        inclusions = '.*';
    }
    let regexStr = exclusions ? `^(?!(?:${exclusions}$))(?:${inclusions || '.+'})$` : `^(?:${inclusions})$`;
    return patternCache[hash] = new RegExp(regexStr);
}
