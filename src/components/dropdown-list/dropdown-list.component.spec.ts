import {Component, DebugElement} from 'angular2/core';
import {ControlGroup, Control} from 'angular2/common';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    injectAsync,
    it,
    xit,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {DropdownList} from './dropdown-list.component';



describe('DropdownList:', () => {

    it('should add a matching id to trigger and content', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let trigger: HTMLElement = fixture.nativeElement.querySelector('.dropdown-trigger');
                    let list: HTMLUListElement = document.querySelector('.dropdown-content');

                    expect(trigger.dataset['activates'] === list.id).toBe(true);

                    fixture.destroy();
                });
        }));

    it('content should get attached to body', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let contentWrapper: HTMLUListElement = document.querySelector('.dropdown-content-wrapper');

                    expect(contentWrapper.parentElement).toBe(document.body);

                    fixture.destroy();
                });
        }));

    it('should clean up the wrapper div from the body', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();

                    expect(document.querySelectorAll('.dropdown-content-wrapper').length).toBe(1);

                    fixture.destroy();

                    expect(document.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);
                });
        }));
});


@Component({
    template: `<gtx-dropdown-list>
        <gtx-button class="dropdown-trigger">
            Choose An Option
        </gtx-button>
        <ul class="dropdown-content">
            <li><a>First</a></li>
            <li><a>Second</a></li>
            <li><a>Third</a></li>
        </ul>
    </gtx-dropdown-list>`,
    directives: [DropdownList]
})
class TestComponent {}
