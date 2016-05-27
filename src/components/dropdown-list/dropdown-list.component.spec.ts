import {Component} from '@angular/core';
import {expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {DropdownList} from './dropdown-list.component';

describe('DropdownList:', () => {

    it('should add a matching id to trigger and content', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let trigger = <HTMLElement> fixture.nativeElement.querySelector('.dropdown-trigger');
                    let list = <HTMLUListElement> document.querySelector('.dropdown-content');

                    tick();

                    expect(trigger.dataset['activates']).toBe(list.id,
                        'DropdownList data-activates attribute should match id');

                    fixture.destroy();
                });
        })));

    it('content should get attached to body', inject([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let contentWrapper = <HTMLUListElement> document.querySelector('.dropdown-content-wrapper');

                    expect(contentWrapper.parentElement).toBe(document.body);

                    fixture.destroy();
                });
        }));

    it('should clean up the wrapper div from the body', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();

                    expect(document.querySelectorAll('.dropdown-content-wrapper').length).toBe(1);

                    fixture.destroy();
                    tick();

                    expect(document.querySelectorAll('.dropdown-content-wrapper').length).toBe(0);
                });
        })));
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
