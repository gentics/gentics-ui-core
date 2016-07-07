import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {FormGroup, FormControl, disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {RadioButton, RadioGroup} from './radio-button.component';

describe('RadioButton', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the label',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button label="testLabel"></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                expect(label.innerText).toBe('testLabel');
            })
        ))
    );

    it('should bind the id to the label and input',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    label="testLabel"
                    id="testId"
                ></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(label.getAttribute('for')).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            })
        ))
    );

    it('should use defaults for undefined attributes which have a default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.checked).toBe(false);
                expect(nativeInput.disabled).toBe(false);
                expect(nativeInput.readOnly).toBe(false);
                expect(nativeInput.required).toBe(false);
                expect(nativeInput.value).toBe('');
            })
        ))
    );

    it('should not display undefined attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

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


    it('should prefill a unique "id" if none is passed in',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

                const id: Attr = nativeInput.attributes.getNamedItem('id');
                expect(id).not.toBe(null);
                expect(id.value.length).toBeGreaterThan(0);
            })
        ))
    );

    it('should pass through the native attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    disabled="true"
                    checked="true"
                    name="testName"
                    readonly="true"
                    required="true"
                    value="testValue"
                ></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(nativeInput.checked).toBe(true);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.readOnly).toBe(true);
                expect(nativeInput.required).toBe(true);
                expect(nativeInput.value).toBe('testValue');
            })
        ))
    );

    it('should emit a single "change" with current value when the native input changes',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button value="foo"
                    (change)="onChange($event)">
                </gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                const spy = instance.onChange = jasmine.createSpy('onChange');

                nativeInput.click();
                tick();
                fixture.detectChanges();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
                expect(spy.calls.count()).toBe(1);
            })
        ))
    );

    it('should emit "blur" with current check state when the native input blurs',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (blur)="onBlur($event)"
                    value="foo"
                    [checked]="true"
                ></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onBlur');

                debugInput.triggerEventHandler('blur', null);
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith(true);
            })
        ))
    );

    it('should emit "focus" with current check state when the native input is focused',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (focus)="onFocus($event)"
                    value="foo"
                ></gtx-radio-button>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                spyOn(instance, 'onFocus');

                debugInput.triggerEventHandler('focus', null);
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith(false);
            })
        ))
    );

    describe('ValueAccessor:', () => {

        it('should change a variable bound with ngModel when selected',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="foo"
                        [checked]="checkState"
                    ></gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const instance: TestComponent = fixture.componentInstance;
                    instance.boundProperty = undefined;
                    fixture.detectChanges();
                    tick();
                    expect(instance.checkState).toBe(false);
                    expect(instance.boundProperty).toBe(undefined);

                    instance.checkState = true;
                    fixture.detectChanges();
                    tick();
                    expect(instance.checkState).toBe(true);
                    expect(instance.boundProperty).toBe('foo');
                })
            ))
        );

        it('should bind the check state with ngModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="otherValue">
                    </gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(nativeInput.checked).toBe(false);

                    instance.boundProperty = 'otherValue';
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(true);

                    instance.boundProperty = undefined;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(false);
                })
            ))
        );

        it('should update a bound property with ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        [checked]="checkState"
                        value="otherValue"
                    ></gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(instance.checkState).toBe(false);
                    expect(nativeInput.checked).toBe(false);
                    expect(instance.boundProperty).toBe('boundValue');

                    instance.checkState = true;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(instance.checkState).toBe(true);
                    expect(nativeInput.checked).toBe(true);
                    expect(instance.boundProperty).toBe('otherValue');
                })
            ))
        );

        it('should update multiple radioButtons bound on one ngModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(false);

                    instance.boundObjectProperty = instance.objectValues[0];
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInputs[0].checked).toBe(true);
                    expect(nativeInputs[1].checked).toBe(false);

                    instance.boundObjectProperty = instance.objectValues[1];
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(true);
                })
            ))
        );

        it('should update multiple radioButtons bound on one ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                    expect(nativeInputs[0].checked).toBe(false);
                    expect(nativeInputs[1].checked).toBe(false);

                    nativeInputs[0].click();
                    tick();
                    fixture.detectChanges();
                    tick();
                    expect(nativeInputs[0].checked).toBe(true, 'aa');
                    expect(nativeInputs[1].checked).toBe(false, 'bb');
                    expect(instance.boundObjectProperty).toBe(instance.objectValues[0], 'cc');

                    nativeInputs[1].click();
                    tick();
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInputs[0].checked).toBe(false, 'dd');
                    expect(nativeInputs[1].checked).toBe(true, 'ee');
                    expect(instance.boundObjectProperty).toBe(instance.objectValues[1], 'ff');
                })
            ))
        );

        it('should bind the value with formControlName (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-radio-button formControlName="testControl" value="radioValue">
                        </gtx-radio-button>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const control: FormControl = <FormControl> instance.testForm.find('testControl');

                    expect(nativeInput.checked).toBe(false);

                    control.updateValue('radioValue');
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(true);
                })
            ))
        );

        it('should bind the value with formControlName (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-radio-button
                            [checked]="checkState"
                            formControlName="testControl"
                            value="targetValue">
                        </gtx-radio-button>
                    </form>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const instance: TestComponent = fixture.componentInstance;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const control: FormControl = <FormControl> instance.testForm.find('testControl');

                    instance.checkState = false;
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(false);

                    instance.checkState = true;
                    fixture.detectChanges();
                    tick();

                    expect(nativeInput.checked).toBe(true);
                    expect(control.value).toBe('targetValue');
                })
            ))
        );

    });

    describe('stateless mode:', () => {

        it('stateless mode should be disabled by default',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const radioButtonComponent = fixture.componentInstance.radioButtonComponent;
                    fixture.detectChanges();

                    // TODO: Testing private properties is bad - is there a better way?
                    expect(radioButtonComponent['statelessMode']).toBe(false);
                })
            ))
        );

        it('stateless mode should be enabled when using "checked" attribute',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button checked="true"></gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const radioButtonComponent = fixture.componentInstance.radioButtonComponent;
                    fixture.detectChanges();

                    expect(radioButtonComponent['statelessMode']).toBe(true);
                })
            ))
        );

        it('should not change check state on click when bound to "checked" attribute',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button checked="false"></gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const radioButtonComponent = fixture.componentInstance.radioButtonComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);

                    nativeInput.click();
                    tick();
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);
                })
            ))
        );

        it('should change check state when "checked" attribute binding changes',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button [checked]="checkState"></gtx-radio-button>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const instance: TestComponent = fixture.componentInstance;
                    const radioButtonComponent = fixture.componentInstance.radioButtonComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);

                    instance.checkState = true;
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(true);
                    expect(nativeInput.checked).toBe(true);
                })
            ))
        );

    });
});

