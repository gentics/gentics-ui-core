import {Component, ViewChild} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {Checkbox} from './checkbox.component';


describe('Checkbox', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [TestComponent, Checkbox]
    }));

    it('should bind the label',
        componentTest(() => TestComponent, `
            <gtx-checkbox label="testLabel"></gtx-checkbox>`,
            fixture => {
                const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('should bind the id to the label and input',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                label="testLabel"
                id="testId"
            ></gtx-checkbox>`,
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

    it('should use defaults for undefined attributes which have a default',
        componentTest(() => TestComponent, fixture => {
            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            fixture.detectChanges();

            expect(nativeInput.checked).toBe(false);
            expect(nativeInput.disabled).toBe(false);
            expect(nativeInput.required).toBe(false);
            expect(nativeInput.value).toBe('');
        })
    );

    it('should not display undefined attributes',
        componentTest(() => TestComponent, fixture => {
            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            const getAttr = (name: string) => nativeInput.attributes.getNamedItem(name);
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


    it('should prefill a unique "id" if none is passed in',
        componentTest(() => TestComponent, fixture => {
            const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            const getAttr = (name: string) => nativeInput.attributes.getNamedItem(name);
            fixture.detectChanges();

            const id: Attr = nativeInput.attributes.getNamedItem('id');
            expect(id).not.toBe(null);
            expect(id.value.length).toBeGreaterThan(0);
        })
    );

    it('should pass through the native attributes',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                disabled="true"
                [checked]="true"
                name="testName"
                required="true"
                value="testValue"
            ></gtx-checkbox>`,
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

    it('should emit a single "change" with current check state when the native input changes',
        componentTest(() => TestComponent, `
            <gtx-checkbox (change)="onChange($event)">
            </gtx-checkbox>`,
            fixture => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                const spy = instance.onChange = jasmine.createSpy('onChange');

                nativeInput.click();
                tick();
                fixture.detectChanges();

                expect(instance.onChange).toHaveBeenCalledWith(true);
                expect(spy.calls.count()).toBe(1);
            }
        )
    );

    it('should emit "blur" with current check state when the native input blurs',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                (blur)="onBlur($event)"
                value="foo"
                [checked]="true"
            ></gtx-checkbox>`,
            (fixture, instance) => {
                const debugInput = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onBlur = jasmine.createSpy('onBlur');

                debugInput.triggerEventHandler('blur', null);
                fixture.detectChanges();
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith(true);
            }
        )
    );

    it('should emit "blur" with "indeterminate" when indeterminate and native input is blurred',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                (blur)="onBlur($event)"
                value="foo"
                [indeterminate]="true"
            ></gtx-checkbox>`,
            fixture => {
                const debugInput = fixture.debugElement.query(By.css('input'));
                const instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                instance.onBlur = jasmine.createSpy('onBlur');

                debugInput.triggerEventHandler('blur', null);
                fixture.detectChanges();
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith('indeterminate');
            }
        )
    );

    it('should emit "focus" with current check state when the native input is focused',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                (focus)="onFocus($event)"
                value="foo"
                [checked]="true"
            ></gtx-checkbox>`,
            (fixture, instance) => {
                const debugInput = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onFocus = jasmine.createSpy('onFocus');

                debugInput.triggerEventHandler('focus', null);
                fixture.detectChanges();
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith(true);
            }
        )
    );

    it('should switch checkbox to readonly mode if readonly property is true',
        componentTest(() => TestComponent, `
            <gtx-checkbox
                value="foo"
                [readonly]="true"
            ></gtx-checkbox>`,
            (fixture, instance) => {
                const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(nativeInput.readOnly).toBe(true);
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('should bind the check state with ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-checkbox
                    [(ngModel)]="boundProperty"
                    value="otherValue">
                </gtx-checkbox>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    instance.boundProperty = false;
                    fixture.detectChanges();

                    expect(nativeInput.checked).toBe(false);
                    expect(nativeInput.indeterminate).toBe(false);

                    instance.boundProperty = 'indeterminate';
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInput.indeterminate).toBe(true);

                    instance.boundProperty = true;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expect(nativeInput.checked).toBe(true);
                    expect(nativeInput.indeterminate).toBe(false);
                }
            )
        );

        it('should update a bound property with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-checkbox
                    [(ngModel)]="boundProperty"
                    value="someValue"
                ></gtx-checkbox>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const debugInput = fixture.debugElement.query(By.css('input'));
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
                }
            )
        );

        it('should bind the value with formControlName (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-checkbox formControlName="testControl">
                    </gtx-checkbox>
                </form>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const control = <FormControl> instance.testForm.get('testControl');

                    control.setValue(false);
                    fixture.detectChanges();
                    tick();

                    expect(nativeInput.checked).toBe(false);
                    expect(nativeInput.indeterminate).toBe(false);

                    control.setValue(true);
                    fixture.detectChanges();
                    tick();
                    expect(nativeInput.checked).toBe(true);
                    expect(nativeInput.indeterminate).toBe(false);

                    control.setValue('indeterminate');
                    fixture.detectChanges();
                    tick();
                    expect(nativeInput.indeterminate).toBe(true);

                    control.setValue(false);
                    fixture.detectChanges();
                    tick();
                    expect(nativeInput.checked).toBe(false);
                    expect(nativeInput.indeterminate).toBe(false);
                }
            )
        );

        it('should bind the value with formControlName (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-checkbox
                        formControlName="testControl"
                        value="targetValue">
                    </gtx-checkbox>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    const debugInput = fixture.debugElement.query(By.css('input'));
                    const control = <FormControl> instance.testForm.get('testControl');

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
                }
            )
        );

    });

    describe('stateless mode:', () => {

        it('stateless mode should be disabled by default',
            componentTest(() => TestComponent, (fixture, instance) => {
                const checkboxComponent: any = instance.checkboxComponent;
                fixture.detectChanges();
                // TODO: Testing private properties is really bad - is there a better way?
                expect(checkboxComponent.statelessMode).toBe(false);
            })
        );

        it('stateless mode should be enabled when using "checked" attribute',
            componentTest(() => TestComponent, `
                <gtx-checkbox checked="true"></gtx-checkbox>`,
                (fixture, instance) => {
                    const checkboxComponent: any = instance.checkboxComponent;
                    fixture.detectChanges();
                    // TODO: Testing private properties is really bad - is there a better way?
                    expect(checkboxComponent.statelessMode).toBe(true);
                }
            )
        );

        it('should not change check state on click when bound to "checked" attribute',
            componentTest(() => TestComponent, `
                <gtx-checkbox checked="true"></gtx-checkbox>`,
                (fixture, component) => {
                    const checkboxComponent = component.checkboxComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(checkboxComponent.checked).toBe(true);
                    expect(nativeInput.checked).toBe(true);

                    nativeInput.click();
                    tick();
                    fixture.detectChanges();

                    expect(checkboxComponent.checked).toBe(true);
                    expect(nativeInput.checked).toBe(true);
                }
            )
        );

        it('should change check state when "checked" attribute binding changes',
            componentTest(() => TestComponent, `
                <gtx-checkbox [checked]="checkState"></gtx-checkbox>`,
                fixture => {
                    const instance: TestComponent = fixture.componentInstance;
                    const checkboxComponent = instance.checkboxComponent;
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(checkboxComponent.checked).toBe(false);
                    expect(nativeInput.checked).toBe(false);

                    instance.checkState = true;
                    fixture.detectChanges();

                    expect(checkboxComponent.checked).toBe(true);
                    expect(nativeInput.checked).toBe(true);
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-checkbox formControlName="testControl"></gtx-checkbox>
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
});

@Component({
    template: `<gtx-checkbox></gtx-checkbox>`
})
class TestComponent {

    readonly: boolean = false;
    boundProperty: any;
    checkState: boolean = false;
    testIndeterminate: boolean = false;
    testForm: FormGroup = new FormGroup({
        testControl: new FormControl(true)
    });
    @ViewChild(Checkbox) checkboxComponent: Checkbox;

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}
