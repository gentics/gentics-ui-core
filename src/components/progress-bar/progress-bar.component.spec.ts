import {Component, ViewChild, DebugElement} from '@angular/core';
import {fakeAsync, inject, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';

import {ProgressBar} from './progress-bar.component';


describe('ProgressBar', () => {

    it('starts out as "not active"',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(ProgressBar)
            .then(fixture => {
                const progressBar = fixture.componentRef.instance;
                expect(progressBar).toBeDefined();
                expect(progressBar.active).toBe(false);
            })
        ))
    );

    it('"active" returns the value bound to it',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething"></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar = instance.progressBar;

                instance.loadingSomething = true;
                fixture.detectChanges();
                expect(progressBar.active).toBe(true);

                instance.loadingSomething = false;
                fixture.detectChanges();
                expect(progressBar.active).toBe(false);
            })
        ))
    );

    it('sets the "active" property when calling "start()" and "complete()"',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(ProgressBar)
            .then(fixture => {
                fixture.detectChanges();
                const progressBar: ProgressBar = fixture.componentRef.instance;

                expect(progressBar.active).toBe(false);
                progressBar.start();
                expect(progressBar.active).toBe(true);
                progressBar.complete();
                expect(progressBar.active).toBe(false);
            })
        ))
    );

    it('sets the "active" property when "progress" is set to 100%',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
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
            })
        ))
    );

    it('grows its progress indicator in indeterminate mode',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;
                const progressIndicator: HTMLElement = fixture.debugElement.query(By.directive(ProgressBar))
                    .nativeElement.querySelector('.progress-indicator');

                expect(progressIndicator).not.toBeNull(
                    'progress indicator can not be found');

                const oldWidth = parseFloat(progressIndicator.style.width);
                instance.loadingSomething = true;
                fixture.detectChanges();
                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                requestAnimationFrame(() => {
                    fixture.detectChanges();
                    const newWidth = parseFloat(progressIndicator.style.width);
                    progressBar.active = false;

                    // This expectation might show up in other tests when it fails
                    expect(newWidth).toBeGreaterThan(oldWidth,
                        'ProgressBar: expected progress indicator to grow in indeterminate mode');
                });

                tick(100);
                return fixture.whenStable();
            })
        ))
    );

    it('grows its progress indicator with the "progress" property in determinate mode',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();

                const instance = fixture.componentRef.instance;
                const progressBar: ProgressBar = instance.progressBar;
                const component: DebugElement = fixture.debugElement
                    .query(By.directive(ProgressBar));

                expect(component).toBeDefined('Component can not be found.');
                expect(progressBar.active).toBe(false);
                expect(component.nativeElement).toBeDefined('No nativeElement on component.');

                const progressIndicator: HTMLElement = component.nativeElement.querySelector('.progress-indicator');
                expect(progressIndicator).toBeDefined('Progress indicator not found.');
                let oldWidth = progressIndicator.offsetWidth;

                instance.loadProgress = 0;
                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                instance.loadProgress = 0.6;
                fixture.detectChanges();
                tick();
                let newWidth = progressIndicator.offsetWidth;
                expect(newWidth).toBeGreaterThan(oldWidth,
                    `expected progress indicator width to grow when setting "progress" ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);

                oldWidth = newWidth;
                instance.loadProgress = 0.8;
                fixture.detectChanges();
                tick();
                newWidth = progressIndicator.offsetWidth;

                expect(newWidth).toBeGreaterThan(oldWidth,
                    `expected progress indicator width to grow when setting "progress" ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);
            })
        ))
    );

    describe('with Promises:', () => {

        let promise: Promise<any>;
        let resolvePromise: Function;
        let rejectPromise: Function;

        beforeEach(() => {
            promise = <any> new Promise<any>((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
            });
        });

        it('start() changes the "active" property when the passed Promise is resolved',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar: ProgressBar = fixture.componentRef.instance;

                    progressBar.start(promise);
                    expect(progressBar.active).toBe(true);

                    resolvePromise();
                    tick();
                    expect(progressBar.active).toBe(false);
                })
            ))
        );

        it('start() changes the "active" property when the passed Promise is rejected',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar = fixture.componentRef.instance;

                    progressBar.start(promise);
                    expect(progressBar.active).toBe(true,
                        'Not active after calling start()');

                    rejectPromise();
                    tick();
                    expect(progressBar.active).toBe(false,
                        'Still active after rejecting promise');
                })
            ))
        );

        it('"for" activates the progress bar when a promise is assigned',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-progress-bar [for]="promise"></gtx-progress-bar>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const testComponent = fixture.componentRef.instance;
                    const progressBar = testComponent.progressBar;

                    expect(progressBar.active).toBe(false,
                        'Active without a Promise');

                    testComponent.promise = promise;
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true,
                        'Not active when assigned a Promise');
                })
            ))
        );

        it('"for" activates the progress bar based on a promise',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-progress-bar [for]="promise"></gtx-progress-bar>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const testComponent = fixture.componentRef.instance;
                    const progressBar = testComponent.progressBar;

                    expect(progressBar.active).toBe(false,
                        'Active without a Promise');

                    testComponent.promise = promise;
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true,
                        'Not active when assigned a Promise');

                    resolvePromise();
                    tick();
                    expect(progressBar.active).toBe(false,
                        'Still active after resolving Promise.');
                })
            ))
        );

    });

    describe('with Observables:', () => {

        it('start() changes the "active" property when the passed Observable completes',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar = fixture.componentRef.instance;
                    let observable = new Subject<number>();

                    progressBar.start(observable);
                    expect(progressBar.active).toBe(true,
                        'Not active after calling start(Observable)');
                    observable.complete();
                    expect(progressBar.active).toBe(false,
                        'Still active after Observable is completed');
                })
            ))
        );

        it('start() changes the "active" property when the passed Observable emits errors',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar = fixture.componentRef.instance;
                    let observable = new Subject<number>();

                    expect(progressBar.active).toBe(false);

                    progressBar.start(observable);
                    expect(progressBar.active).toBe(true,
                        'Not active after calling start(Observable)');

                    observable.error();
                    expect(progressBar.active).toBe(false,
                        'Still active after Observable.error()');
                })
            ))
        );

        it('"for" starts the progress bar when assigned an observable',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-progress-bar [for]="observable"></gtx-progress-bar>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const testComponent = fixture.componentRef.instance;
                    const progressBar = testComponent.progressBar;
                    let observable = new Subject<number>();

                    fixture.detectChanges();
                    expect(progressBar.active).toBe(false,
                        'Active without an Observable');

                    testComponent.observable = observable;
                    fixture.detectChanges();
                    expect(progressBar.active).toBe(true,
                        'Not active when assigned an Observable');
                })
            ))
        );

        it('"for" animates the progress bar based on an observable',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-progress-bar [for]="observable"></gtx-progress-bar>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const testComponent = fixture.componentRef.instance;
                    const progressBar = testComponent.progressBar;
                    let observable = new Subject<number>();
                    testComponent.observable = observable;
                    fixture.detectChanges();

                    const progressIndicator: HTMLElement = fixture.nativeElement.querySelector('.progress-indicator');
                    expect(progressIndicator).toBeDefined('Progress indicator element not found.');
                    observable.next(0.25);
                    fixture.detectChanges();
                    let oldWidth = progressIndicator.offsetWidth;

                    observable.next(0.75);
                    fixture.detectChanges();
                    let newWidth = progressIndicator.offsetWidth;
                    expect(newWidth).toBeGreaterThan(oldWidth,
                        'Progress bar did not grow after emitting values.');

                    observable.complete();
                    expect(progressBar.active).toBe(false,
                        'Still active after Observable.complete()');
                })
            ))
        );

        it('"for" deactivates the progress bar when the passed observable is completed',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar = fixture.componentRef.instance;
                    let observable = new Subject<number>();

                    progressBar.for = observable;
                    expect(progressBar.active).toBe(true);

                    observable.complete();
                    expect(progressBar.active).toBe(false);
                })
            ))
        );

        it('"for" deactivates the progress bar when the passed observable has errors',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(ProgressBar)
                .then(fixture => {
                    const progressBar = fixture.componentRef.instance;
                    let observable = new Subject<number>();

                    progressBar.for = observable;
                    expect(progressBar.active).toBe(true);

                    observable.error();
                    expect(progressBar.active).toBe(false);
                })
            ))
        );

    });
});


@Component({
    template: `<gtx-progress-bar></gtx-progress-bar>`,
    directives: [ProgressBar]
})
class TestComponent {
    @ViewChild(ProgressBar) progressBar: ProgressBar;
    promise: Promise<any>;
    observable: Observable<number>;
    loadingSomething: boolean = false;
    loadProgress: number = 0;
}
