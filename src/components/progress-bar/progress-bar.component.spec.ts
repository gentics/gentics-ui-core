import {Component, DebugElement, ViewChild} from '@angular/core';
import {getTestBed, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';

import {componentTest} from '../../testing';
import {ProgressBar} from './progress-bar.component';

describe('ProgressBar', () => {

    beforeEach(() => TestBed.configureTestingModule({
    declarations: [ProgressBar, TestComponent],
    teardown: { destroyAfterEach: false }
}));

    it('starts out as "not active"',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            const progressBar = instance.progressBar;
            expect(progressBar).toBeDefined();
            expect(progressBar.active).toBe(false);
        })
    );

    it('"active" returns the value bound to it',
        componentTest(() => TestComponent, `
            <gtx-progress-bar [active]="loadingSomething"></gtx-progress-bar>`,
            (fixture, instance) => {
                fixture.detectChanges();

                const progressBar = instance.progressBar;

                instance.loadingSomething = true;
                fixture.detectChanges();
                expect(progressBar.active).toBe(true);

                instance.loadingSomething = false;
                fixture.detectChanges();
                expect(progressBar.active).toBe(false);
            }
        )
    );

    it('sets the "active" property when calling "start()" and "complete()"',
        componentTest(() => ProgressBar, (fixture, progressBar) => {
            fixture.detectChanges();

            expect(progressBar.active).toBe(false);
            progressBar.start();
            expect(progressBar.active).toBe(true);
            progressBar.complete();
            expect(progressBar.active).toBe(false);
        })
    );

    it('sets the "active" property when "progress" is set to 100%',
        componentTest(() => TestComponent, `
            <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
            </gtx-progress-bar>`,
            (fixture, instance) => {
                fixture.detectChanges();

                const progressBar: ProgressBar = instance.progressBar;
                expect(progressBar.active).toBe(false);

                instance.loadProgress = 0.0;
                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true);

                instance.loadProgress = 1.0;
                fixture.detectChanges();
                tick();
                expect(progressBar.active).toBe(false);
            }
        )
    );

    describe('animations', () => {

        // These tests can not be tested with componentTest() or fakeAsync(). Sorry.

        let fakeRAF: { discardPending(): void, restore(): void };
        beforeEach(() => {
            fakeRAF = fakeRequestAnimationFrameWhenTabInBackground();
        });
        afterEach(() => {
            fakeRAF.discardPending();
            fakeRAF.restore();
        });

        it('grows its progress indicator in indeterminate mode',
            (done: DoneFn) => {
                getTestBed().overrideComponent(TestComponent, { set: {
                    template: `<gtx-progress-bar [active]="loadingSomething"></gtx-progress-bar>`
                }});
                let fixture = TestBed.createComponent(TestComponent);
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;
                const progressIndicator: HTMLElement = fixture.debugElement
                    .query(By.directive(ProgressBar))
                    .nativeElement.querySelector('.progress-indicator');

                expect(progressIndicator).not.toBeNull(
                    'progress indicator can not be found');

                instance.loadingSomething = true;
                fixture.detectChanges();
                const oldWidth = progressIndicator.offsetWidth;
                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                requestAnimationFrame(() => {
                    try {
                        const newWidth = progressIndicator.offsetWidth;
                        progressBar.active = false;

                        // This expectation previously showed up in other tests when it failed
                        expect(newWidth).toBeGreaterThan(oldWidth,
                            'ProgressBar: expected progress indicator to grow in indeterminate mode');
                        done();
                    } catch (err) {
                        done.fail(err);
                    }
                });
            }
        );

        it('progress indicator is visible and grows when initialized as active',
            (done: DoneFn) => {
                getTestBed().overrideComponent(TestComponent, { set: {
                    template: ` <gtx-progress-bar [active]="true"></gtx-progress-bar>`
                }});
                const fixture = TestBed.createComponent(TestComponent);

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;
                const wrapper: HTMLElement = fixture.debugElement
                    .query(By.directive(ProgressBar))
                    .nativeElement.querySelector('.progress-bar-wrapper');
                const progressIndicator: HTMLElement = fixture.debugElement
                    .query(By.directive(ProgressBar))
                    .nativeElement.querySelector('.progress-indicator');

                expect(wrapper).not.toBeNull(
                    'progress bar wrapper can not be found');
                expect(progressBar.active).toBe(false,
                    'progressBar.active should be false before first change detection');
                expect(wrapper.classList.contains('visible')).toBe(false,
                    'progress bar wrapper should not have "visible" class before first change detection');

                fixture.detectChanges();

                expect(progressBar.active).toBe(true,
                    'progressBar.active should be true after first change detection');
                expect(wrapper.classList.contains('visible')).toBe(true,
                    'progress bar wrapper should have "visible" class after first change detection');

                const oldWidth = progressIndicator.offsetWidth;

                requestAnimationFrame(() => {
                    try {
                        const newWidth = progressIndicator.offsetWidth;
                        progressBar.active = false;

                        // This expectation previously showed up in other tests when it failed
                        expect(newWidth).toBeGreaterThan(oldWidth,
                            'ProgressBar: expected progress indicator to grow when starting active');
                        done();
                    } catch (err) {
                        done.fail(err);
                    }
                });
            }
        );

        it('grows its progress indicator with the "progress" property in determinate mode',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
                </gtx-progress-bar>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    const progressBar: ProgressBar = instance.progressBar;
                    const component: DebugElement = fixture.debugElement
                        .query(By.directive(ProgressBar));

                    expect(component).toBeDefined('Component can not be found.');
                    expect(progressBar.active).toBe(false);
                    expect(component.nativeElement).toBeDefined('No nativeElement on component.');

                    const progressIndicator: HTMLElement = component.nativeElement.querySelector('.progress-indicator');
                    expect(progressIndicator).toBeDefined('Progress indicator not found.');

                    instance.loadProgress = 0;
                    instance.loadingSomething = true;
                    fixture.detectChanges();
                    const widthAtZeroPercent = progressIndicator.offsetWidth;

                    expect(progressBar.active).toBe(true,
                        'progressBar.active was expected to be true');

                    instance.loadProgress = 0.6;
                    fixture.detectChanges();
                    tick();
                    const widthAtSixtyPercent = progressIndicator.offsetWidth;
                    expect(widthAtSixtyPercent).toBeGreaterThan(widthAtZeroPercent,
                        'expected progress indicator width to grow when setting "progress" from 0% to 60%');

                    instance.loadProgress = 0.8;
                    fixture.detectChanges();
                    tick();
                    const widthAtEightyPercent = progressIndicator.offsetWidth;

                    expect(widthAtEightyPercent).toBeGreaterThan(widthAtSixtyPercent,
                        'expected progress indicator width to grow when setting "progress" from 60% to 80%');
                }
            )
        );

    });

    describe('with Promises:', () => {

        function createPromise(): Promise<any> & { resolve: Function, reject: Function } {
            let resolve: Function;
            let reject: Function;
            const promise = new Promise<any>((resolvePromise, rejectPromise) => {
                resolve = resolvePromise;
                reject = rejectPromise;
            });
            return Object.assign(promise, { resolve, reject });
        }

        it('start() changes the "active" property when the passed Promise is resolved',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const promise = createPromise();

                progressBar.start(promise);
                expect(progressBar.active).toBe(true);

                promise.resolve();
                tick();
                expect(progressBar.active).toBe(false);
            })
        );

        it('start() changes the "active" property when the passed Promise is rejected',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const promise = createPromise();

                progressBar.start(promise);
                expect(progressBar.active).toBe(true,
                    'Not active after calling start()');

                promise.reject();
                tick();
                expect(progressBar.active).toBe(false,
                    'Still active after rejecting promise');
            })
        );

        it('"for" activates the progress bar when a promise is assigned',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [for]="promise"></gtx-progress-bar>`,
                (fixture, testComponent) => {
                    const progressBar = testComponent.progressBar;

                    expect(progressBar.active).toBe(false,
                        'Active without a Promise');

                    testComponent.promise = createPromise();
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true,
                        'Not active when assigned a Promise');
                }
            )
        );

        it('"for" activates the progress bar based on a promise',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [for]="promise"></gtx-progress-bar>`,
                (fixture, testComponent) => {
                    const progressBar = testComponent.progressBar;
                    const promise = createPromise();

                    testComponent.promise = promise;
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true);

                    promise.resolve();
                    tick();
                    expect(progressBar.active).toBe(false,
                        'Still active after resolving Promise.');
                }
            )
        );

        it('"for" only observes the currently attached Promise',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const firstPromise = createPromise();
                const secondPromise = createPromise();

                progressBar.for = firstPromise;
                expect(progressBar.active).toBe(true, 'Not active after assigning first Promise');

                progressBar.for = secondPromise;
                expect(progressBar.active).toBe(true, 'Not active after assigning second Promise');

                firstPromise.resolve();
                tick();
                expect(progressBar.active).toBe(true, 'Not active after resolving first Promise');

                secondPromise.resolve();
                tick();
                expect(progressBar.active).toBe(false, 'Active after resolving second Promise');
            })
        );

    });

    describe('with Observables:', () => {

        it('start() changes the "active" property when the passed Observable completes',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const observable = new Subject<number>();

                progressBar.start(observable);
                expect(progressBar.active).toBe(true,
                    'Not active after calling start(Observable)');
                observable.complete();
                expect(progressBar.active).toBe(false,
                    'Still active after Observable is completed');
            })
        );

        it('start() changes the "active" property when the passed Observable emits errors',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const observable = new Subject<number>();

                expect(progressBar.active).toBe(false);

                progressBar.start(observable);
                expect(progressBar.active).toBe(true,
                    'Not active after calling start(Observable)');

                observable.error(true);
                expect(progressBar.active).toBe(false,
                    'Still active after Observable.error()');
            })
        );

        it('"for" starts the progress bar when assigned an observable',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [for]="observable"></gtx-progress-bar>`,
                (fixture, testComponent) => {
                    const progressBar = testComponent.progressBar;
                    const observable = new Subject<number>();

                    fixture.detectChanges();
                    expect(progressBar.active).toBe(false,
                        'Active without an Observable');

                    testComponent.observable = observable;
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true,
                        'Not active when assigned an Observable');
                }
            )
        );

        it('"for" animates the progress bar based on a number observable',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [for]="observable"></gtx-progress-bar>`,
                (fixture, testComponent) => {
                    const progressBar = testComponent.progressBar;
                    const subject = new Subject<number>();
                    testComponent.observable = subject;
                    fixture.detectChanges();

                    const progressIndicator: HTMLElement = fixture.nativeElement.querySelector('.progress-indicator');
                    expect(progressIndicator).toBeDefined('Progress indicator element not found.');
                    subject.next(0.25);
                    fixture.detectChanges();
                    const oldWidth = progressIndicator.offsetWidth;

                    subject.next(0.75);
                    fixture.detectChanges();
                    const newWidth = progressIndicator.offsetWidth;
                    expect(newWidth).toBeGreaterThan(oldWidth,
                        'Progress bar did not grow after emitting values.');

                    subject.complete();
                    expect(progressBar.active).toBe(false,
                        'Still active after Observable.complete()');
                }
            )
        );

        it('"for" animates the progress bar based on a boolean observable',
            componentTest(() => TestComponent, `
                <gtx-progress-bar [for]="observable"></gtx-progress-bar>`,
                (fixture, testComponent) => {
                    const progressBar = testComponent.progressBar;
                    const subject = new Subject<boolean>();
                    testComponent.observable = subject;
                    fixture.detectChanges();

                    const progressIndicator: HTMLElement = fixture.nativeElement.querySelector('.progress-indicator');
                    expect(progressIndicator).toBeDefined('Progress indicator element not found.');

                    subject.next(false);
                    expect(progressBar.active).toBe(false, 'active after emitting false (#1)');

                    subject.next(true);
                    expect(progressBar.active).toBe(true, 'not active after emitting true (#2)');

                    subject.next(false);
                    expect(progressBar.active).toBe(false, 'active after emitting false (#3)');

                    subject.next(true);
                    expect(progressBar.active).toBe(true, 'not active after emitting true (#4)');
                }
            )
        );

        it('"for" deactivates the progress bar when the passed observable is completed',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const observable = new Subject<number>();

                progressBar.for = observable;
                expect(progressBar.active).toBe(true);

                observable.complete();
                expect(progressBar.active).toBe(false);
            })
        );

        it('"for" deactivates the progress bar when the passed observable has errors',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const observable = new Subject<number>();

                progressBar.for = observable;
                expect(progressBar.active).toBe(true);

                observable.error(true);
                expect(progressBar.active).toBe(false);
            })
        );

        it('"for" only observes the currently assigned Observable',
            componentTest(() => ProgressBar, (fixture, progressBar) => {
                const firstObservable = new Subject<number>();
                const secondObservable = new Subject<number>();

                progressBar.for = firstObservable;
                expect(progressBar.active).toBe(true, 'Not active after assigning first Observable');

                progressBar.for = secondObservable;
                expect(progressBar.active).toBe(true, 'Not active after assigning second Observable');

                firstObservable.complete();
                expect(progressBar.active).toBe(true, 'Not active after first Observable completes');

                secondObservable.complete();
                expect(progressBar.active).toBe(false, 'Still active after second Observable completes');
            })
        );

    });
});


