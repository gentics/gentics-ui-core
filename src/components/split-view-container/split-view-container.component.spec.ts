import {expect, describe, it, beforeEachProviders, inject} from 'angular2/testing';
import {TestComponentBuilder, ComponentFixture} from 'angular2/testing';
import {DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';

import {SplitViewContainer} from './split-view-container.component';

export function main(): void {
    describe('SplitViewContainer', () => {
        let builder: TestComponentBuilder;
        beforeEach(<any> inject([TestComponentBuilder], (tcb: TestComponentBuilder): void => {
            builder = tcb;
        }));

        it('has properties for "hasContent" and "contentFocused"', (done: () => void) => {
            return builder.createAsync(SplitViewContainer).then((fixture: ComponentFixture): void => {
                const container: SplitViewContainer = fixture.debugElement.componentInstance;
                expect(container.hasContent).toBeDefined();
                expect(container.contentFocused).toBeDefined();
                done();
            });
        });

        describe('#toggleContentPanel', () => {
            it('inverts the current value of the "hasContent" property', (done: () => void) => {
                return builder.createAsync(SplitViewContainer).then((fixture: ComponentFixture): void => {
                    const container: SplitViewContainer = fixture.debugElement.componentInstance;
                    container.hasContent = false;
                    expect(container.hasContent).toBe(false);
                    container.toggleContentPanel();
                    expect(container.hasContent).toBe(true);
                    container.toggleContentPanel();
                    expect(container.hasContent).toBe(false);
                    done();
                });
            });

            it('changes focus when no content is available', (done: () => void) => {
                return builder.createAsync(SplitViewContainer).then((fixture: ComponentFixture): void => {
                    const container: SplitViewContainer = fixture.debugElement.componentInstance;
                    container.hasContent = true;
                    container.contentFocused = true;
                    expect(container.contentFocused).toBe(true);
                    container.toggleContentPanel();
                    expect(container.contentFocused).toBe(false);
                    container.toggleContentPanel();
                    expect(container.contentFocused).toBe(false);
                    done();
                });
            });
        });
    });
}
