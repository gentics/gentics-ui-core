import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    flushMicrotasks,
    injectAsync,
    it,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {Modal} from './modal.component';

describe('Modal:', () => {

    it('should remove the modal contents from the DOM', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let modalContentsDel: DebugElement = fixture.debugElement.query(By.css('gtx-modal'));
                console.log(modalContentsDel.nativeElement.childNodes);
                expect(modalContentsDel.nativeElement.childElementCount).toBe(0);
            });
    }));

    it('should append the modal to the body', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let body: Element = document.querySelector('body');
                let modal: Element = document.querySelector('.gtx-modal-dialog');

                expect(modal.parentNode).toBe(body);
            });
    }));

    it('should append the overlay to the body', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let body: Element = document.querySelector('body');
                let overlay: Element = document.querySelector('.gtx-modal-overlay');

                expect(overlay.parentNode).toBe(body);
            });
    }));

    it('should set the modal to "display: none"', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let modal: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-dialog');

                expect(modal.style.display).toBe('none');
            });
    }));

    it('should set the overlay to "display: none"', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let overlay: HTMLElement = <HTMLElement> document.querySelector('.gtx-modal-overlay');

                expect(overlay.style.display).toBe('none');
            });
    }));

});

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
