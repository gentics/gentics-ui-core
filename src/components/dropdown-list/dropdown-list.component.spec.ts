import {Component} from '@angular/core';
import {tick} from '@angular/core/testing';
import {addProviders} from '@angular/core/testing';

import {componentTest} from '../../testing';
import {DropdownList} from './dropdown-list.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';


describe('DropdownList:', () => {

    beforeEach(() => {
        addProviders([ OverlayHostService ]);
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
            getTrigger(fixture, 0).click();
            tick();
            let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
            expect(contentWrapper.parentElement.classList).toContain('test-component-root');
        })
    );

    it('attaches a scroll mask next to the overlay host when the dropdown trigger is clicked',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            getTrigger(fixture, 0).click();
            tick();
            let scrollMask: HTMLElement = fixture.nativeElement.querySelector('.scroll-mask');
            expect(scrollMask.parentElement.classList).toContain('test-component-root');
        })
    );

    it('clicking content closes the dropdown',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            getTrigger(fixture, 0).click();
            tick();
            tick();
            let firstItem: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content li a');

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeDefined();

            firstItem.click();
            tick(1000);

            expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeNull();
        })
    );

    it('clicking the scroll mask closes the dropdown',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            getTrigger(fixture, 0).click();
            tick();
            let scrollMask: HTMLElement = fixture.nativeElement.querySelector('.scroll-mask');

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
                <div class="dropdown-trigger">x</div>
                    <ul class="dropdown-content">
                        <li><a>y</a></li>
                    </ul>
            </gtx-dropdown-list>
            <gtx-dropdown-list>
                <div class="dropdown-trigger">x</div>
                    <ul class="dropdown-content">
                        <li><a>y</a></li>
                    </ul>
            </gtx-dropdown-list>
            <gtx-dropdown-list>
                <div class="dropdown-trigger">x</div>
                    <ul class="dropdown-content">
                        <li><a>y</a></li>
                    </ul>
            </gtx-dropdown-list>`,
            fixture => {
                fixture.detectChanges();
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
                <div class="dropdown-trigger">{{ item }}</div>
                <ul class="dropdown-content">
                    <li><a>{{ item }}</a></li>
                </ul>
            </gtx-dropdown-list>`,
            fixture => {
                fixture.detectChanges();
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
                <gtx-button class="dropdown-trigger">
                    Choose An Option
                </gtx-button>
                <ul class="dropdown-content">
                    <li><a>First</a></li>
                    <li><a>Second</a></li>
                    <li><a>Third</a></li>
                </ul>
            </gtx-dropdown-list>
        </div>`,
    directives: [DropdownList, OverlayHost]
})
class TestComponent {
    collection = [1, 2, 3];
}

function getTrigger(fixture: any, index: number): HTMLElement {
    return fixture.nativeElement.querySelectorAll('.dropdown-trigger')[index];
}
