import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {fakeAsync, getTestInjector, inject, tick} from '@angular/core/testing';

import {DropdownList} from './dropdown-list.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';

let overlayHostService: OverlayHostService;

describe('DropdownList:', () => {

    beforeEach(() => {
        // Create one OverlayHostService for every test
        let injector = getTestInjector().createInjector().resolveAndCreateChild([OverlayHostService]);
        overlayHostService = injector.get(OverlayHostService);
    });

    it('content should not appear in DOM before it is opened.',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
                expect(contentWrapper).toBeNull();
            })
        ))
    );

    it('content should get attached next to overlay host when trigger is clicked',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                getTrigger(fixture, 0).click();
                tick();
                tick();
                let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
                expect(contentWrapper.parentElement.classList).toContain('test-component-root');
            })
        ))
    );

    it('scroll mask should get attached next to overlay host when trigger is clicked',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                getTrigger(fixture, 0).click();
                tick();
                tick();
                let scrollMask: HTMLElement = fixture.nativeElement.querySelector('.scroll-mask');
                expect(scrollMask.parentElement.classList).toContain('test-component-root');
            })
        ))
    );

    it('clicking content should close dropdown',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                getTrigger(fixture, 0).click();
                tick();
                tick();
                let firstItem: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content li a');

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).not.toBeNull();

                firstItem.click();
                tick(1000);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeNull();
            })
        ))
    );

    it('clicking scroll mask should close dropdown',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                getTrigger(fixture, 0).click();
                tick();
                tick();
                let scrollMask: HTMLElement = fixture.nativeElement.querySelector('.scroll-mask');

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).not.toBeNull();

                scrollMask.click();
                tick(1000);

                expect(fixture.nativeElement.querySelector('.dropdown-content-wrapper')).toBeNull();
            })
        ))
    );

    it('should clean up the wrapper div from the body',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
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
                </gtx-dropdown-list>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                getTrigger(fixture, 0).click();
                getTrigger(fixture, 1).click();
                getTrigger(fixture, 2).click();
                tick();
                tick();
                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(3);

                fixture.destroy();
                tick();

                expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);
            })
        ))
    );

    it('should clean up the wrapper div from the when used with ngFor',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-overlay-host></gtx-overlay-host>
                <gtx-dropdown-list *ngFor="let item of collection">
                    <div class="dropdown-trigger">{{ item }}</div>
                        <ul class="dropdown-content">
                            <li><a>{{ item }}</a></li>
                        </ul>
                </gtx-dropdown-list>
            `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    getTrigger(fixture, 0).click();
                    getTrigger(fixture, 1).click();
                    getTrigger(fixture, 2).click();
                    tick();
                    tick();
                    expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(3);

                    fixture.destroy();
                    tick();

                    expect(fixture.nativeElement.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);
                })
        ))
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
    directives: [DropdownList, OverlayHost],
    providers: [
        { provide: OverlayHostService, useFactory: (): any => overlayHostService }
    ]
})
class TestComponent {
    collection: number[] = [1, 2, 3];
}

function getTrigger(fixture: ComponentFixture<TestComponent>, index: number): HTMLElement {
    return fixture.nativeElement.querySelectorAll('.dropdown-trigger')[index];
}
