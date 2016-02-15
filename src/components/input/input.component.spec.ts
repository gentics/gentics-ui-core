import {expect, describe, it, beforeEachProviders, inject} from 'angular2/testing';
import {InputField} from './input.component';

describe('InputField', () => {
    beforeEachProviders(() => [InputField]);
    it('has properties for id, type and value', () => {
        let input : InputField = new InputField();
        expect(input.id).toBeDefined();
        expect(input.type).toBeDefined();
        expect(input.value).toBeDefined();
        expect(input['name']).toBeUndefined();
    });

});

describe('test', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
 
    // it('should fail', () => {
    //     expect(true).toBe(false);
    // });
});
