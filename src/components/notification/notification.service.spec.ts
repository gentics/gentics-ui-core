import {Component, provide} from '@angular/core';
import {
    beforeEachProviders,
    describe,
    expect,
    fakeAsync,
    getTestInjector,
    inject,
    it,
    tick
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {OverlayHost} from './../overlay-host/overlay-host.component';
import {Notification} from './notification.service';


let injector = getTestInjector().createInjector().resolveAndCreateChild([Notification]);
let notificationService: Notification = injector.get(Notification);

beforeEachProviders(() => [provide(Notification, { useValue: notificationService })]);

describe('Notification:', () => {

    describe('show():', () => {

        /**
         * Call tick() for each async operation resulting from the show() method.
         */
        function runShowAsyncTasks(fixture: ComponentFixture): void {
            tick(); // loadNextToLocation()
            fixture.detectChanges();
        }

        /**
         * Clean up async tasks and destroy the fixture
         */
        function cleanUp(fixture: ComponentFixture): void {
            fixture.destroy();
            tick(500); // dismissing animation delay
            tick(); // setTimeout() from positionOpenToasts()
        }

        function getToastElement(fixture: ComponentFixture): HTMLElement {
            return fixture.nativeElement.querySelector('.gtx-toast');
        }

        it('should return an object with a dismiss() method', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let toast = notificationService.show({ message: 'test', delay: 0 });
                        runShowAsyncTasks(fixture);

                        expect(toast.dismiss).toBeDefined();
                        cleanUp(fixture);
                    });
            })));

        it('should add Toast component to DOM', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        notificationService.show({ message: 'test', delay: 0 });
                        runShowAsyncTasks(fixture);

                        let toast = getToastElement(fixture);

                        expect(toast).not.toBeNull();
                        cleanUp(fixture);
                    });
            })));

        it('Toast should contain correct message', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        notificationService.show({ message: 'test', delay: 0 });
                        runShowAsyncTasks(fixture);

                        let toast = getToastElement(fixture);

                        expect(toast.innerHTML).toContain('test');
                        cleanUp(fixture);
                    });
            })));


        it('should remove Toast when dismiss() is invoked.', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let toast = notificationService.show({ message: 'test', delay: 0 });
                        runShowAsyncTasks(fixture);

                        expect(getToastElement(fixture)).not.toBeNull();

                        toast.dismiss();
                        tick(500);

                        expect(getToastElement(fixture)).toBeNull();
                        cleanUp(fixture);
                    });
            })));

        it('should remove Toast after timeout specified in "delay" option.', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        notificationService.show({ message: 'test', delay: 500 });
                        runShowAsyncTasks(fixture);

                        expect(getToastElement(fixture)).not.toBeNull();

                        tick(500); // delay timeout
                        tick(500); // animate away

                        expect(getToastElement(fixture)).toBeNull();
                        cleanUp(fixture);
                    });
            })));

        it('should not dismiss on click if "dismissOnClick" set to false.', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        notificationService.show({ message: 'test', delay: 0, dismissOnClick: false });
                        runShowAsyncTasks(fixture);

                        let toastElement = getToastElement(fixture);
                        toastElement.click();
                        tick(500);

                        expect(getToastElement(fixture)).not.toBeNull();
                        cleanUp(fixture);
                    });
            })));

        it('should dismiss on click if "dismissOnClick" set to true.', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        notificationService.show({ message: 'test', delay: 0, dismissOnClick: true });
                        runShowAsyncTasks(fixture);

                        let toastElement = getToastElement(fixture);
                        toastElement.click();
                        tick(500);

                        expect(getToastElement(fixture)).toBeNull();
                        cleanUp(fixture);
                    });
            })));

        describe('action option:', () => {

            it('should display the label.', inject([TestComponentBuilder],
                fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.createAsync(TestComponent)
                        .then((fixture: ComponentFixture) => {
                            fixture.detectChanges();
                            notificationService.show({
                                message: 'test',
                                delay: 0,
                                action: {
                                    label: 'testLabel'
                                }
                            });
                            runShowAsyncTasks(fixture);

                            let actionDiv: HTMLElement = fixture.nativeElement.querySelector('.action');

                            expect(actionDiv.innerText).toContain('testLabel');
                            cleanUp(fixture);
                        });
                })));

            it('should invoke the onClick method when clicked.', inject([TestComponentBuilder],
                fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.createAsync(TestComponent)
                        .then((fixture: ComponentFixture) => {
                            fixture.detectChanges();
                            let spy = jasmine.createSpy('spy');
                            notificationService.show({
                                message: 'test',
                                delay: 0,
                                action: {
                                    label: 'testLabel',
                                    onClick: spy
                                }
                            });
                            runShowAsyncTasks(fixture);

                            let actionDiv: HTMLElement = fixture.nativeElement.querySelector('.action');

                            expect(spy).not.toHaveBeenCalled();
                            actionDiv.click();
                            tick();
                            tick(500);

                            expect(spy.calls.count()).toBe(1);
                            cleanUp(fixture);
                        });
                })));

        });

    });
});


@Component({
    template: `<gtx-overlay-host></gtx-overlay-host>`,
    directives: [OverlayHost],
    providers: [provide(Notification, { useValue: notificationService })]
})
class TestComponent {}
