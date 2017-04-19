import {Component} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {By} from '@angular/platform-browser';
import {discardPeriodicTasks, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import {componentTest} from '../../testing';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {ModalService} from './modal.service';
import {IDialogConfig, IModalDialog} from './modal-interfaces';
import {DynamicModalWrapper} from './dynamic-modal-wrapper.component';
import {ModalDialog} from './modal-dialog.component';
import {Button} from '../button/button.component';


let modalService: ModalService;

describe('ModalService:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OverlayHost, DynamicModalWrapper, ModalDialog, TestComponent, Button],
            providers: [
                ModalService,
                OverlayHostService
            ]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DynamicModalWrapper, ModalDialog]
            }
        });
    });

    describe('dialog():', () => {

        beforeEach(() => {
            modalService = TestBed.get(ModalService);
        });

        it('returns a promise',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                let result = modalService.dialog({ title: 'Test', buttons: []});

                expect(result.then).toBeDefined();
            })
        );

        it('displays a title and body',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.dialog({ title: 'Test', body: 'This is a modal', buttons: []});
                tick();
                fixture.detectChanges();

                expect(getElement(fixture, '.modal-title').innerText).toContain('Test');
                expect(getElement(fixture, '.modal-body').innerText).toContain('This is a modal');
            })
        );

        describe('buttons:', () => {

            function setupButtonsTest<T>(fixture: ComponentFixture<T>): void {
                fixture.detectChanges();
                modalService.dialog({ title: 'Test', buttons: [
                    { label: 'okay', type: 'default', returnValue: true },
                    { label: 'cancel', type: 'secondary', returnValue: false },
                    { label: 'not sure', type: 'alert', returnValue: 'not sure' }
                ] });
                tick();
                fixture.detectChanges();
            }

            it('displays configured buttons in the modal footer',
                componentTest(() => TestComponent, fixture => {
                    setupButtonsTest(fixture);
                    let buttons = getElements(fixture, '.modal-footer button');
                    expect(buttons.length).toBe(3);
                })
            );

            it('labels buttons correctly',
                componentTest(() => TestComponent, fixture => {
                    setupButtonsTest(fixture);
                    let buttons = getElements(fixture, '.modal-footer button');

                    expect(buttons[0].innerHTML).toContain('okay');
                    expect(buttons[1].innerHTML).toContain('cancel');
                    expect(buttons[2].innerHTML).toContain('not sure');
                })
            );

            it('assigns correct classes to buttons',
                componentTest(() => TestComponent, fixture => {
                    setupButtonsTest(fixture);
                    let buttons = getElements(fixture, '.modal-footer button');

                    expect(buttons[0].classList).toContain('default');
                    expect(buttons[1].classList).toContain('secondary');
                    expect(buttons[2].classList).toContain('alert');
                })
            );
        });

        it('resolves with value configured by "returnValue" when a button is clicked',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                return modalService.dialog({
                    title: 'Test', buttons: [
                        { label: 'okay', type: 'default', returnValue: 'okay' }
                    ]
                })
                .then<string>(modal => {
                    let promise = modal.open();
                    tick(50);
                    fixture.detectChanges();

                    getElement(fixture, '.modal-footer button').click();
                    tick();

                    return promise;
                })
                .then(result => {
                    expect(result).toBe('okay');
                });
            })
        );

        it('rejects with returnValue when a button with shouldReject: true is clicked',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                return modalService.dialog({
                    title: 'Test', buttons: [
                        {label: 'okay', type: 'default', returnValue: 'cancelled', shouldReject: true}
                    ]
                })
                .then(modal => {
                    let promise = modal.open()
                        .then(
                            () => fail('Promise resolved but should reject'),
                            reason => expect(reason).toContain('cancelled')
                        );

                    tick(50);
                    fixture.detectChanges();

                    getElement(fixture, '.modal-footer button').click();
                    tick();

                    return promise;
                });
            })
        );

        it('does not reject when the overlay is clicked', () => {
            let testWithPendingPromise = componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();

                    let modalPromise = modalService.dialog({ title: 'Test', buttons: [{ label: 'okay' }] })
                        .then(modal => modal.open())
                        .then(
                            () => fail('Promise resolved but should not be'),
                            () => fail('Promise rejected but should not be')
                        );

                    tick(100);
                    fixture.detectChanges();

                    getElement(fixture, '.gtx-modal-overlay').click();
                    tick();
                    tick();
                });
            expect(testWithPendingPromise).not.toThrow();
        });
    });

    describe('modal options:', () => {

        beforeEach(() => {
            modalService = TestBed.get(ModalService);
        });

        const testDialogConfig: IDialogConfig = {
            title: 'Test',
            body: 'This is a modal',
            buttons: [{ label: 'okay' }]
        };

        it('calls the onOpen callback when the modal is opened',
            componentTest(() => TestComponent, fixture => {
                let onOpen = jasmine.createSpy('onOpen');
                fixture.detectChanges();
                return modalService.dialog(testDialogConfig, { onOpen: onOpen })
                    .then(modal => {
                        modal.open();
                        expect(onOpen).toHaveBeenCalled();
                    });
            })
        );

        it('calls the onClose callback when the modal is closed',
            componentTest(() => TestComponent, fixture => {
                let onClose = jasmine.createSpy('onClose');
                fixture.detectChanges();
                return modalService.dialog(testDialogConfig, { onClose: onClose })
                    .then(modal => {
                        modal.open();
                        tick(100);
                        fixture.detectChanges();
                        getElement(fixture, '.modal-footer button').click();
                        tick();
                        expect(onClose).toHaveBeenCalled();
                    });
            })
        );

        it('closes when clicking the overlay with closeOnOverlayClick = true', () => {
            let testWithPendingPromise = componentTest(
                () => TestComponent,
                fixture => {
                    fixture.detectChanges();

                    let modalInstance: IModalDialog;
                    let modalPromise = modalService.dialog(testDialogConfig, { closeOnOverlayClick: true })
                        .then(modal => {
                            modalInstance = modal.instance;
                            return modal.open();
                        });

                    tick(100);
                    fixture.detectChanges();

                    modalInstance.cancelFn = jasmine.createSpy('cancelFn');

                    getElement(fixture, '.gtx-modal-overlay').click();
                    tick();
                    tick();

                    expect(modalInstance.cancelFn).toHaveBeenCalled();
                    discardPeriodicTasks();
                    tick();
                });

            expect(testWithPendingPromise).not.toThrow();
        });

        it('does not close when clicking the overlay with closeOnOverlayClick = false',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();

                let modalComponentInstance: IModalDialog;
                let modalPromise = modalService.dialog(testDialogConfig, { closeOnOverlayClick: false })
                    .then(modal => {
                        modalComponentInstance = modal.instance;
                        return modal.open();
                    });

                tick();
                fixture.detectChanges();

                modalComponentInstance.cancelFn = jasmine.createSpy('cancelFn');

                getElement(fixture, '.gtx-modal-overlay').click();
                tick();
                tick();

                expect(modalComponentInstance.cancelFn).not.toHaveBeenCalled();
            })
        );

        it('sets a width when passed in the modal options',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.dialog(testDialogConfig, { width: '400px' });
                tick();
                fixture.detectChanges();

                let dialog = getElement(fixture, '.gtx-modal-dialog');
                expect(dialog.style.width).toBe('400px');
            })
        );

        it('does not set any padding by adding a "nopad" class with padding: false',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.dialog(testDialogConfig, { padding: false });
                tick();
                fixture.detectChanges();

                let dialog = getElement(fixture, '.gtx-modal-dialog');
                expect(dialog.classList).toContain('nopad');
            })
        );

        it('sets padding by not adding a "nopad" class with padding: true',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.dialog(testDialogConfig, { padding: true });
                tick();
                fixture.detectChanges();

                let dialog = getElement(fixture, '.gtx-modal-dialog');
                expect(dialog.classList).not.toContain('nopad');
            })
        );

    });

    describe('fromComponent():', () => {

        @Component({
            selector: 'test-modal-cmp',
            template: `<div>TestModalCmp</div>
                <div>{{ localValue }}</div>
                <button class="modal-button" (click)="localFn('bar')"></button>`
        })
        class TestModalCmp implements IModalDialog {
            closeFn: (val: any) => void;
            cancelFn: (val?: any) => void;
            errorFn: (err: Error) => void;

            localValue: string;
            localFn: Function;

            registerCloseFn(close: (val: any) => void): void {
                this.closeFn = close;
            }

            registerCancelFn(cancel: (val: any) => void): void {
                this.cancelFn = cancel;
            }

            registerErrorFn(error: (err: Error) => void): void {
                this.errorFn = error;
            }
        }

        @Component({
            selector: 'bad-modal-cmp',
            template: `<div>BadModalCmp</div>`
        })
        class BadModalCmp {}

        beforeEach(() => {
            TestBed.overrideModule(BrowserDynamicTestingModule, {
                add: {
                    declarations: [TestModalCmp, BadModalCmp],
                    entryComponents: [TestModalCmp, BadModalCmp]
                }
            });

            modalService = TestBed.get(ModalService);
        });

        it('throws if the passed component does not implement IModalDialog',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();

                function run(): void {
                    modalService.fromComponent(BadModalCmp as any);
                    tick();
                }

                expect(run).toThrow();
            })
        );

        it('returns a promise',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                let result = modalService.fromComponent(TestModalCmp);

                expect(typeof result.then).toBe('function');
            })
        );

        it('resolves the returned promise when the modal is closed',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();

                modalService.fromComponent(TestModalCmp)
                    .then<string>(modal => {
                        let promise = modal.open();

                        let cmp: TestModalCmp = <any> modal.instance;
                        cmp.closeFn('some result');

                        return promise;
                    })
                    .then(
                        result => { expect(result).toBe('some result'); },
                        () => { fail('Promise should resolve but rejected'); }
                    );
            })
        );

        it('does not resolve or reject the returned promise when the modal is cancelled',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();

                modalService.fromComponent(TestModalCmp)
                    .then(modal => {
                        let promise = modal.open();

                        let cmp: TestModalCmp = <any> modal.instance;
                        cmp.cancelFn('reason');

                        setTimeout(() => {
                            expect(true).toBe(true);
                            discardPeriodicTasks();
                        }, 500);

                        return promise;
                    })
                    .then(
                        () => { fail('Promise should not resolve but did'); },
                        () => { fail('Promise should not reject but did'); }
                    );

                tick(500);
            })
        );

        it('rejects the returned promise when the passed error handler is called',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();

                modalService.fromComponent(TestModalCmp)
                    .then(modal => {
                        let promise = modal.open();

                        let cmp: TestModalCmp = <any> modal.instance;
                        cmp.errorFn(new Error('a test error'));

                        return promise;
                    })
                    .then(
                        () => fail('Promise should reject but resolved'),
                        (err: Error) => expect(err.message).toBe('a test error')
                    );
            })
        );

        it('contains an instance of the passed component',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.fromComponent(TestModalCmp);
                tick();

                let testModalCmp = getElement(fixture, 'test-modal-cmp');

                expect(testModalCmp).toBeDefined();
                expect(testModalCmp.innerText).toContain('TestModalCmp');
            })
        );

        it('injects local properties (string)',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                modalService.fromComponent(TestModalCmp, {}, { localValue: 'Foo' });
                tick();

                let testModalCmp = getElement(fixture, 'test-modal-cmp');
                fixture.detectChanges();

                expect(testModalCmp).toBeDefined();
                expect(testModalCmp.innerText).toContain('Foo');
            })
        );

        it('injects local properties (function)',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                const spy = jasmine.createSpy('spy');
                modalService.fromComponent(TestModalCmp, {}, { localFn: spy });
                tick();

                fixture.detectChanges();
                getElement(fixture, '.modal-button').click();
                tick();

                expect(spy).toHaveBeenCalledWith('bar');
            })
        );
    });

    describe('openModals', () => {

        beforeEach(() => {
            modalService = TestBed.get(ModalService);
        });

        it('is initially empty', () => {
            expect(modalService.openModals).toEqual([]);
        });

        it('contains ComponentRef once dialog opened', componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            let result = modalService.dialog({ title: 'Test', buttons: []});

            expect(modalService.openModals).toEqual([]);
            return result.then(modal => {
                modal.open();
                tick(50);
                expect(modalService.openModals.length).toBe(1);
                expect(modalService.openModals[0].instance).toBe(modal.instance);
            });
        }));

        it('is empty after dialog is closed', componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            let result = modalService.dialog({ title: 'Test', buttons: []});

            expect(modalService.openModals).toEqual([]);
            return result.then(modal => {
                modal.open();
                const cmp: ModalDialog = <any> modal.instance;
                tick(50);

                expect(modalService.openModals.length).toBe(1);
                cmp.closeFn('some result');
                tick();
                expect(modalService.openModals.length).toBe(0);
            });
        }));

        it('works with multiple dialogs open at once', componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            let result1 = modalService.dialog({ title: 'Test1', buttons: []});
            let result2 = modalService.dialog({ title: 'Test2', buttons: []});

            expect(modalService.openModals).toEqual([]);
            return Promise.all([result1, result2]).then(([modal1, modal2]) => {
                modal1.open();
                const cmp1: ModalDialog = <any> modal1.instance;
                tick(50);
                expect(modalService.openModals.length).toBe(1);

                modal2.open();
                const cmp2: ModalDialog = <any> modal2.instance;
                expect(modalService.openModals.length).toBe(2);

                expect(modalService.openModals[0].instance).toBe(cmp1);
                expect(modalService.openModals[1].instance).toBe(cmp2);

                cmp1.closeFn('some result');
                tick();
                expect(modalService.openModals.length).toBe(1);

                cmp2.closeFn('some result');
                tick();
                expect(modalService.openModals.length).toBe(0);
            });
        }));
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
    template: `<gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {}
