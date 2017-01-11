import {Component} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {DropdownList, DropdownContent, DropdownTriggerDirective, DropdownItem} from './dropdown-list.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {Button} from '../button/button.component';
import {ScrollMask} from './scroll-mask.component';
import {DropdownContentWrapper} from './dropdown-content-wrapper.component';
import {KeyCode} from '../../common/keycodes';
import {crossBrowserInitKeyboardEvent, KeyboardEventConfig} from '../../testing/keyboard-event';


describe('DropdownList:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropdownList,
                DropdownContent,
                DropdownItem,
                DropdownTriggerDirective,
                DropdownContentWrapper,
                OverlayHost,
                TestComponent,
                Button,
                ScrollMask
            ],
            providers: [OverlayHostService]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DropdownContentWrapper, ScrollMask]
            }
        });
    });

    it('does not add content to the DOM before it is opened',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
            expect(contentWrapper).toBeNull();
        })
    );

    it('attaches its content next to the overlay host when the dropdown trigger is clicked',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
            expect(contentWrapper.parentElement.parentElement.classList).toContain('test-component-root');

            tick(1000);
        })
    );

    it('attaches a scroll mask next to the overlay host when the dropdown trigger is clicked',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            let scrollMask: HTMLElement = fixture.nativeElement.querySelector('gtx-scroll-mask');
            expect(scrollMask.parentElement.classList).toContain('test-component-root');

            tick(1000);
        })
    );

    it('isOpen should report the open state',
        componentTest(() => TestComponent, (fixture) => {
            fixture.detectChanges();
            let dropdownInstance: DropdownList = fixture.debugElement.query(By.directive(DropdownList)).componentInstance;
            tick();
            expect(dropdownInstance.isOpen).toBe(false);

            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            expect(dropdownInstance.isOpen).toBe(true);

            let firstItem: HTMLElement = getContentListFirstItem(fixture);
            firstItem.click();
            tick(1000);
            expect(dropdownInstance.isOpen).toBe(false);
        })
    );

    it('clicking the trigger does not open dropdown when disabled == true',
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.disabled = true;
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();

            tick(1000);
        })
    );

    it('clicking content closes the dropdown when sticky === false',
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.sticky = false;
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            let firstItem: HTMLElement = getContentListFirstItem(fixture);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

            firstItem.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();
        })
    );

    it('clicking content does not close the dropdown when sticky === true',
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.sticky = true;
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            let firstItem: HTMLElement = getContentListFirstItem(fixture);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

            firstItem.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();
        })
    );

    it('pressing escape key closes the dropdown when closeOnEscape === true',
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.closeOnEscape = true;
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            let dropdownListElement: HTMLElement = fixture.debugElement.query(By.directive(DropdownList)).nativeElement;

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

            dispatchKeyboardEvent(KeyCode.Escape, dropdownListElement);
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();
        })
    );

    it('pressing escape key does not close the dropdown when closeOnEscape === false',
        componentTest(() => TestComponent, (fixture, instance) => {
            instance.closeOnEscape = false;
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            let dropdownListElement: HTMLElement = fixture.debugElement.query(By.directive(DropdownList)).nativeElement;

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

            dispatchKeyboardEvent(KeyCode.Escape, dropdownListElement);
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();
        })
    );

    it('clicking the scroll mask closes the dropdown',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            let scrollMask: HTMLElement = fixture.nativeElement.querySelector('gtx-scroll-mask');

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

            scrollMask.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();
        })
    );

    it('cleans up the wrapper div from the body',
        componentTest(() => TestComponent, `
            <gtx-overlay-host></gtx-overlay-host>
            <gtx-dropdown-list>
                <gtx-dropdown-trigger>x</gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <ul>
                        <li><a>y</a></li>
                    </ul>
                </gtx-dropdown-content>
            </gtx-dropdown-list>
            <gtx-dropdown-list>
                <gtx-dropdown-trigger>x</gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <ul>
                        <li><a>y</a></li>
                    </ul>
                </gtx-dropdown-content>
            </gtx-dropdown-list>
            <gtx-dropdown-list>
                <gtx-dropdown-trigger>x</gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <ul>
                        <li><a>y</a></li>
                    </ul>
                </gtx-dropdown-content>
            </gtx-dropdown-list>`,
            fixture => {
                fixture.detectChanges();
                tick();
                getTrigger(fixture, 0).click();
                getTrigger(fixture, 1).click();
                getTrigger(fixture, 2).click();
                tick();
                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(3);

                fixture.destroy();
                tick();

                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);

                tick(1000);
            }
        )
    );

    it('cleans up the wrapper div from the body when used with ngFor',
        componentTest(() => TestComponent, `
            <gtx-overlay-host></gtx-overlay-host>
            <gtx-dropdown-list *ngFor="let item of collection">
                <gtx-dropdown-trigger>{{ item }}</gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <ul>
                        <li><a>{{ item }}</a></li>
                    </ul>
                </gtx-dropdown-content>
            </gtx-dropdown-list>`,
            fixture => {
                fixture.detectChanges();
                tick();
                getTrigger(fixture, 0).click();
                getTrigger(fixture, 1).click();
                getTrigger(fixture, 2).click();
                tick();
                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(3);

                fixture.destroy();
                tick();

                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);

                tick(1000);
            }
        )
    );

    describe('tab control', () => {

        function openAndTabToFirstItem(fixture: ComponentFixture<TestComponent>): void {
            fixture.detectChanges();
            tick();

            const dropdownElement = fixture.debugElement.query(By.directive(DropdownList)).nativeElement;
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();

            dispatchKeyboardEvent(KeyCode.Tab, dropdownElement);
            tick();
        }

        it('pressing tab focuses the first item',
            componentTest(() => TestComponent, (fixture) => {
                openAndTabToFirstItem(fixture);
                expect(document.activeElement).toBe(getContentListItem(fixture, 0));
                tick(1000);
            }));

        /**
         * Although we would like to test to see that tabbing between items will shift the focus (i.e. alter the
         * value of `document.activeElement`, this does not appear to be possible as long as we rely on the
         * default browser behaviour - see http://stackoverflow.com/a/1601732/772859 for an explanation of why this
         * is (basically security reasons).
         *
         * So as a proxy we will just test that one can tab without the dropdown closing.
         */
        it('tabbing should between list items should use browser default behaviour',
            componentTest(() => TestComponent, (fixture) => {
                openAndTabToFirstItem(fixture);
                const item1 = getContentListItem(fixture, 0);
                const item2 = getContentListItem(fixture, 1);

                expect(document.activeElement).toBe(item1, 'first');
                dispatchKeyboardEvent(KeyCode.Tab, item1);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

                dispatchKeyboardEvent(KeyCode.Tab, item2);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeTruthy();

                tick(1000);
            })
        );

        it('tabbing from last list item should close dropdown and focus trigger',
            componentTest(() => TestComponent, (fixture) => {
                openAndTabToFirstItem(fixture);
                const item3 = getContentListItem(fixture, 2);
                item3.focus();

                expect(document.activeElement).toBe(item3);
                dispatchKeyboardEvent(KeyCode.Tab, item3);

                tick(1000);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();

                const triggerButton = getTrigger(fixture, 0).querySelector('button');
                expect(document.activeElement).toBe(triggerButton);
            })
        );

        it('shift-tabbing from first list item should close dropdown and focus trigger',
            componentTest(() => TestComponent, (fixture) => {
                openAndTabToFirstItem(fixture);
                const item1 = getContentListItem(fixture, 0);
                expect(document.activeElement).toBe(item1);

                dispatchKeyboardEvent(KeyCode.Tab, item1, { shiftKey: true });

                tick(1000);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeFalsy();

                const triggerButton = getTrigger(fixture, 0).querySelector('button');
                expect(document.activeElement).toBe(triggerButton);
            })
        );
    });

});


