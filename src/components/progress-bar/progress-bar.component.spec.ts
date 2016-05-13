import {Component} from '@angular/core';
import {describe, expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {ProgressBar} from './progress-bar.component';

describe('ProgressBar', () => {

    it('definitely needs some tests',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-progress-bar>
                </gtx-progress-bar>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                tick();

                // TODO - Add tests
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
