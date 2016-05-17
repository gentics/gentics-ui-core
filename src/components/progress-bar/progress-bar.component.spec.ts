import {Component, ViewChild, DebugElement} from '@angular/core';
import {describe, expect, fakeAsync, inject, it, xit, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';
import {ProgressBar} from './progress-bar.component';

describe('ProgressBar', () => {

    it('starts out as "not active"',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
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
        }))
    );

    it('should return the value bound to "active"',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
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
        }))
    );

    it('should set the "active" property when calling "start()" and "complete()"',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
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
        }))
    );

    it('should set the "active" property when "progress" is set to 100%',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
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
        }))
    );

    xit('should grow its progress indicator in indeterminate mode',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = instance.progressBar;
                const component: DebugElement = fixture.debugElement
                    .query(By.directive(ProgressBar));

                expect(component).not.toBeNull('the component can not be found');
                expect(component.nativeElement).not.toBeNull(
                    'the ProgressBar component does not have a nativeElement');

                const progressIndicator: HTMLElement = component.nativeElement
                    .querySelector('.progress-indicator');

                expect(progressIndicator).not.toBe(null,
                    'the progress bar indicator can not be found');

                const oldWidth = progressIndicator.offsetWidth;

                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                tick();

                const newWidth = progressIndicator.offsetWidth;
                expect(newWidth > oldWidth).toBe(true,
                    `expected progress indicator width to grow after tick() ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);
            });
        }))
    );

    it('should grow its progress indicator with "progress" in determinate mode',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
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

                expect(component.nativeElement).not.toBe(null,
                    'the ProgressBar component does not have a nativeElement');

                const progressIndicator: HTMLElement = component.nativeElement
                    .querySelector('.progress-indicator');

                expect(progressIndicator).not.toBe(null,
                    'the progress bar indicator can not be found');

                const oldWidth = progressIndicator.offsetWidth;

                instance.loadProgress = 0;
                instance.loadingSomething = true;
                fixture.detectChanges();

                expect(progressBar.active).toBe(true,
                    'progressBar.active was expected to be true');

                instance.loadProgress = 80;
                fixture.detectChanges();
                tick();
                const newWidth = progressIndicator.offsetWidth;
                expect(newWidth > oldWidth).toBe(true,
                    `expected progress indicator width to grow when setting "progress" ` +
                    `but it was ${oldWidth}px before and is ${newWidth}px after`);
            });
        }))
    );

    it('should set the "active" property when a Promise passed to "start" is resolved',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar>
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = fixture.debugElement
                    .query(By.directive(ProgressBar)).componentInstance;

                expect(progressBar.active).toBe(false,
                    'Expected progress bar to start as inactive');

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
        }))
    );


    it('should set the "active" property when a Promise passed to "start" is rejected',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar>
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = fixture.debugElement
                    .query(By.directive(ProgressBar)).componentInstance;

                expect(progressBar.active).toBe(false,
                    'Expected progress bar to start as inactive');

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
        }))
    );

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
