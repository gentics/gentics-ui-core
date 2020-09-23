import {TestBed, tick} from '@angular/core/testing';
import {Component} from '@angular/core';

import {componentTest} from '../../testing';
import {SplitViewContainer} from './split-view-container.component';
import { By } from '@angular/platform-browser';


describe('SplitViewContainer', () => {

    beforeEach(() => TestBed.configureTestingModule({
        declarations: [SplitViewContainer, TestComponent]
    }));

    it('sets classes depending on the "rightPanelVisible" property',
        componentTest(() => TestComponent, `
            <gtx-split-view-container [rightPanelVisible]="hasRight"></gtx-split-view-container>`,
            (fixture, instance) => {
                instance.hasRight = false;
                fixture.detectChanges();
                tick();

                const slideable: HTMLElement = fixture.nativeElement.querySelector('.slideable');
                expect(slideable.classList).not.toContain('hasRightPanel');
                expect(slideable.classList).toContain('hasNoRightPanel');

                instance.hasRight = true;
                fixture.detectChanges();
                tick();

                expect(slideable.classList).toContain('hasRightPanel');
                expect(slideable.classList).not.toContain('hasNoRightPanel');
            }
        )
    );

    it('sets classes depending on the "focusedPanel" property',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="true"
                [focusedPanel]="focusedSide">
            </gtx-split-view-container>`,
            (fixture, instance) => {
                instance.focusedSide = 'left';
                fixture.detectChanges();
                tick();

                const slideable: HTMLElement = fixture.nativeElement.querySelector('.slideable');
                expect(slideable.classList).not.toContain('focusedRight');
                expect(slideable.classList).toContain('focusedLeft');

                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();

                expect(slideable.classList).toContain('focusedRight');
                expect(slideable.classList).not.toContain('focusedLeft');
            }
        )
    );

    it('emits "focusedPanelChange" when the left or right panels are clicked',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="true"
                [focusedPanel]="focusedSide"
                (focusedPanelChange)="testHandler($event)">
            </gtx-split-view-container>`,
            (fixture, instance) => {
                instance.focusedSide = 'left';

                fixture.detectChanges();
                tick(100);

                const focusSwitcherLeft = fixture.nativeElement.querySelector('.focus-switcher-left') as HTMLElement;
                const focusSwitcherRight = fixture.nativeElement.querySelector('.focus-switcher-right') as HTMLElement;

                instance.testHandler = jasmine.createSpy('focusedPanelChange');
                fixture.detectChanges();
                focusSwitcherRight.click();
                expect(instance.testHandler).toHaveBeenCalledWith('right');

                tick();

                instance.focusedSide = 'right';
                instance.testHandler = jasmine.createSpy('focusedPanelChange');
                fixture.detectChanges();
                tick(100);

                focusSwitcherLeft.click();
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

    it('focuses the left panel when the right panel is hidden/closed',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [(focusedPanel)]="focusedSide"
                [rightPanelVisible]="hasRight">
            </gtx-split-view-container>`,
            (fixture, instance) => {
                const slideable: HTMLElement = fixture.nativeElement.querySelector('.slideable');

                instance.hasRight = true;
                instance.focusedSide = 'right';
                fixture.detectChanges();
                tick();

                expect(slideable.classList).toContain('focusedRight');
                expect(slideable.classList).not.toContain('focusedLeft');

                instance.hasRight = false;
                fixture.detectChanges();
                tick();

                expect(slideable.classList).not.toContain('focusedRight');
                expect(slideable.classList).toContain('focusedLeft');
            }
        )
    );

    it('should emit "rightPanelOpened" when "rightPanelVisible" is changed to true',
        componentTest(() => TestComponent, `
            <gtx-split-view-container
                [rightPanelVisible]="hasRight"
                (rightPanelOpened)="testHandler($event)">
            </gtx-split-view-container>`,
            (fixture, instance) => {
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
            (fixture, instance) => {
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
            (fixture, instance) => {
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
            (fixture, instance) => {
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

    it('allows changing focus when elements in the left panel are clicked',
        componentTest(() => TestComponent, `
            <gtx-split-view-container [rightPanelVisible]="hasRight" [(focusedPanel)]="focusedSide">
                <div class="left-panel" left>
                    <a class="link-to-click" (click)="focusedSide = 'right'">Focus right panel</a>
                </div>
                <div class="right-panel" right>
                    <p>Right panel</p>
                </div>
            </gtx-split-view-container>`,
            (fixture, instance) => {
                instance.focusedSide = 'left';
                instance.hasRight = true;
                fixture.detectChanges();
                tick();

                expect(instance.focusedSide).toBe('left');

                const link = fixture.debugElement.query(By.css('.link-to-click'));
                link.triggerEventHandler('click', { });

                for (let counter of ['first', 'second', 'third', 'fourth']) {
                    fixture.detectChanges();
                    tick();
                    expect(instance.focusedSide).toBe('right', `left panel focused after ${counter} change detection`);
                }
            }
        )
    );

    it('allows changing focus when elements in the left panel are clicked (async)',
        componentTest(() => TestComponent, `
            <gtx-split-view-container [rightPanelVisible]="hasRight" [(focusedPanel)]="focusedSide">
                <div class="left-panel" left>
                    <a class="link-to-click" (click)="testHandler()">Focus right panel</a>
                </div>
                <div class="right-panel" right>
                    <p>Right panel</p>
                </div>
            </gtx-split-view-container>`,
            (fixture, instance) => {
                instance.focusedSide = 'left';
                instance.hasRight = true;
                instance.testHandler = () => setTimeout(() => instance.focusedSide = 'right', 1000);

                fixture.detectChanges();
                tick();
                expect(instance.focusedSide).toBe('left');

                const link = fixture.debugElement.query(By.css('.link-to-click'));
                link.triggerEventHandler('click', { });

                expect(instance.focusedSide).toBe('left');

                tick(1000);
                fixture.detectChanges();

                expect(instance.focusedSide).toBe('right');

                for (let counter of ['first', 'second', 'third', 'fourth']) {
                    fixture.detectChanges();
                    tick(1000);
                    expect(instance.focusedSide).toBe('right', `left panel focused after ${counter} change detection`);
                }
            }
        )
    );

});



@Component({
    template: `<gtx-split-view-container></gtx-split-view-container>`
})
class TestComponent {
    hasRight: boolean = false;
    focusedSide: string = '';
    testHandler(...args: any[]): void {}
}
