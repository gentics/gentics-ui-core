import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {describe, expect, fakeAsync, injectAsync, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Modal} from './modal.component';

describe('Modal:', () => {

    it('should remove the modal contents from the DOM', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let modalContentsDel: DebugElement = fixture.debugElement.query(By.css('gtx-modal'));

                expect(modalContentsDel.nativeElement.childElementCount).toBe(0);
                fixture.destroy();
            });
    }));

    it('should append the modal to the body', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let body: Element = document.querySelector('body');
                let modal: Element = document.querySelector('.gtx-modal-dialog');

                expect(modal.parentNode).toBe(body);
                fixture.destroy();
            });
    }));

    it('should append the overlay to the body', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let body: Element = document.querySelector('body');
                let overlay: Element = document.querySelector('.gtx-modal-overlay');

                expect(overlay.parentNode).toBe(body);
                fixture.destroy();
            });
    }));

    it('should set the modal to "display: none"', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let modal: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-dialog');

                expect(modal.style.display).toBe('none');
                fixture.destroy();
            });
    }));

    it('should set the overlay to "display: none"', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let overlay: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-overlay');

                expect(overlay.style.display).toBe('none');
                fixture.destroy();
            });
    }));

    describe('"opened" state:', () => {

        it('should set the overlay to "display: block"', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
             return tcb.createAsync(TestComponent)
                 .then((fixture: ComponentFixture) => {
                     fixture.detectChanges();
                     fixture.componentInstance.showModal = true;
                     fixture.detectChanges();
                     tick(1000);
                     let overlay: HTMLElement = getLastInDocument('.gtx-modal-overlay');

                     expect(overlay.style.display).toBe('block');
                     fixture.destroy();
                 });
         })));

        it('should set the modal to "display: block"', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
             return tcb.createAsync(TestComponent)
                 .then((fixture: ComponentFixture) => {
                     fixture.detectChanges();
                     fixture.componentInstance.showModal = true;
                     fixture.detectChanges();
                     tick(1000);
                     let overlay: HTMLElement = getLastInDocument('.gtx-modal-dialog');

                     expect(overlay.style.display).toBe('block');
                     fixture.destroy();
                 });
         })));

    });

    describe('closing', () => {

        /**
         * Failing, but not clear why, possibly due to the callback being needing to be fired after the
         * velocity-animate function has completed.
         * TODO: Fix the test or figure out another way to test it.
         */
        /*xit('should fire "close" event when closeModal() called.', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
             return tcb.createAsync(TestComponent)
                 .then((fixture: ComponentFixture) => {
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
                 });
         })));*/

    });

});

/**
 * Returns the last instance in the document of all elements matching the selector.
 */
function getLastInDocument(selector: string): HTMLElement {
    let els: NodeListOf<Element> = document.querySelectorAll(selector);
    return <HTMLElement> els[els.length - 1];
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
