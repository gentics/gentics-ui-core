import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, DebugElement} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {Range} from './range.component';

describe('Range:', () => {

    it('should use defaults for undefined attributes which have a default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range></gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(false);
                expect(nativeInput.readOnly).toBe(false);
                expect(nativeInput.required).toBe(false);
                expect(nativeInput.value).toBe('50');
            })
        ))
    );

    it('should not display undefined attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range></gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

                expect(getAttr('id')).toBe(null);
                expect(getAttr('max')).toBe(null);
                expect(getAttr('min')).toBe(null);
                expect(getAttr('maxLength')).toBe(null);
                expect(getAttr('name')).toBe(null);
                expect(getAttr('pattern')).toBe(null);
                expect(getAttr('placeholder')).toBe(null);
                expect(getAttr('step')).toBe(null);
            })
        ))
    );

    it('should pass through the native attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range
                    disabled="true"
                    max="100"
                    min="5"
                    name="testName"
                    readonly="true"
                    required="true"
                    step="5"
                    value="35"
                ></gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(parseInt(nativeInput.max, 10)).toBe(100);
                expect(parseInt(nativeInput.min, 10)).toBe(5);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.readOnly).toBe(true);
                expect(nativeInput.required).toBe(true);
                expect(parseInt(nativeInput.step, 10)).toBe(5);
                expect(nativeInput.value).toBe('35');
            })
        ))
    );

    it('should emit "blur" when native input blurs, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range
                    (blur)="onBlur($event)"
                    [value]="value">
                </gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onBlur');

                let event = document.createEvent('FocusEvent');
                event.initEvent('blur', true, true);
                inputDel.triggerEventHandler('blur', event);
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith(75);
            })
        ))
    );

    it('should emit "focus" when native input is focused, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range
                    (focus)="onFocus($event)"
                    [value]="value">
                </gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onFocus');

                let event = document.createEvent('FocusEvent');
                event.initEvent('focus', true, true);
                inputDel.triggerEventHandler('focus', event);
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith(75);
            })
        ))
    );

    it('should emit "change" when native input value is changed',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range (change)="onChange($event)" value="25">
                </gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                triggerInputEvent(nativeInput);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(25);
            })
        ))
    );

    it('should emit "change" when native input is blurred',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-range
                    (change)="onChange($event)"
                    value="25">
                </gtx-range>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                let event = document.createEvent('FocusEvent');
                event.initEvent('blur', true, true);
                inputDel.triggerEventHandler('blur', event);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(25);
            })
        ))
    );

    describe('ValueAccessor:', () => {

        it('should bind the value with ngModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-range [(ngModel)]="value"></gtx-range>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('75');
                })
            ))
        );

        it('should bind the value with ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-range [(ngModel)]="value"></gtx-range>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = '30';
                    triggerInputEvent(nativeInput);
                    tick();

                    expect(instance.value).toBe(30);
                })
            ))
        );

        it('should bind the value with formControl (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-range formControlName="test"></gtx-range>
                    </form>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('75');
                })
            ))
        );

        it('should bind the value with formControl (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-range formControlName="test"></gtx-range>
                    </form>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = '30';
                    triggerInputEvent(nativeInput);
                    tick();

                    expect(instance.testForm.controls['test'].value).toBe(30);
                })
            ))
        );

    });

    describe('DOM Events:', () => {

        function spyWasNotCalledWithDomEvent(spy: jasmine.Spy): boolean {
            let result = true;
            spy.calls.all().forEach(call => {
                result = result && expect(call.args[0] instanceof Event).toBe(false);
            });
            return result;
        }

        it('should not forward the native blur event',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-range (blur)="onBlur($event)"></gtx-range>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const instance = fixture.componentRef.instance;
                    const onBlur = instance.onBlur = jasmine.createSpy('onBlur');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = document.createEvent('FocusEvent');
                    event.initEvent('blur', true, true);
                    nativeInput.dispatchEvent(event);

                    spyWasNotCalledWithDomEvent(onBlur);
                })
            ))
        );

        it('should not forward the native focus event',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-range (focus)="onFocus($event)"></gtx-range>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const instance = fixture.componentRef.instance;
                    const onFocus = instance.onFocus = jasmine.createSpy('onFocus');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = document.createEvent('FocusEvent');
                    event.initEvent('focus', true, true);
                    nativeInput.dispatchEvent(event);

                    spyWasNotCalledWithDomEvent(onFocus);
                })
            ))
        );

        it('should not forward the native change event',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-range (change)="onChange($event)"></gtx-range>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    const instance = fixture.componentRef.instance;
                    const onChange = instance.onFocus = jasmine.createSpy('onChange');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = document.createEvent('Event');
                    event.initEvent('change', true, false);
                    nativeInput.dispatchEvent(event);

                    spyWasNotCalledWithDomEvent(onChange);

                    nativeInput.value = '15';
                    event = document.createEvent('FocusEvent');
                    event.initEvent('blur', true, false);
                    nativeInput.dispatchEvent(event);

                    spyWasNotCalledWithDomEvent(onChange);
                })
            ))
        );

    });
});

@Component({
    template: `<gtx-range></gtx-range>`,
    directives: [Range, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {

    value: number = 75;
    testForm: FormGroup = new FormGroup({
        test: new FormControl(75)
    });

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}

/**
 * Create an dispatch an 'input' event on the <input> element
 */
function triggerInputEvent(el: HTMLInputElement): void {
    let event: Event = document.createEvent('Event');
    event.initEvent('input', true, true);
    el.dispatchEvent(event);
}
