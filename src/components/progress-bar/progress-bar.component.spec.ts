import {Component, ViewChild} from '@angular/core';
import {describe, expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';
import {ProgressBar} from './progress-bar.component';

describe('ProgressBar', () => {

    it('should return the value bound to "active"',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar [active]="loadingSomething">
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = fixture.debugElement
                    .query(By.directive(ProgressBar)).componentInstance;

                expect(progressBar).not.toBe(null);
                expect(progressBar.active).toBe(false);

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
                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = fixture.debugElement
                    .query(By.directive(ProgressBar)).componentInstance;

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
                const instance: TestComponent = fixture.componentInstance;
                const progressBar: ProgressBar = fixture.debugElement
                    .query(By.directive(ProgressBar)).componentInstance;

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

});



@Component({
    template: `<gtx-progress-bar></gtx-progress-bar>`,
    directives: [ProgressBar]
})
class TestComponent {
    loadingSomething: boolean = false;
    loadProgress: number = 0;
}