/**
 * This is a workaround because requestAnimationFrame only works when the window is in the foreground.
 * As test windows might be minimized or headless, tests depending on it would never complete.
 *
 * The returned object can cancel all pending timers and restore the original behavior.
 */
function fakeRequestAnimationFrameWhenTabInBackground(): { discardPending(): void, restore(): void } {
    let request = window.requestAnimationFrame ? 'requestAnimationFrame' : 'webkitRequestAnimationFrame';
    let cancel = window.cancelAnimationFrame ? 'cancelAnimationFrame' : 'webkitCancelAnimationFrame';
    let global = <any> window;

    if (!global[request] || !global[cancel]) {
        throw new Error('requestAnimationFrame not supported.');
    }

    const originalRequest = global[request];
    const originalCancel = global[cancel];
    const pendingTimers: number[] = [];

    global[request] = (callback: Function) => {
        let handle = window.setTimeout(callback, 1);
        pendingTimers.push(handle);
        return handle;
    };
    global[cancel] = (handle: number) => {
        window.clearTimeout(handle);
        let index = pendingTimers.indexOf(handle);
        if (index >= 0) {
            pendingTimers.splice(index, 1);
        }
    };

    return {
        discardPending(): void {
            for (let timer of pendingTimers) {
                window.clearTimeout(timer);
            }
        },
        restore(): void {
            global[request] = originalRequest;
            global[cancel] = originalCancel;

        }
    };
}


@Component({
    template: `<gtx-progress-bar></gtx-progress-bar>`
})
class TestComponent {
    @ViewChild(ProgressBar, { static: true }) progressBar: ProgressBar;
    promise: Promise<any>;
    observable: Observable<number> | Observable<boolean>;
    loadingSomething: boolean = false;
    loadProgress: number = 0;
}