describe('RadioGroup', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the check state of RadioButton children with ngModel (inbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.boundProperty = 'A';
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                instance.boundProperty = 'B';
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            })
        ))
    );

    it('should uncheck all RadioButton children when none of their values match a property bound with ngModel (inbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.boundProperty = 'A';
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(nativeInputs[0].checked).toBe(true, 'checkbox A is not checked');
                expect(nativeInputs[1].checked).toBe(false, 'checkbox B is checked but should not be');

                instance.boundProperty = 'some other value';
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(nativeInputs[0].checked).toBe(false, 'checkbox A does not get unchecked');
                expect(nativeInputs[1].checked).toBe(false, 'checkbox B is checked when it should not be');
            })
        ))
    );

    it('should update a ngModel bound property when RadioButton children are checked (outbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                tick();
                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                nativeInputs[0].click();
                fixture.detectChanges();
                tick();
                expect(instance.boundProperty).toBe('A');
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                nativeInputs[1].click();
                fixture.detectChanges();
                tick();
                expect(instance.boundProperty).toBe('B');
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            })
        ))
    );

    // TODO: Throws "Expression has changed after it was checked. Previous value: 'boundValue'. Current value: 'A'"
    xit('should set a ngModel bound property to null when no RadioButton children are checked (outbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-group [(ngModel)]="boundProperty">
                    <gtx-radio-button value="A" [checked]="checkState"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.checkState = true;
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(instance.boundProperty).toBe('A');
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                instance.checkState = false;
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(instance.boundProperty).toBe(null);
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(false);
            })
        ))
    );

    it('should bind the check state of RadioButton children with formControlName (inbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-radio-group formControlName="testControl">
                        <gtx-radio-button value="A"></gtx-radio-button>
                        <gtx-radio-button value="B"></gtx-radio-button>
                    </gtx-radio-group>
                </form>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: FormControl = <FormControl> instance.testForm.find('testControl');

                control.updateValue('A');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                control.updateValue('B');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            })
        ))
    );

    it('should bind the check state of RadioButton children with formControlName (outbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-radio-group formControlName="testControl">
                        <gtx-radio-button value="A"></gtx-radio-button>
                        <gtx-radio-button value="B"></gtx-radio-button>
                    </gtx-radio-group>
                </form>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: FormControl = <FormControl> instance.testForm.find('testControl');

                control.updateValue('A');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                control.updateValue('B');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            })
        )
    ));

});

@Component({
    template: `<gtx-radio-button></gtx-radio-button>`,
    directives: [RadioButton, RadioGroup, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {

    boundProperty: string = 'boundValue';
    checkState: boolean = false;
    testForm: FormGroup = new FormGroup({
        testControl: new FormControl('controlValue')
    });

    boundObjectProperty: any = undefined;
    objectValues: any[] = [
        { a: 1 },
        { b: 2 }
    ];

    @ViewChild(RadioButton) radioButtonComponent: RadioButton;

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
