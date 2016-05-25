import {Component} from '@angular/core';
import {describe, expect, inject, it} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Breadcrumbs} from './breadcrumbs.component';

describe('Breadcrumbs:', () => {

    // it('should be enabled by default', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    //     tcb.createAsync(TestComponent)
    //         .then((fixture: ComponentFixture<TestComponent>) => {
    //             let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    //             fixture.detectChanges();

    //             expect(button.disabled).toBe(false);
    //         });
    // }));

    // it('should bind the "disabled" property', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    //     tcb.overrideTemplate(TestComponent, `<gtx-button [disabled]='true'></gtx-button>`)
    //         .createAsync(TestComponent)
    //         .then((fixture: ComponentFixture<TestComponent>) => {
    //             let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    //             fixture.detectChanges();

    //             expect(button.disabled).toBe(true);
    //         });
    // }));

    // it('should accept literal "disabled" property', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    //     tcb.overrideTemplate(TestComponent, `<gtx-button disabled='true'></gtx-button>`)
    //         .createAsync(TestComponent)
    //         .then((fixture: ComponentFixture<TestComponent>) => {
    //             let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    //             fixture.detectChanges();

    //             expect(button.disabled).toBe(true);
    //         });
    // }));

});

@Component({
    template: `<gtx-breadcrumbs></gtx-breadcrumbs>`,
    directives: [Breadcrumbs]
})
class TestComponent {
}
