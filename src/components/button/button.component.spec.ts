import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {async, inject} from '@angular/core/testing';

import {Button} from './button.component';

describe('Button:', () => {

    it('should be enabled by default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(false);
            })
        ))
    );

    it('should bind the "disabled" property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button [disabled]="true"></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            })
        ))
    );

    it('should accept literal "disabled" property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button disabled="true"></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            })
        ))
    );

    it('should accept empty "disabled" property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button disabled></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();
                expect(button.disabled).toBe(true);
            })
        ))
    );

    it('forwards its "click" event when enabled',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button (click)="onClick($event)"></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let onClick = fixture.componentRef.instance.onClick = jasmine.createSpy('onClick');
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                let event = document.createEvent('MouseEvent');
                event.initEvent('click', true, true);

                button.dispatchEvent(event);
                button.parentElement.dispatchEvent(event);
                button.click();

                expect(onClick).toHaveBeenCalledTimes(3);
            })
        ))
    );

    // Disabled elements don't fire mouse events in some browsers, but not all
    // http://stackoverflow.com/a/3100395/5460631
    it('does not forward "click" event when disabled',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-button [disabled]="true" (click)="onClick($event)"></gtx-button>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let onClick = fixture.componentRef.instance.onClick = jasmine.createSpy('onClick');
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                let event = document.createEvent('MouseEvent');
                event.initEvent('click', true, true);

                button.dispatchEvent(event);
                button.parentElement.dispatchEvent(event);
                button.click();

                expect(onClick).not.toHaveBeenCalled();
            })
        ))
    );

});

@Component({
    template: `<gtx-button></gtx-button>`,
    directives: [Button]
})
class TestComponent {
    onClick(): void {}
}
