import {Component, DebugElement} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {By} from '@angular/platform-browser';
import {describe, expect, fakeAsync, inject, it, tick, xit} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {RadioButton, RadioGroup} from './radio-button.component';

describe('RadioButton', () => {

    it('should bind the label', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-radio-button label="testLabel"></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                expect(label.innerText).toBe('testLabel');
            });
    }));

    it('should bind the id to the label and input', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `
            <gtx-radio-button
                label="testLabel"
                id="testId"
            ></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(label.getAttribute('for')).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            });
    }));

    it('should use defaults for undefined attributes which have a default',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
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

    it('should not display undefined attributes', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
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
    }));


    it('should prefill a unique "id" if none is passed in', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-radio-button></gtx-radio-button>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
                fixture.detectChanges();

                const id: Attr = nativeInput.attributes.getNamedItem('id');
                expect(id).not.toBe(null);
                expect(id.value.length).toBeGreaterThan(0);
            });
    }));

    it('should pass through the native attributes', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `
            <gtx-radio-button
                disabled="true"
                checked="true"
                name="testName"
                readonly="true"
                required="true"
                value="testValue"
            ></gtx-radio-button>`)
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
    }));

    it('should emit a single "change" with current value when the native input changes',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button value="foo"
                                      (change)="onChange($event)"></gtx-radio-button>`)
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
                });
        }))
    );

    it('should emit "blur" with current check state when the native input blurs', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (blur)="onBlur($event)"
                    value="foo"
                    [checked]="true"
                ></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onBlur');

                    debugInput.triggerEventHandler('blur', null);
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith(true);
                });
        }))
    );

    it('should emit "focus" with current check state when the native input is focused', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-radio-button
                    (focus)="onFocus($event)"
                    value="foo"
                ></gtx-radio-button>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                    const instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onFocus');

                    debugInput.triggerEventHandler('focus', null);
                    tick();

                    expect(instance.onFocus).toHaveBeenCalledWith(false);
                });
        }))
    );

    describe('ValueAccessor:', () => {

        xit('should change a variable bound with ngModel when selected', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="foo"
                        [checked]="checkState"
                    ></gtx-radio-button>`)
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
                    });
            })
        ));

        xit('should bind the check state with NgModel (inbound)',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        value="otherValue">
                    </gtx-radio-button>`)
                        .createAsync(TestComponent)
                        .then((fixture: ComponentFixture<TestComponent>) => {
                            fixture.detectChanges();
                            const instance: TestComponent = fixture.componentInstance;
                            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                            expect(nativeInput.checked).toBe(false);

                            instance.boundProperty = 'otherValue';
                            fixture.detectChanges();
                            tick();
                            expect(nativeInput.checked).toBe(true);

                            instance.boundProperty = undefined;
                            fixture.detectChanges();
                            tick();
                            expect(nativeInput.checked).toBe(false);
                        });
                })
            ));

        xit('should update a bound property with NgModel (outbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundProperty"
                        [checked]="checkState"
                        value="otherValue"
                    ></gtx-radio-button>`)
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
                        expect(instance.checkState).toBe(true);
                        expect(nativeInput.checked).toBe(true);
                        expect(instance.boundProperty).toBe('otherValue');
                    });
            })
        ));

        xit('should update multiple radioButtons bound on one NgModel (inbound)',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>`)
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
                            expect(nativeInputs[0].checked).toBe(true);
                            expect(nativeInputs[1].checked).toBe(false);

                            instance.boundObjectProperty = instance.objectValues[1];
                            fixture.detectChanges();
                            tick();
                            expect(nativeInputs[0].checked).toBe(false);
                            expect(nativeInputs[1].checked).toBe(true);
                        });
                })
            ));

        xit('should update multiple radioButtons bound on one NgModel (outbound)',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                    tcb.overrideTemplate(TestComponent, `
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[0]">
                    </gtx-radio-button>
                    <gtx-radio-button
                        [(ngModel)]="boundObjectProperty"
                        [value]="objectValues[1]">
                    </gtx-radio-button>`)
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
                            expect(nativeInputs[0].checked).toBe(true);
                            expect(nativeInputs[1].checked).toBe(false);
                            expect(instance.boundObjectProperty).toBe(instance.objectValues[0]);

                            nativeInputs[1].click();
                            tick();
                            fixture.detectChanges();
                            tick();
                            expect(nativeInputs[0].checked).toBe(false);
                            expect(nativeInputs[1].checked).toBe(true);
                            expect(instance.boundObjectProperty).toBe(instance.objectValues[1]);
                        });
                })
            ));

        xit('should bind the value with NgControl (inbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-radio-button ngControl="testControl" value="radioValue">
                        </gtx-radio-button>
                    </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        fixture.detectChanges();
                        tick();
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const control: Control = <Control> instance.testForm.find('testControl');

                        expect(nativeInput.checked).toBe(false);

                        control.updateValue('radioValue');
                        fixture.detectChanges();
                        expect(nativeInput.checked).toBe(true);
                    });
            })
        ));

        xit('should bind the value with NgControl (outbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `
                    <form [ngFormModel]="testForm">
                        <gtx-radio-button
                            [checked]="checkState"
                            ngControl="testControl"
                            value="targetValue">
                        </gtx-radio-button>
                    </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const instance: TestComponent = fixture.componentInstance;
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        const control: Control = <Control> instance.testForm.find('testControl');

                        instance.checkState = false;
                        fixture.detectChanges();
                        expect(nativeInput.checked).toBe(false);

                        instance.checkState = true;
                        fixture.detectChanges();
                        tick();

                        expect(nativeInput.checked).toBe(true);
                        expect(control.value).toBe('targetValue');
                    });
            })
        ));

    });

    describe('stateless mode:', () => {

        function getRadioButton(fixture: ComponentFixture<TestComponent>): RadioButton {
            return fixture.debugElement.query(By.css('gtx-radio-button')).componentInstance;
        }

        it('stateless mode should be disabled by default',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const radioButtonComponent: RadioButton = getRadioButton(fixture);
                        fixture.detectChanges();

                        expect(radioButtonComponent['statelessMode']).toBe(false);
                    });
            })));

        it('stateless mode should be enabled when using "checked" attribute',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-radio-button checked="true"></gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const radioButtonComponent: RadioButton = getRadioButton(fixture);
                        fixture.detectChanges();

                        expect(radioButtonComponent['statelessMode']).toBe(true);
                    });
            })));

        it('should not change check state on click when bound to "checked" attribute',
            inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-radio-button checked="false"></gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const radioButtonComponent: RadioButton = getRadioButton(fixture);
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        fixture.detectChanges();

                        expect(radioButtonComponent.checked).toBe(false);
                        expect(nativeInput.checked).toBe(false);

                        nativeInput.click();
                        tick();
                        fixture.detectChanges();

                        expect(radioButtonComponent.checked).toBe(false);
                        expect(nativeInput.checked).toBe(false);
                    });
            })));

        it('should change check state when "checked" attribute binding changes',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-radio-button [checked]="checkState"></gtx-radio-button>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        const instance: TestComponent = fixture.componentInstance;
                        const radioButtonComponent: RadioButton = getRadioButton(fixture);
                        const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        fixture.detectChanges();

                        expect(radioButtonComponent.checked).toBe(false);
                        expect(nativeInput.checked).toBe(false);

                        instance.checkState = true;
                        fixture.detectChanges();

                        expect(radioButtonComponent.checked).toBe(true);
                        expect(nativeInput.checked).toBe(true);
                    });
            }));

    });
});

