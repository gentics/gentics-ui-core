import {expect, describe, it, beforeEachProviders, inject} from 'angular2/testing';
import {SplitViewContainer} from './split-view-container.component';

describe('SplitViewContainer', () => {
    beforeEachProviders(() => [SplitViewContainer]);

    it('has properties for "hasContent" and "contentFocused"', () => {
        let container : SplitViewContainer = new SplitViewContainer();
        expect(container.hasContent).toBeDefined();
        expect(container.contentFocused).toBeDefined();
    });

    describe('#toggleHasContent', () => {
        it('inverts the current value of the "hasContent" property', () => {
            let container : SplitViewContainer = new SplitViewContainer();
            container.hasContent = false;
            expect(container.hasContent).toBe(false);
            container.toggleHasContent();
            expect(container.hasContent).toBe(true);
            container.toggleHasContent();
            expect(container.hasContent).toBe(false);
        });
    });

    describe('#toggleFocused', () => {
        it('inverts the current value of the "contentFocused" property', () => {
            let container : SplitViewContainer = new SplitViewContainer();
            container.contentFocused = false;
            expect(container.contentFocused).toBe(false);
            container.toggleFocused();
            expect(container.contentFocused).toBe(true);
            container.toggleFocused();
            expect(container.contentFocused).toBe(false);
        });
    });
});
