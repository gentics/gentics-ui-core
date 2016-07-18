import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {async, ComponentFixture, fakeAsync, getTestInjector, inject, TestComponentBuilder, tick} from '@angular/core/testing';
import {ModalService} from './modal.service';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {IDialogConfig, IModalDialog} from './modal-interfaces';

let modalService: ModalService;
let overlayHostService: OverlayHostService;

describe('ModalService:', () => {

    beforeEach(() => {
        let injector = getTestInjector().createInjector().resolveAndCreateChild([OverlayHostService, ModalService]);
        overlayHostService = injector.get(OverlayHostService);
        modalService = injector.get(ModalService);
    });

    describe('dialog():', () => {

        it('should return a promise',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        let result = modalService.dialog({ title: 'Test', buttons: []});

                        expect(result.then).toBeDefined();
                    })
            ))
        );

        it('should display a title and body',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        modalService.dialog({ title: 'Test', body: 'This is a modal', buttons: []});
                        tick();
                        fixture.detectChanges();

                        expect(getElement(fixture, '.modal-title').innerText).toContain('Test');
                        expect(getElement(fixture, '.modal-body').innerText).toContain('This is a modal');
                    })
            ))
        );

        describe('buttons:', () => {

            function setupButtonsTest(tcb: TestComponentBuilder): Promise<ComponentFixture<TestComponent>> {
                return tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        modalService.dialog({ title: 'Test', buttons: [
                            { label: 'okay', type: 'default', returnValue: true },
                            { label: 'cancel', type: 'secondary', returnValue: false },
                            { label: 'not sure', type: 'alert', returnValue: 'not sure' }
                        ] });
                        tick();
                        fixture.detectChanges();

                        return fixture;
                    });
            }

            it('should display buttons.',
                fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                    setupButtonsTest(tcb)
                        .then(fixture => {
                            let buttons = getElements(fixture, '.modal-footer button');
                            expect(buttons.length).toBe(3);
                        })
                ))
            );

            it('should label buttons correctly.',
                fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                    setupButtonsTest(tcb)
                        .then(fixture => {
                            let buttons = getElements(fixture, '.modal-footer button');

                            expect(buttons[0].innerHTML).toContain('okay');
                            expect(buttons[1].innerHTML).toContain('cancel');
                            expect(buttons[2].innerHTML).toContain('not sure');
                        })
                ))
            );

            it('should assign correct classes to buttons.',
                fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                    setupButtonsTest(tcb)
                        .then(fixture => {
                            let buttons = getElements(fixture, '.modal-footer button');

                            expect(buttons[0].classList.contains('default')).toBe(true);
                            expect(buttons[1].classList.contains('secondary')).toBe(true);
                            expect(buttons[2].classList.contains('alert')).toBe(true);
                        })
                ))
            );
        });

        it('should resolve with value when button clicked',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                let fixture: ComponentFixture<TestComponent>;
                return tcb.createAsync(TestComponent)
                    .then(_fixture => {
                        fixture = _fixture;
                        fixture.detectChanges();
                        return modalService.dialog({
                            title: 'Test', buttons: [
                                {label: 'okay', type: 'default', returnValue: 'okay'}
                            ]
                        });
                    })
                    .then(modal => {
                        let promise = modal.open();
                        tick();
                        fixture.detectChanges();

                        getElement(fixture, '.modal-footer button').click();
                        tick();

                        return promise;
                    })
                    .then(result => {
                        expect(result).toBe('okay');
                    });
            }))
        );

        it('should reject with value when shouldReject button clicked',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                let fixture: ComponentFixture<TestComponent>;
                tcb.createAsync(TestComponent)
                    .then(_fixture => {
                        fixture = _fixture;
                        fixture.detectChanges();
                        return modalService.dialog({
                            title: 'Test', buttons: [
                                {label: 'okay', type: 'default', returnValue: 'cancelled', shouldReject: true}
                            ]
                        });
                    })
                    .then(modal => {
                        let promise = modal.open()
                            .then(() => expect(false).toBe(true, 'this line should never be reached.'))
                            .catch(reason => expect(reason).toContain('cancelled'));

                        tick();
                        fixture.detectChanges();

                        getElement(fixture, '.modal-footer button').click();
                        tick();

                        return promise;
                    });
            }))
        );

        // TODO: enable once this is fixed https://github.com/angular/angular/issues/8251
        xit('should reject with when overlay clicked',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        let modalRef = modalService.dialog({ title: 'Test', buttons: [{ label: 'okay' }] });
                        tick();
                        fixture.detectChanges();

                        getElement(fixture, '.gtx-modal-overlay').click();
                        tick();
                        tick();

                        return modalRef;
                    })
                    .then(() => {
                        expect(false).toBe(true, 'this line should never be reached.');
                    })
                    .catch((reason: Error) => {
                        expect(reason instanceof Error).toBe(true);
                        tick();
                    })
            ))
        );
    });

    describe('modal options:', () => {

        const testDialogConfig: IDialogConfig = {
            title: 'Test',
            body: 'This is a modal',
            buttons: [{ label: 'okay' }]
        };

        it('should fire onOpen',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        let onOpen = jasmine.createSpy('onOpen');
                        fixture.detectChanges();
                        return modalService.dialog(testDialogConfig, { onOpen: onOpen })
                            .then(modal => modal.open())
                            .then(() => {
                                expect(onOpen).toHaveBeenCalled();
                            });
                    })
            ))
        );

        it('should fire onClose',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        let onClose = jasmine.createSpy('onClose');
                        fixture.detectChanges();
                        return modalService.dialog(testDialogConfig, { onClose: onClose })
                            .then(modal => modal.open())
                            .then(() => {
                                getElement(fixture, '.modal-footer button').click();
                                tick();
                                expect(onClose).toHaveBeenCalled();
                            });
                    })
            ))
        );

        // TODO: enable once this is fixed https://github.com/angular/angular/issues/8251
        xit('should close when closeOnOverlayClick = true',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        let modalRef = modalService.dialog(testDialogConfig, { closeOnOverlayClick: true });
                        tick();
                        fixture.detectChanges();

                        getElement(fixture, '.gtx-modal-overlay').click();
                        tick();
                        tick();
                    })
                    .catch(error => {
                        expect(error).toBeDefined();
                    })
            ))
        );

        // TODO: enable once this is fixed https://github.com/angular/angular/issues/8251
        xit('should not close when closeOnOverlayClick = false',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        let modalRef = modalService.dialog(testDialogConfig, { closeOnOverlayClick: false });
                        tick();
                        fixture.detectChanges();

                        getElement(fixture, '.gtx-modal-overlay').click();
                        tick();
                        tick();

                        return modalRef;
                    })
                    .catch(error => {
                        expect(error).toBeDefined();
                    })
            ))
        );

        it('should set maxWidth',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        modalService.dialog(testDialogConfig, { maxWidth: '400px' });
                        tick();
                        fixture.detectChanges();

                        let dialog = getElement(fixture, '.gtx-modal-dialog');
                        expect(dialog.style.maxWidth).toBe('400px');
                    })
            ))
        );

        it('should set padding',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        modalService.dialog(testDialogConfig, { padding: false });
                        tick();
                        fixture.detectChanges();

                        let dialog = getElement(fixture, '.gtx-modal-dialog');
                        expect(dialog.classList.contains('nopad')).toBe(true);
                    })
            ))
        );

    });

    describe('fromComponent():', () => {

        @Component({
            selector: 'test-modal-cmp',
            template: `<div>TestModalCmp</div>`
        })
        class TestModalCmp implements IModalDialog {
            closeFn: (val: any) => void;
            cancelFn: (val?: any) => void;
            registerCloseFn(close: (val: any) => void): void {
                this.closeFn = close;
            }

            registerCancelFn(cancel: (val: any) => void): void {
                this.cancelFn = cancel;
            }
        }

        @Component({
            selector: 'bad-modal-cmp',
            template: `<div>BadModalCmp</div>`
        })
        class BadModalCmp {}

        it('should throw if the component does not implement IModalDialog',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();

                        function run(): void {
                            modalService.fromComponent(BadModalCmp);
                            tick();
                        }

                        expect(run).toThrow();
                    })
            ))
        );

        it('should return a promise',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        let result = modalService.fromComponent(TestModalCmp);

                        expect(result.then).toBeDefined();
                    })
            ))
        );

        it('should contain the component',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                    .then(fixture => {
                        fixture.detectChanges();
                        modalService.fromComponent(TestModalCmp);
                        tick();

                        let testModalCmp = getElement(fixture, 'test-modal-cmp');

                        expect(testModalCmp).toBeDefined();
                        expect(testModalCmp.innerText).toContain('TestModalCmp');
                    })
            ))
        );
    });
});


/**
 * Helper method to get a HTMLElement based on a css selector.
 */
function getElement(fixture: ComponentFixture<any>, selector: string): HTMLElement {
    return fixture.debugElement.query(By.css(selector)).nativeElement;
}

/**
 * Helper method to get an array of HTMLElements based on a css selector.
 */
function getElements(fixture: ComponentFixture<any>, selector: string): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css(selector)).map(de => de.nativeElement);
}

@Component({
    template: `<gtx-overlay-host></gtx-overlay-host>`,
    directives: [OverlayHost],
    providers: [
        { provide: ModalService, useFactory: (): any => modalService },
        { provide: OverlayHostService, useFactory: (): any => overlayHostService }
    ]
})
class TestComponent {}
