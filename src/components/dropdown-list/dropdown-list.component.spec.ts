import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {fakeAsync, getTestInjector, inject, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {DropdownList} from './dropdown-list.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';

let overlayHostService: OverlayHostService;

describe('DropdownList:', () => {

    beforeEach(() => {
        // Create one OverlayHostService for all tests
        let injector = getTestInjector().createInjector().resolveAndCreateChild([OverlayHostService]);
        overlayHostService = injector.get(OverlayHostService);
    });

    it('should add a matching id to trigger and content',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                tick();
                let trigger = <HTMLElement> fixture.nativeElement.querySelector('.dropdown-trigger');
                let list = <HTMLUListElement> fixture.nativeElement.querySelector('.dropdown-content');

                tick();

                expect(trigger.dataset['activates']).toBe(list.id,
                    'DropdownList data-activates attribute should match id');

                fixture.destroy();
            })
        ))
    );

    it('content should get attached next to overlay host',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                tick();
                let contentWrapper: HTMLElement = fixture.nativeElement.querySelector('.dropdown-content-wrapper');
                expect(contentWrapper.parentElement.classList).toContain('test-component-root');

                fixture.destroy();
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
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
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
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
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
