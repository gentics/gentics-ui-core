import {Component, ViewChild, DebugElement} from '@angular/core';
import {describe, expect, fakeAsync, inject, xit, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';

import {Observable, Observer} from 'rxjs';
import {ProgressBar} from './progress-bar.component';

describe('ProgressBar', () => {

    it('starts out as "not active"', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar = instance.progressBar;

                expect(progressBar).not.toBeNull();
                expect(progressBar).not.toBeUndefined();
                expect(progressBar.active).toBe(false);
            });
        })
    ));

    it('returns the value bound to "active"', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar = instance.progressBar;

                instance.loadingSomething = true;
                fixture.detectChanges();
                expect(progressBar.active).toBe(true);

                instance.loadingSomething = false;
                fixture.detectChanges();
                expect(progressBar.active).toBe(false);
            });
        })
    ));

    it('sets the "active" property when calling "start()" and "complete()"', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;

                expect(progressBar.active).toBe(false);
                progressBar.start();
                expect(progressBar.active).toBe(true);
                progressBar.complete();
                expect(progressBar.active).toBe(false);
            });
        })
    ));

    it('sets the "active" property when "progress" is set to 100%', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;

                expect(progressBar.active).toBe(false);

                instance.loadProgress = 0;
                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true);

                instance.loadProgress = 100;
                fixture.detectChanges();
                tick();
                expect(progressBar.active).toBe(false);
            });
        })
    ));

    it('grows its progress indicator in indeterminate mode', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
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
                    // This expectation will show up in other tests when it fails
                    expect(newWidth).toBeGreaterThan(oldWidth,
                        'ProgressBar: expected progress indicator to grow in indeterminate mode');
                });

                tick(100);
            });
        })
    ));

    it('grows its progress indicator with the "progress" property in determinate mode', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething" [progress]="loadProgress">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;
                const component: DebugElement = fixture.debugElement
                    .query(By.directive(ProgressBar));

                expect(component).not.toBeNull('the component is null');
                expect(component).not.toBeUndefined('the component can not be found');
                expect(progressBar.active).toBe(false);

                expect(component.nativeElement).not.toBeNull(
                    'the ProgressBar component does not have a nativeElement');

                const progressIndicator: HTMLElement = component.nativeElement
                    .querySelector('.progress-indicator');

                expect(progressIndicator).not.toBeNull(
                    'the progress bar indicator can not be found');

                let oldWidth = progressIndicator.offsetWidth;

                instance.loadProgress = 0;
                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                instance.loadProgress = 60;
                fixture.detectChanges();
                tick();
                let newWidth = progressIndicator.offsetWidth;
                expect(newWidth > oldWidth).toBe(true,
                    `expected progress indicator width to grow when setting "progress" ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);

                oldWidth = newWidth;
                instance.loadProgress = 80;
                fixture.detectChanges();
                tick();
                newWidth = progressIndicator.offsetWidth;
                expect(newWidth > oldWidth).toBe(true,
                    `expected progress indicator width to grow when setting "progress" ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);
            });
        })
    ));

    it('start(Promise) changes the "active" property when the passed Promise is resolved', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const progressBar: ProgressBar = fixture.componentInstance.progressBar;

                let resolve: () => void;
                let promise = new Promise<void>( (done: () => void) => {
                    resolve = done;
                });

                progressBar.start(promise);
                expect(progressBar.active).toBe(true,
                    'Expected active == true after calling start()');
                resolve();
                tick();
                expect(progressBar.active).toBe(false,
                    'Expected active == false after resolving passed promise');
            });
        })
    ));


    it('start(Promise) changes the "active" property when the passed Promise is rejected', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const progressBar: ProgressBar = fixture.componentInstance.progressBar;

                let reject: () => void;
                let promise = new Promise<void>( (_: Function, fail: () => void) => {
                    reject = fail;
                });

                progressBar.start(promise);
                expect(progressBar.active).toBe(true,
                    'Expected active == true after calling start()');
                reject();
                tick();
                expect(progressBar.active).toBe(false,
                    'Expected active == false after rejecting promise');
            });
        })
    ));

    it('start(Observable) changes the "active" property when the Observable completes', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const progressBar: ProgressBar = fixture.componentInstance.progressBar;

                let done: Function;
                let observable: Observable<number> = Observable.create( (observer: Observer<any>) => {
                    done = () => observer.complete();
                });

                progressBar.start(observable);
                expect(progressBar.active).toBe(true,
                    'Expected active == true after start(Observable)');
                done();
                expect(progressBar.active).toBe(false,
                    'Expected active == false after calling Observable.done()');
            });
        })
    ));

    it('start(Observable) changes the "active" property when the Observable has errors', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar></gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const progressBar: ProgressBar = fixture.componentInstance.progressBar;

                let done: Function;
                let error: Function;
                let observable: Observable<number> = Observable.create( (observer: Observer<any>) => {
                    done = () => observer.complete();
                    error = () => observer.error(null);
                });

                expect(progressBar.active).toBe(false);
                progressBar.start(observable);
                expect(progressBar.active).toBe(true,
                    'Expected active == true after start(Observable)');
                error();
                expect(progressBar.active).toBe(false,
                    'Expected active == false after Observable.error()');
                done();
                expect(progressBar.active).toBe(false,
                    'Observable.done() should be ignored after Observable.error()');
            });
        })
    ));

});



@Component({
    template: `<gtx-progress-bar></gtx-progress-bar>`,
    directives: [ProgressBar]
})
class TestComponent {
    @ViewChild(ProgressBar) progressBar: ProgressBar;
    loadingSomething: boolean = false;
    loadProgress: number = 0;
}
