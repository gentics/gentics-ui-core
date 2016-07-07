import {Component, DebugElement} from '@angular/core';
import {async, fakeAsync, inject, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';

import {Modal} from './modal.component';

describe('Modal:', () => {

    it('should remove the modal contents from the DOM',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let modalDebugElement: DebugElement = fixture.debugElement.query(By.css('gtx-modal'));

                expect(modalDebugElement.nativeElement.childElementCount).toBe(0);
                fixture.destroy();
            })
        ))
    );

    it('should append the modal to the body',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let body: HTMLBodyElement = <any> document.querySelector('body');
                let modal: Element = document.querySelector('.gtx-modal-dialog');

                expect(modal.parentNode).toBe(body,
                    'modal should be appended to the body (why does this show up in other tests?)');
                fixture.destroy();
            })
        ))
    );

    it('should append the overlay to the body',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let body: HTMLBodyElement = <any> document.querySelector('body');
                let overlay: Element = document.querySelector('.gtx-modal-overlay');

                expect(overlay.parentNode).toBe(body);
                fixture.destroy();
            })
        ))
    );

    it('should set the modal to "display: none"',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let modal: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-dialog');

                expect(modal.style.display).toBe('none');
                fixture.destroy();
            })
        ))
    );

    it('should set the overlay to "display: none"',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let overlay: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-overlay');

                expect(overlay.style.display).toBe('none');
                fixture.destroy();
            })
        ))
    );

    describe('"opened" state:', () => {

        it('should set the overlay to "display: block"',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    fixture.componentInstance.showModal = true;
                    fixture.detectChanges();
                    tick(1000);
                    let overlay: HTMLElement = getLastInDocument('.gtx-modal-overlay');

                    expect(overlay.style.display).toBe('block');
                    fixture.destroy();
                })
            ))
        );

        it('should set the modal to "display: block"',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    fixture.componentInstance.showModal = true;
                    fixture.detectChanges();
                    tick(1000);
                    let overlay: HTMLElement = getLastInDocument('.gtx-modal-dialog');

                    expect(overlay.style.display).toBe('block');
                    fixture.destroy();
                })
            ))
        );

    });

    xdescribe('closing', () => {

        /**
         * Failing, but not clear why, possibly due to the callback being needing to be fired after the
         * velocity-animate function has completed.
         * TODO: Fix the test or figure out another way to test it.
         */
        it('should fire "close" event when closeModal() called.',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    instance.showModal = true;
                    spyOn(instance, 'onClose');
                    fixture.detectChanges();
                    tick(1000);
                    let modalInstance: Modal = fixture.debugElement.query(By.css('gtx-modal')).componentInstance;

                    expect(instance.onClose).not.toHaveBeenCalled();
                    modalInstance.closeModal();
                    tick(250);
                    tick();

                    expect(instance.onClose).toHaveBeenCalled();
                    fixture.destroy();
                })
            ))
        );

    });

});

/**
 * Returns the last instance in the document of all elements matching the selector.
 */
function getLastInDocument(selector: string): HTMLElement {
    let elements: NodeListOf<Element> = document.querySelectorAll(selector);
    return <HTMLElement> elements[elements.length - 1];
}

@Component({
    template: `
        <gtx-modal [opened]="showModal" (close)="onClose()" #modal>
            <h1>Modal Content</h1>
            <gtx-modal-footer>
                <button class="btn" (click)="modal.closeModal()">Close</button>
            </gtx-modal-footer>
        </gtx-modal>`,
    directives: [Modal]
})
class TestComponent {
    showModal: boolean = false;
    onClose(): void {}
}
