import {Component} from '@angular/core';
import {describe, expect, injectAsync, it} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Button} from './button.component';

describe('Button:', () => {

    it('should be enabled by default', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(false);
            });
    }));

    it('should bind the "disabled" property', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-button [disabled]='true'></gtx-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            });
    }));

    it('should accept literal "disabled" property', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-button disabled='true'></gtx-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            });
    }));

});


@Component({
    template: `<gtx-button></gtx-button>`,
    directives: [Button]
})
class TestComponent {
}
