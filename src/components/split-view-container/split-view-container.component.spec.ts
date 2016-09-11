import {ComponentFixture} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {tick} from '@angular/core/testing';

import {componentTest} from '../../testing';
import {SplitViewContainer} from './split-view-container.component';


describe('SplitViewContainer', () => {

    it('should have a "rightPanelVisible" property that allows double-binding',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="hasRight"
                (rightPanelVisibleChange)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                const instance: TestComponent = fixture.componentInstance;
                instance.hasRight = false;

                fixture.detectChanges();
                tick();

                instance.testHandler = jasmine.createSpy('rightPanelVisibleChange');
                instance.hasRight = true;
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalledWith(true);

                instance.testHandler = jasmine.createSpy('rightPanelVisibleChange');
                instance.hasRight = false;
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalledWith(false);
            }
        )
    );

    it('should have a "focusedPanel" property that allows double-binding',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="true"
                [focusedPanel]="focusedSide"
                (focusedPanelChange)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                const instance: TestComponent = fixture.componentInstance;
                instance.focusedSide = 'left';

                fixture.detectChanges();
                tick();

                instance.testHandler = jasmine.createSpy('focusedPanelChange');
                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalledWith('right');

                instance.testHandler = jasmine.createSpy('focusedPanelChange');
                instance.focusedSide = 'left';
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalledWith('left');
            }
        )
    );

    it('should transclude elements with "left" and "right" attribute to the container on their side',
        componentTest(() => TestComponent, `
            <gtx-split-view-container>
                <div right class="should-be-right"></div>
                <div left class="should-be-left"></div>
            </gtx-split-view-container>`,
            fixture => {
                fixture.detectChanges();
                tick();
                const left: HTMLParagraphElement = fixture.nativeElement.querySelector('.should-be-left');
                const right: HTMLParagraphElement = fixture.nativeElement.querySelector('.should-be-right');

                // Helper function that compares the order of HTML elements
                function comesFirstInDOM(nodeA: HTMLElement, nodeB: HTMLElement): boolean {
                    while (nodeA.parentElement && nodeB.parentElement) {
                        if (nodeA.parentElement == nodeB.parentElement) {
                            let indexA: number = [].indexOf.call(nodeA.parentElement.children, nodeA);
                            let indexB: number = [].indexOf.call(nodeB.parentElement.children, nodeB);
                            return (indexA < indexB);
                        }
                        nodeA = nodeA.parentElement;
                        nodeB = nodeB.parentElement;
                    }
                    return false;
                }

                expect(comesFirstInDOM(left, right)).toBe(true);
            }
        )
    );

    it('should change "focusedPanel" to "left" when the right panel is hidden/closed',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [(focusedPanel)]="focusedSide"
                [rightPanelVisible]="hasRight">
            </gtx-split-view-container>`,
            fixture => {
                const instance: TestComponent = fixture.componentInstance;
                instance.hasRight = true;
                fixture.detectChanges();
                tick();

                expect(instance.focusedSide).toBe('left');

                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();
                expect(instance.focusedSide).toBe('right');

                instance.hasRight = false;
                fixture.detectChanges();
                tick();
                expect(instance.hasRight).toBe(false);
                expect(instance.focusedSide).toBe('left');
            }
        )
    );

    it('should emit "rightPanelOpened" when "rightPanelVisible" is changed to true',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="hasRight"
                (rightPanelOpened)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                const instance: TestComponent = fixture.componentInstance;
                instance.hasRight = false;
                fixture.detectChanges();
                tick();
                expect(instance.hasRight).toBe(false);

                instance.testHandler = jasmine.createSpy('rightPanelOpened');
                instance.hasRight = true;
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalled();
            }
        )
    );

    it('should emit "rightPanelClosed" when "rightPanelVisible" is changed to false',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="hasRight"
                (rightPanelClosed)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                const instance: TestComponent = fixture.componentInstance;
                instance.hasRight = true;
                fixture.detectChanges();
                tick();
                expect(instance.hasRight).toBe(true);

                instance.testHandler = jasmine.createSpy('rightPanelClosed');
                instance.hasRight = false;
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalled();
            }
        )
    );

    it('should emit "leftPanelFocused" when "focusedPanel" is changed to "left"',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="true"
                [focusedPanel]="focusedSide"
                (leftPanelFocused)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();

                instance.testHandler = jasmine.createSpy('leftPanelFocused');
                instance.focusedSide = 'left';
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalled();
            }
        )
    );

    it('should emit "rightPanelFocused" when "focusedPanel" is changed to "right"',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="true"
                [focusedPanel]="focusedSide"
                (rightPanelFocused)="testHandler($event)">
            </gtx-split-view-container>`,
            fixture => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                instance.focusedSide = 'left';
                fixture.detectChanges();
                tick();

                instance.testHandler = jasmine.createSpy('rightPanelFocused');
                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();
                expect(instance.testHandler).toHaveBeenCalled();
            }
        )
    );

});



@Component({
    template: `<gtx-split-view-container></gtx-split-view-container>`,
    directives: [SplitViewContainer]
})
class TestComponent {
    hasRight: boolean = false;
    focusedSide: string = '';
    testHandler(): void {}
}
