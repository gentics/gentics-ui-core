import {Component, DebugElement} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {By} from '@angular/platform-browser';
import {describe, expect, inject, fakeAsync, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Checkbox} from './checkbox.component';

describe('Checkbox', () => {

    it('should bind the label',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox label="testLabel"></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                    fixture.detectChanges();
                    expect(label.innerText).toBe('testLabel');
                });
        })
    );

    it('should bind the id to the label and input',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox
                    label="testLabel"
                    id="testId"
                ></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    fixture.detectChanges();

                    expect(label.htmlFor).toBe('testId');
                    expect(label.getAttribute('for')).toBe('testId');
                    expect(nativeInput.id).toBe('testId');
                });
        })
    );

    it('should use defaults for undefined attributes which have a default',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox></gtx-checkbox>
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
                    });
            }
        ));

    it('should not display undefined attributes',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox></gtx-checkbox>
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
                });
        })
    );


    it('should prefill a unique "id" if none is passed in',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                    fixture.detectChanges();

                    const id: Attr = nativeInput.attributes.getNamedItem('id');
                    expect(id).not.toBe(null);
                    expect(id.value.length).toBeGreaterThan(0);
                });
        })
    );

    it('should pass through the native attributes',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox
                    disabled="true"
                    [checked]="true"
                    name="testName"
                    readonly="true"
                    required="true"
                    value="testValue"
                ></gtx-checkbox>
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
                });
        })
    );

    it('should emit a single "change" with current check state when the native input changes',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-checkbox (change)="onChange($event)"></gtx-checkbox>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    const spy = instance.onChange = jasmine.createSpy('onChange');

                    nativeInput.click();
                    tick();
                    fixture.detectChanges();

                    expect(instance.onChange).toHaveBeenCalledWith(true);
                    expect(spy.calls.count()).toBe(1);
                });
        }))
    );

    it('should emit "blur" with current check state when the native input blurs',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox
                    (blur)="onBlur($event)"
                    value="foo"
                    [checked]="true"
                ></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    instance.onBlur = jasmine.createSpy('onBlur');

                    debugInput.triggerEventHandler('blur', null);
                    fixture.detectChanges();
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith(true);
                });
        }))
    );

    it('should emit "blur" with "indeterminate" when indeterminate and native input is blurred',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox
                    (blur)="onBlur($event)"
                    value="foo"
                    [indeterminate]="true"
                ></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    instance.onBlur = jasmine.createSpy('onBlur');

                    debugInput.triggerEventHandler('blur', null);
                    fixture.detectChanges();
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith('indeterminate');
                });
        }))
    );

    it('should emit "focus" with current check state when the native input is focused', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-checkbox
                    (focus)="onFocus($event)"
                    value="foo"
                    [checked]="true"
                ></gtx-checkbox>
            `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    instance.onFocus = jasmine.createSpy('onFocus');

                    debugInput.triggerEventHandler('focus', null);
                    fixture.detectChanges();
                    tick();

                    expect(instance.onFocus).toHaveBeenCalledWith(true);
                });
        }))
    );

    describe('ValueAccessor:', () => {

        it('should bind the check state with NgModel (inbound)',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.overrideTemplate(TestComponent, `
                    <gtx-checkbox
                        [(ngModel)]="boundProperty"
                        value="otherValue">
                    </gtx-checkbox>
                `)
                        .createAsync(TestComponent)
                        .then((fixture: ComponentFixture<TestComponent>) => {
                            const instance: TestComponent = fixture.componentInstance;
                            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                            instance.boundProperty = false;
                            fixture.detectChanges();

                            expect(nativeInput.checked).toBe(false);
                            expect(nativeInput.indeterminate).toBe(false);

                            instance.boundProperty = 'indeterminate';
                            fixture.detectChanges();
                            tick();
                            expect(nativeInput.indeterminate).toBe(true);

                            instance.boundProperty = true;
                            fixture.detectChanges();
                            tick();
                            expect(nativeInput.checked).toBe(true);
                            expect(nativeInput.indeterminate).toBe(false);
                        });
                })
            ));

        it('should update a bound property with NgModel (outbound)',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.overrideTemplate(TestComponent, `
                    <gtx-checkbox
                        [(ngModel)]="boundProperty"
                        value="someValue"
                    ></gtx-checkbox>
                `)
                        .createAsync(TestComponent)
                        .then((fixture: ComponentFixture<TestComponent>) => {
                            const instance: TestComponent = fixture.componentInstance;
                            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                            const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                            instance.boundProperty = false;
                            fixture.detectChanges();

                            expect(instance.boundProperty).toBe(false);
                            expect(nativeInput.checked).toBe(false);
                            expect(nativeInput.indeterminate).toBe(false);

                            nativeInput.checked = true;
                            debugInput.triggerEventHandler('change', null);
                            fixture.detectChanges();
                            tick();
                            expect(instance.boundProperty).toBe(true);
                            expect(nativeInput.checked).toBe(true);
                            expect(nativeInput.indeterminate).toBe(false);

                            nativeInput.indeterminate = true;
                            debugInput.triggerEventHandler('change', null);
                            fixture.detectChanges();
                            tick();
                            expect(instance.boundProperty).toBe('indeterminate');
                            expect(nativeInput.indeterminate).toBe(true);
                        });
                })
            ));

        it('should bind the value with NgControl (inbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-checkbox ngControl="testControl">
                        </gtx-checkbox>
                    </form>
                `)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const control: Control = <Control> instance.testForm.find('testControl');

                        control.updateValue(false);
                        fixture.detectChanges();
                        tick();

                        expect(nativeInput.checked).toBe(false);
                        expect(nativeInput.indeterminate).toBe(false);

                        control.updateValue(true);
                        fixture.detectChanges();
                        tick();
                        expect(nativeInput.checked).toBe(true);
                        expect(nativeInput.indeterminate).toBe(false);

                        control.updateValue('indeterminate');
                        fixture.detectChanges();
                        tick();
                        expect(nativeInput.indeterminate).toBe(true);

                        control.updateValue(false);
                        fixture.detectChanges();
                        tick();
                        expect(nativeInput.checked).toBe(false);
                        expect(nativeInput.indeterminate).toBe(false);
                    });
            })
        ));

        it('should bind the value with NgControl (outbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-checkbox
                            ngControl="testControl"
                            value="targetValue">
                        </gtx-checkbox>
                    </form>
                `)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        fixture.detectChanges();

                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                        const control: Control = <Control> instance.testForm.find('testControl');

                        nativeInput.checked = true;
                        debugInput.triggerEventHandler('change', null);
                        fixture.detectChanges();
                        tick();
                        expect(control.value).toBe(true);

                        nativeInput.indeterminate = true;
                        debugInput.triggerEventHandler('change', null);
                        fixture.detectChanges();
                        tick();
                        expect(control.value).toBe('indeterminate');

                        nativeInput.checked = false;
                        nativeInput.indeterminate = false;
                        debugInput.triggerEventHandler('change', null);
                        fixture.detectChanges();
                        tick();
                        expect(control.value).toBe(false);
                    });
            })
        ));

    });

    describe('stateless mode:', () => {

        function getCheckbox(fixture: ComponentFixture<TestComponent>): Checkbox {
            return fixture.debugElement.query(By.css('gtx-checkbox')).componentInstance;
        }

        it('stateless mode should be disabled by default',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const checkboxComponent: Checkbox = getCheckbox(fixture);
                        fixture.detectChanges();

                        expect(checkboxComponent['statelessMode']).toBe(false);
                    });
            })));

        it('stateless mode should be enabled when using "checked" attribute',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-checkbox checked="true"></gtx-checkbox>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const checkboxComponent: Checkbox = getCheckbox(fixture);
                        fixture.detectChanges();

                        expect(checkboxComponent['statelessMode']).toBe(true);
                    });
            })));

        it('should not change check state on click when bound to "checked" attribute',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                        <gtx-checkbox checked="true"></gtx-checkbox>
                    `)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const checkboxComponent: Checkbox = getCheckbox(fixture);
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        fixture.detectChanges();

                        expect(checkboxComponent.checked).toBe(true);
                        expect(nativeInput.checked).toBe(true);

                        nativeInput.click();
                        tick();
                        fixture.detectChanges();

                        expect(checkboxComponent.checked).toBe(true);
                        expect(nativeInput.checked).toBe(true);
                    });
            })));

        it('should change check state when "checked" attribute binding changes',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                        <gtx-checkbox [checked]="checkState"></gtx-checkbox>
                    `)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const instance: TestComponent = fixture.componentInstance;
                        const checkboxComponent: Checkbox = getCheckbox(fixture);
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        fixture.detectChanges();

                        expect(checkboxComponent.checked).toBe(false);
                        expect(nativeInput.checked).toBe(false);

                        instance.checkState = true;
                        fixture.detectChanges();

                        expect(checkboxComponent.checked).toBe(true);
                        expect(nativeInput.checked).toBe(true);
                    });
            }));

    });
});

@Component({
    template: `<gtx-checkbox></gtx-checkbox>`,
    directives: [Checkbox]
})
class TestComponent {

    boundProperty: any;
    checkState: boolean = false;
    testIndeterminate: boolean = false;
    testForm: ControlGroup;

    constructor() {
        this.testForm = new ControlGroup({
            testControl: new Control(true)
        });
    }

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
