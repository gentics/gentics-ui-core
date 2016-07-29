import {matchesMimeType} from './matches-mime-type';

describe('matchesMimeType', () => {

    it('accepts any non-empty input with "*"', () => {
        expect(matchesMimeType('text/plain', '*')).toBe(true);
        expect(matchesMimeType('image/png', '*')).toBe(true);
        expect(matchesMimeType('invalid', '*')).toBe(true);
        expect(matchesMimeType(null, '*')).toBe(false);
        expect(matchesMimeType(undefined, '*')).toBe(false);
    });

    it('accepts an empty string with "*"', () => {
        expect(matchesMimeType('', '*')).toBe(true);
    });

    it('accepts an empty string with negating patterns', () => {
        expect(matchesMimeType('', '*, !image/*')).toBe(true);
        expect(matchesMimeType('', '!image/*')).toBe(true);
    });


    it('does not accept an empty string with "*/*"', () => {
        expect(matchesMimeType('', '*/*')).toBe(false);
    });

    it('accepts any valid mime type with "*/*"', () => {
        expect(matchesMimeType('text/plain', '*/*')).toBe(true);
        expect(matchesMimeType('image/png', '*/*')).toBe(true);
        expect(matchesMimeType('invalid', '*/*')).toBe(false);
        expect(matchesMimeType(null, '*/*')).toBe(false);
        expect(matchesMimeType(undefined, '*/*')).toBe(false);
    });

    it('rejects any invalid input', () => {
        expect(matchesMimeType('text/plain', <any> [])).toBe(false);
        expect(matchesMimeType('image/png', <any> [])).toBe(false);
        expect(matchesMimeType('', <any> [])).toBe(false);
        expect(matchesMimeType('', '')).toBe(false);
        expect(matchesMimeType('*', '')).toBe(false);
        expect(matchesMimeType(null, '*')).toBe(false);
        expect(matchesMimeType(null, 'text/plain')).toBe(false);
        expect(matchesMimeType(undefined, '*')).toBe(false);
        expect(matchesMimeType(undefined, 'text/plain')).toBe(false);
    });

    it('matches constant strings', () => {
        expect(matchesMimeType('text/plain', 'text/plain')).toBe(true);
        expect(matchesMimeType('text/javascript', 'text/plain')).toBe(false);
        expect(matchesMimeType('image/png', 'image/png')).toBe(true);
        expect(matchesMimeType('image/gif', 'image/png')).toBe(false);
    });

    it('matches asterisks', () => {
        expect(matchesMimeType('image/png', 'image/*')).toBe(true);
        expect(matchesMimeType('image/jpeg', 'image/*')).toBe(true);
        expect(matchesMimeType('text/plain', 'image/*')).toBe(false);
    });

    it('allows negation like ["image/*", "!image/gif"]', () => {
        expect(matchesMimeType('image/png', 'image/*, !image/gif')).toBe(true);
        expect(matchesMimeType('image/gif', 'image/*, !image/gif')).toBe(false);
        expect(matchesMimeType('text/plain', 'image/*, !image/gif')).toBe(false);
        expect(matchesMimeType('text/plain', '!image/*')).toBe(true);
        expect(matchesMimeType('image/png', '!image/*')).toBe(false);
    });

});