@Component({
    template: `
        <div class="test-component-root">
            <gtx-overlay-host></gtx-overlay-host>
            <gtx-dropdown-list [sticky]="sticky"
                               [disabled]="disabled"
                               [closeOnEscape]="closeOnEscape">
                <gtx-dropdown-trigger>
                    <button>Choose An Option</button>
                </gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <gtx-dropdown-item>First</gtx-dropdown-item>
                    <gtx-dropdown-item>Second</gtx-dropdown-item>
                    <gtx-dropdown-item>Third</gtx-dropdown-item>
                </gtx-dropdown-content>
            </gtx-dropdown-list>
        </div>`
})
class TestComponent {
    sticky = false;
    disabled = false;
    closeOnEscape = true;
    collection = [1, 2, 3];
}

function getTrigger(fixture: any, index: number): HTMLElement {
    return fixture.nativeElement.querySelectorAll('gtx-dropdown-trigger')[index];
}

function getContentListFirstItem(fixture: ComponentFixture<TestComponent>): HTMLElement {
    return getContentListItem(fixture, 0);
}

function getContentListItem(fixture: ComponentFixture<TestComponent>, index: number): HTMLElement {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('gtx-dropdown-item'))[index];
}

function dispatchKeyboardEvent(keyCode: number, element: HTMLElement, options?: KeyboardEventConfig): void {
    let mergedOptions = Object.assign({ keyCode, bubbles: true }, options);
    let event  = crossBrowserInitKeyboardEvent('keydown', mergedOptions);
    element.dispatchEvent(event);
}
