import {Component, DebugElement, ViewChild} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {RadioButton, RadioGroup} from './radio-button.component';


describe('RadioButton', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [RadioButton, RadioGroup, TestComponent]
    }));

    it('binds the label text to the "label" input',
        componentTest(() => TestComponent, `
            <gtx-radio-button label="testLabel"></gtx-radio-button>`,
            fixture => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('binds the id input to the labels "for" and the inputs "id" attributes',
        componentTest(() => TestComponent, `
            <gtx-radio-button
                label="testLabel"
                id="testId"
            ></gtx-radio-button>`,
            fixture => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(label.getAttribute('for')).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            }
        )
    );

    it('uses defaults for undefined attributes which have a default',
        componentTest(() => TestComponent, fixture => {
            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            fixture.detectChanges();

            expect(nativeInput.checked).toBe(false);
            expect(nativeInput.disabled).toBe(false);
            expect(nativeInput.required).toBe(false);
            expect(nativeInput.value).toBe('');
        })
    );

    it('does not add attributes which are not defined',
        componentTest(() => TestComponent, fixture => {
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
    );


    it('prefills a unique "id" if none is passed in',
        componentTest(() => TestComponent, fixture => {
            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            const getAttr: Function = (name: string) => nativeInput.attributes.getNamedItem(name);
            fixture.detectChanges();

            const id: Attr = nativeInput.attributes.getNamedItem('id');
            expect(id).not.toBe(null);
            expect(id.value.length).toBeGreaterThan(0);
        })
    );

    it('passes the native attributes to its input element',
        componentTest(() => TestComponent, `
            <gtx-radio-button
                disabled="true"
                checked="true"
                name="testName"
                required="true"
                value="testValue"
            ></gtx-radio-button>`,
            fixture => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(nativeInput.checked).toBe(true);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.required).toBe(true);
                expect(nativeInput.value).toBe('testValue');
            }
        )
    );

    it('emits a single "change" with the current value when the native input changes',
        componentTest(() => TestComponent, `
            <gtx-radio-button value="foo"
                (change)="onChange($event)">
            </gtx-radio-button>`,
            (fixture, instance) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                const onChange = instance.onChange = jasmine.createSpy('onChange');

                nativeInput.click();
                tick();
                fixture.detectChanges();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
                expect(onChange).toHaveBeenCalledTimes(1);
            }
        )
    );

    it('emits "blur" with the current check state when the native input blurs',
        componentTest(() => TestComponent, `
            <gtx-radio-button
                (blur)="onBlur($event)"
                value="foo"
                [checked]="true"
            ></gtx-radio-button>`,
            (fixture, instance) => {
                const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onBlur = jasmine.createSpy('onBlur');

                debugInput.triggerEventHandler('blur', null);
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith(true);
            }
        )
    );

    it('emits "focus" with the current check state when the native input is focused',
        componentTest(() => TestComponent, `
            <gtx-radio-button
                (focus)="onFocus($event)"
                value="foo"
            ></gtx-radio-button>`,
            (fixture, instance) => {
                const debugInput: DebugElement = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onFocus = jasmine.createSpy('onFocus');

                debugInput.triggerEventHandler('focus', null);
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith(false);
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('changes a variable bound with ngModel when selected',
            componentTest(() => TestComponent, `
                <gtx-radio-button
                    [(ngModel)]="boundProperty"
                    value="foo"
                    [checked]="checkState"
                ></gtx-radio-button>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
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
                }
            )
        );

        it('updates the check state when a variable bound with ngModel changes (inbound)',
            componentTest(() => TestComponent, `
                <gtx-radio-button
                    [(ngModel)]="boundProperty"
                    value="otherValue">
                </gtx-radio-button>`,
                (fixture, instance) => {
                    fixture.detectChanges();
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
                }
            )
        );

        it('updates a variable bound with ngModel when the check state changes (outbound)',
            componentTest(() => TestComponent, `
                <gtx-radio-button
                    [(ngModel)]="boundProperty"
                    [checked]="checkState"
                    value="otherValue"
                ></gtx-radio-button>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
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
                }
            )
        );

        it('can bind multiple radioButtons on one ngModel and update them all (inbound)',
            componentTest(() => TestComponent, `
                <gtx-radio-button
                    [(ngModel)]="boundObjectProperty"
                    [value]="objectValues[0]">
                </gtx-radio-button>
                <gtx-radio-button
                    [(ngModel)]="boundObjectProperty"
                    [value]="objectValues[1]">
                </gtx-radio-button>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
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
                }
            )
        );

        it('updates a variable bound to multiple radioButtons via ngModel and the other radioButtons (outbound)',
            componentTest(() => TestComponent, `
                <gtx-radio-button
                    [(ngModel)]="boundObjectProperty"
                    [value]="objectValues[0]">
                </gtx-radio-button>
                <gtx-radio-button
                    [(ngModel)]="boundObjectProperty"
                    [value]="objectValues[1]">
                </gtx-radio-button>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
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
                }
            )
        );

        it('can bind the check state with formControlName (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-radio-button formControlName="testControl" value="radioValue">
                    </gtx-radio-button>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const control: FormControl = <FormControl> instance.testForm.get('testControl');

                    expect(nativeInput.checked).toBe(false);

                    control.setValue('radioValue');
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(true);
                }
            )
        );

        it('can bind the value with formControlName (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-radio-button
                        [checked]="checkState"
                        formControlName="testControl"
                        value="targetValue">
                    </gtx-radio-button>
                </form>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const control: FormControl = <FormControl> instance.testForm.get('testControl');

                    instance.checkState = false;
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(false);

                    instance.checkState = true;
                    fixture.detectChanges();
                    tick();

                    expect(nativeInput.checked).toBe(true);
                    expect(control.value).toBe('targetValue');
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-radio-button formControlName="testControl"></gtx-radio-button>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(input.disabled).toBe(false);

                    instance.testForm.get('testControl').disable();
                    fixture.detectChanges();
                    expect(input.disabled).toBe(true);
                }
            )
        );

    });

    describe('stateless mode:', () => {

        it('stateless mode is disabled by default',
            componentTest(() => TestComponent, (fixture, instance) => {
                const radioButtonComponent: any = instance.radioButtonComponent;
                fixture.detectChanges();

                // TODO: Testing private properties is bad - is there a better way?
                expect(radioButtonComponent.statelessMode).toBe(false);
            })
        );

        it('stateless mode should be enabled when using "checked" attribute',
            componentTest(() => TestComponent, `
                <gtx-radio-button checked="true"></gtx-radio-button>`,
                (fixture, instance) => {
                    const radioButtonComponent: any = instance.radioButtonComponent;
                    fixture.detectChanges();

                    // TODO: Testing private properties is bad - is there a better way?
                    expect(radioButtonComponent.statelessMode).toBe(true);
                }
            )
        );

        it('does not change check state on click when the "checked" attribute is bound',
            componentTest(() => TestComponent, `
                <gtx-radio-button checked="false"></gtx-radio-button>`,
                (fixture, instance) => {
                    const radioButtonComponent = instance.radioButtonComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);

                    nativeInput.click();
                    tick();
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);
                }
            )
        );

        it('changes the check state when the "checked" binding changes',
            componentTest(() => TestComponent, `
                <gtx-radio-button [checked]="checkState"></gtx-radio-button>`,
                (fixture, instance) => {
                    const radioButtonComponent = fixture.componentInstance.radioButtonComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);

                    instance.checkState = true;
                    fixture.detectChanges();

                    expect(radioButtonComponent.checked).toBe(true);
                    expect(nativeInput.checked).toBe(true);
                }
            )
        );

    });
});

