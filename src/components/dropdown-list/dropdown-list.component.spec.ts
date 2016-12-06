import {Component} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {TestBed, tick} from '@angular/core/testing';

import {componentTest} from '../../testing';
import {DropdownList, DropdownContentDirective, DropdownTriggerDirective} from './dropdown-list.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {Button} from '../button/button.component';
import {ScrollMask} from './scroll-mask.component';
import {DropdownContentWrapper} from './dropdown-content-wrapper.component';


describe('DropdownList:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DropdownList,
                DropdownContentDirective,
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
        })
    );

    it('clicking content closes the dropdown',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            fixture.detectChanges();
            let firstItem: HTMLElement = fixture.nativeElement.querySelector('gtx-dropdown-content li a');

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeDefined();

            firstItem.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeNull();
        })
    );

    it('clicking the scroll mask closes the dropdown',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            getTrigger(fixture, 0).click();
            tick();
            let scrollMask: HTMLElement = fixture.nativeElement.querySelector('gtx-scroll-mask');

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).not.toBeNull();

            scrollMask.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeNull();
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
            }
        )
    );

});


@Component({
    template: `
        <div class="test-component-root">
            <gtx-overlay-host></gtx-overlay-host>
            <gtx-dropdown-list>
                <gtx-dropdown-trigger>
                    Choose An Option
                </gtx-dropdown-trigger>
                <gtx-dropdown-content>
                    <ul>
                        <li><a>First</a></li>
                        <li><a>Second</a></li>
                        <li><a>Third</a></li>
                    </ul>
                </gtx-dropdown-content>
            </gtx-dropdown-list>
        </div>`
})
class TestComponent {
    collection = [1, 2, 3];
}

function getTrigger(fixture: any, index: number): HTMLElement {
    return fixture.nativeElement.querySelectorAll('gtx-dropdown-trigger')[index];
}
