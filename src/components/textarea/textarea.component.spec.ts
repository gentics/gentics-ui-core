import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, DebugElement} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {FormGroup, FormControl, disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {Textarea} from './textarea.component';


describe('Textarea', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the label',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea label="testLabel"></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            })
        ))
    );

    it('should bind the id to the label and input',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea label="testLabel" id="testId">
                </gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                fixture.detectChanges();
                expect(label.htmlFor).toBe('testId');
                expect(nativeTextarea.id).toBe('testId');
            })
        ))
    );

    it('should use defaults for undefined attributes which have a default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.disabled).toBe(false);
                expect(nativeTextarea.readOnly).toBe(false);
                expect(nativeTextarea.required).toBe(false);
                expect(nativeTextarea.value).toBe('');
            })
        ))
    );

    it('should not display undefined attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `<gtx-textarea></gtx-textarea>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                const getAttr: Function = (name: string) => nativeTextarea.attributes.getNamedItem(name);
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
                <gtx-textarea
                    disabled="true"
                    maxlength="25"
                    name="testName"
                    placeholder="testPlaceholder"
                    readonly="true"
                    required="true"
                    value="testValue"
                ></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.disabled).toBe(true);
                expect(nativeTextarea.maxLength).toBe(25);
                expect(nativeTextarea.name).toBe('testName');
                expect(nativeTextarea.placeholder).toBe('testPlaceholder');
                expect(nativeTextarea.readOnly).toBe(true);
                expect(nativeTextarea.required).toBe(true);
                expect(nativeTextarea.value).toBe('testValue');
            })
        ))
    );

    it('should ignore maxLength if not positive integer [0]',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea [maxlength]="0"></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            })
        ))
    );

    it('should ignore maxLength if not positive integer [-1]',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea [maxlength]="-1"></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            })
        ))
    );

    it('should ignore maxLength if not positive integer [null]',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea [maxlength]="null"></gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            })
        ))
    );

    it('should emit "blur" when native input blurs, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea (blur)="onBlur($event)" value="foo">
                </gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let textareaDebugElement: DebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onBlur');

                textareaDebugElement.triggerEventHandler('blur', null);
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "focus" when native input is focused, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea (focus)="onFocus($event)" value="foo">
                </gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let textareaDebugElement: DebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onFocus');

                textareaDebugElement.triggerEventHandler('focus', null);
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "change" when native input value is changed',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea (change)="onChange($event)" value="foo">
                </gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                triggerInputEvent(nativeTextarea);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
            })
        ))
    );

    it('should emit "change" when native input is blurred',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-textarea (change)="onChange($event)" value="foo">
                </gtx-textarea>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let textareaDebugElement: DebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onChange');

                textareaDebugElement.triggerEventHandler('blur', null);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
            })
        ))
    );

    describe('ValueAccessor:', () => {

        it('should bind the value with ngModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-textarea [(ngModel)]="value"></gtx-textarea>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    expect(nativeTextarea.value).toBe('testValue');
                })
            ))
        );

        it('should bind the value with ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-textarea [(ngModel)]="value"></gtx-textarea>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                    nativeTextarea.value = 'bar';
                    triggerInputEvent(nativeTextarea);
                    tick();

                    expect(instance.value).toBe('bar');
                })
            ))
        );

        it('should bind the value with formControl (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-textarea formControlName="test"></gtx-textarea>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    expect(nativeTextarea.value).toBe('controlValue');
                })
            ))
        );

        it('should bind the value with formControl (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-textarea formControlName="test"></gtx-textarea>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                    nativeTextarea.value = 'bar';
                    triggerInputEvent(nativeTextarea);
                    tick();

                    expect(instance.testForm.controls['test'].value).toBe('bar');
                })
            ))
        );

    });
});


@Component({
    template: `<gtx-textarea></gtx-textarea>`,
    directives: [Textarea, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {

    value: string = 'testValue';
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
function triggerInputEvent(el: HTMLTextAreaElement): void {
    let event: Event = document.createEvent('Event');
    event.initEvent('input', true, true);
    el.dispatchEvent(event);
}