describe('RadioGroup', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [RadioButton, RadioGroup, TestComponent]
    }));

    it('binds the check state of RadioButton children with ngModel (inbound)',
        componentTest(() => TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`,
            (fixture, instance) => {
                fixture.detectChanges();

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
            }
        )
    );

    it('unchecks all RadioButton children when none of their values matches the bound ngModel (inbound)',
        componentTest(() => TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`,
            (fixture, instance) => {
                fixture.detectChanges();
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
            }
        )
    );

    it('updates an ngModel bound property when RadioButton children are checked (outbound)',
        componentTest(() => TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`,
            (fixture, instance) => {
                fixture.detectChanges();
                tick();
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
            }
        )
    );

    it('sets a property bound with ngModel to null when no RadioButton children are checked (outbound)',
        componentTest(() => TestComponent, `
            <gtx-radio-group [(ngModel)]="boundProperty">
                <gtx-radio-button value="A" [checked]="checkState"></gtx-radio-button>
                <gtx-radio-button value="B"></gtx-radio-button>
            </gtx-radio-group>`,
            (fixture, instance) => {
                fixture.detectChanges();
                instance.checkState = true;

                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                tick();
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

            }
        )
    );

    it('can bind the check state of RadioButton children with formControlName (inbound)',
        componentTest(() => TestComponent, `
            <form [formGroup]="testForm">
                <gtx-radio-group formControlName="testControl">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            </form>`,
            (fixture, instance) => {
                fixture.detectChanges();

                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: FormControl = <FormControl> instance.testForm.get('testControl');

                control.setValue('A');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                control.setValue('B');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            }
        )
    );

    it('can bind the check state of RadioButton children with formControlName (outbound)',
        componentTest(() => TestComponent, `
            <form [formGroup]="testForm">
                <gtx-radio-group formControlName="testControl">
                    <gtx-radio-button value="A"></gtx-radio-button>
                    <gtx-radio-button value="B"></gtx-radio-button>
                </gtx-radio-group>
            </form>`,
            (fixture, instance) => {
                fixture.detectChanges();

                const nativeInputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
                const control: FormControl = <FormControl> instance.testForm.get('testControl');

                control.setValue('A');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(true);
                expect(nativeInputs[1].checked).toBe(false);

                control.setValue('B');
                fixture.detectChanges();
                tick();
                expect(nativeInputs[0].checked).toBe(false);
                expect(nativeInputs[1].checked).toBe(true);
            }
        )
    );

});

@Component({
    template: `<gtx-radio-button></gtx-radio-button>`
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

    @ViewChild(RadioButton, { static: true }) radioButtonComponent: RadioButton;

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