describe('RadioGroup', () => {

    xit('should bind the check state of RadioButton children with NgModel (inbound)',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.boundProperty = 'A';
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                instance.boundProperty = 'B';
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            });
        }))
    );

    xit('should uncheck all RadioButton children when none of their values match a property bound with NgModel (inbound)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.boundProperty = 'A';
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true, 'checkbox A is not checked');
                expect(nativeInputs[1].checked).toBe(false, 'checkbox B is checked but should not be');

                instance.boundProperty = 'some other value';
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false, 'checkbox A does not get unchecked');
                expect(nativeInputs[1].checked).toBe(false, 'checkbox B is checked when it should not be');
            });
        }))
    );

    xit('should update a NgModel bound property when RadioButton children are checked (outbound)',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`)
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
            });
        }))
    );

    xit('should set a NgModel bound property to null when no RadioButton children are checked (outbound)',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A" [checked]="checkState"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

                instance.checkState = true;
                fixture.detectChanges();
                tick();
                expect(instance.boundProperty).toBe('A');
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                instance.checkState = false;
                fixture.detectChanges();
                tick();
                expect(instance.boundProperty).toBe(null);
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(false);
            });
        }))
    );

    xit('should bind the check state of RadioButton children with NgControl (inbound)',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <form [ngFormModel]="testForm">
                <gtx-radio-group ngControl="testControl">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            </form>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: Control = <Control> instance.testForm.find('testControl');

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
            });
        }))
    );

    it('should bind the check state of RadioButton children with NgControl (outbound)',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
            <form [ngFormModel]="testForm">
                <gtx-radio-group ngControl="testControl">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            </form>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();

                const instance: TestComponent = fixture.componentInstance;
                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: Control = <Control> instance.testForm.find('testControl');

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
            });
        })
    ));

});

@Component({
    template: `<gtx-radio-button></gtx-radio-button>`,
    directives: [RadioButton, RadioGroup]
})
class TestComponent {

    boundProperty: string = 'boundValue';
    checkState: boolean = false;
    testForm: ControlGroup;

    boundObjectProperty: any = undefined;
    objectValues: any[] = [
        { a: 1 },
        { b: 2 }
    ];

    constructor() {
        this.testForm = new ControlGroup({
            testControl: new Control('controlValue')
        });
    }

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
