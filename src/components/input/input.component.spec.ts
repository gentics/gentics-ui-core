import {Component} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {FormControl, FormGroup, disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

import {InputField} from './input.component';

describe('InputField', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the label',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input label="testLabel"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            })
        ))
    );

    it('should not add the "active" class to label if input is empty',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input label="testLabel"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).not.toContain('active');
            })
        ))
    );

    it('should add the "active" class to label if input not empty',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input label="testLabel" value="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).toContain('active');
            })
        ))
    );

    it('should add the "active" class to label if placeholder is set',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input label="testLabel" placeholder="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).toContain('active');
            })
        ))
    );

    it('should bind the id to the label and input',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input label="testLabel" id="testId"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            })
        ))
    );

    it('should use defaults for undefined attributes which have a default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(false);
                expect(nativeInput.readOnly).toBe(false);
                expect(nativeInput.required).toBe(false);
                expect(nativeInput.type).toBe('text');
                expect(nativeInput.value).toBe('');
            })
        ))
    );

    it('should not display undefined attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
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
                <gtx-input
                    disabled="true"
                    max="100"
                    min="5"
                    maxlength="25"
                    name="testName"
                    pattern="testRegex"
                    placeholder="testPlaceholder"
                    readonly="true"
                    required="true"
                    step="5"
                    type="text"
                    value="testValue"
                ></gtx-input>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(Number(nativeInput.max)).toBe(100);
                expect(Number(nativeInput.min)).toBe(5);
                expect(nativeInput.maxLength).toBe(25);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.pattern).toBe('testRegex');
                expect(nativeInput.placeholder).toBe('testPlaceholder');
                expect(nativeInput.readOnly).toBe(true);
                expect(nativeInput.required).toBe(true);
                expect(Number(nativeInput.step)).toBe(5);
                expect(nativeInput.type).toBe('text');
                expect(nativeInput.value).toBe('testValue');
            })
        ))
    );

    it('should bind a string value',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input [value]="value"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.value).toEqual('testValue');
            })
        ))
    );

    it('should bind a number value',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input type="number" [value]="numberVal"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.value).toEqual('42');
            })
        ))
    );

    it('should emit "blur" when native input blurs, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input (blur)="onBlur($event)" value="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onBlur');

                triggerEvent(nativeInput, 'blur');
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "focus" when native input is focused, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input (focus)="onFocus($event)" value="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onFocus');

                triggerEvent(nativeInput, 'focus');
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "change" when native input value is changed (string)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input (change)="onChange($event)" value="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                triggerEvent(nativeInput, 'input');
                tick();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "change" when native input value is changed (number)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input (change)="onChange($event)" type="number" [value]="numberVal"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                triggerEvent(nativeInput, 'input');
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(42);
            })
        ))
    );

    it('should not emit "change" when native input is blurred',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-input (change)="onChange($event)" value="foo"></gtx-input>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                triggerEvent(nativeInput, 'blur');
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        ))
    );

    describe('ValueAccessor:', () => {

        it('should bind the value with ngModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-input [(ngModel)]="value"></gtx-input>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('testValue');
                })
            ))
        );

        it('should bind the value with ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-input [(ngModel)]="value"></gtx-input>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = 'bar';
                    triggerEvent(nativeInput, 'input');
                    tick();

                    expect(instance.value).toBe('bar');
                })
            ))
        );

        it('should bind the value with formControlName (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-input [formControlName]="'test'"></gtx-input>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('controlValue');
                })
            ))
        );

        it('should bind the value with formControlName (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-input formControlName="test"></gtx-input>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = 'bar';
                    triggerEvent(nativeInput, 'input');
                    tick();

                    expect(instance.testForm.controls['test'].value).toBe('bar');
                })
            ))
        );

        // TODO test if fakeAsync is necessary
        it('should mark the component as "touched" when native input blurs',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-input formControlName="test"></gtx-input>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].touched).toBe(false);
                    expect(instance.testForm.controls['test'].untouched).toBe(true);

                    triggerEvent(nativeInput, 'focus');
                    triggerEvent(nativeInput, 'blur');
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].touched).toBe(true);
                    expect(instance.testForm.controls['test'].untouched).toBe(false);
                })
            ))
        );

    });
});


@Component({
    template: `<gtx-input></gtx-input>`,
    directives: [InputField, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {

    value: string = 'testValue';
    numberVal: number = 42;
    testForm: FormGroup = new FormGroup({
        test: new FormControl('controlValue')
    });

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}

/**
 * Create an dispatch an 'input' event on the <input> element
 */
function triggerEvent(el: HTMLInputElement, eventName: string): void {
    let event: Event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    el.dispatchEvent(event);
}
