import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {componentTest} from '../../testing';
import {InputField} from './input.component';
import {AutofocusDirective} from '../../directives/autofocus/autofocus.directive';


describe('InputField', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [AutofocusDirective, InputField, TestComponent]
    }));

    it('binds the label text to the "label" input',
        componentTest(() => TestComponent, `
            <gtx-input label="testLabel"></gtx-input>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('does not add the "active" class to its label if the input is empty',
        componentTest(() => TestComponent, `
            <gtx-input label="testLabel"></gtx-input>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).not.toContain('active');
            }
        )
    );

    it('adds the "active" class to its label if the input is not empty',
        componentTest(() => TestComponent, `
            <gtx-input label="testLabel" value="foo"></gtx-input>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).toContain('active');
            }
        )
    );

    it('adds the "active" class to its label if a placeholder is set',
        componentTest(() => TestComponent, `
            <gtx-input label="testLabel" placeholder="foo"></gtx-input>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.classList).toContain('active');
            }
        )
    );

    it('binds the "id" input to the labels "for" and the inputs "id" attributes',
        componentTest(() => TestComponent, `
            <gtx-input label="testLabel" id="testId"></gtx-input>`,
            fixture => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            }
        )
    );

    it('uses defaults for undefined attributes which have a default',
        componentTest(() => TestComponent, fixture => {
            let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            fixture.detectChanges();

            expect(nativeInput.autofocus).toBe(false);
            expect(nativeInput.disabled).toBe(false);
            expect(nativeInput.readOnly).toBe(false);
            expect(nativeInput.required).toBe(false);
            expect(nativeInput.type).toBe('text');
            expect(nativeInput.value).toBe('');
        })
    );

    it('does not add attributes which are not defined',
        componentTest(() => TestComponent, fixture => {
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
    );

    it('passes native attributes to its input element',
        componentTest(() => TestComponent, `
            <gtx-input
                autofocus="true"
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
            ></gtx-input>`,
            fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.autofocus).toBe(true);
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

                tick(50);
            }
        )
    );

    it('binds a string value to its input',
        componentTest(() => TestComponent, `
            <gtx-input [value]="value"></gtx-input>`,
            fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.value).toEqual('testValue');
            }
        )
    );

    it('binds a number value to its type="number" input',
        componentTest(() => TestComponent, `
            <gtx-input type="number" [value]="numberVal"></gtx-input>`,
            fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.value).toEqual('42');
            }
        )
    );

    it('emits "blur" with the current value when the native input blurs',
        componentTest(() => TestComponent, `
            <gtx-input (blur)="onBlur($event)" value="foo"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onBlur = jasmine.createSpy('onBlur');

                triggerEvent(nativeInput, 'blur');
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith('foo');
            }
        )
    );

    it('emits "focus" with the current value when the native input is focused',
        componentTest(() => TestComponent, `
            <gtx-input (focus)="onFocus($event)" value="foo"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onFocus = jasmine.createSpy('onFocus');

                triggerEvent(nativeInput, 'focus');
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith('foo');
            }
        )
    );

    it('emits "focus" with the current value when the native input is focused after the initial value has been changed',
        componentTest(() => TestComponent, `
            <gtx-input (focus)="onFocus($event)" value="foo"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onFocus = jasmine.createSpy('onFocus');
                nativeInput.value += ' changed';

                triggerEvent(nativeInput, 'focus');
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith('foo changed');
            }
        )
    );

    it('emits "change" when the native input value is changed (string)',
        componentTest(() => TestComponent, `
            <gtx-input (change)="onChange($event)" value="foo"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onChange = jasmine.createSpy('onChange');

                triggerEvent(nativeInput, 'input');
                tick();

                expect(instance.onChange).toHaveBeenCalledWith('foo');
            }
        )
    );

    it('emit "change" when the native input value is changed (number)',
        componentTest(() => TestComponent, `
            <gtx-input (change)="onChange($event)" type="number" [value]="numberVal"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onChange = jasmine.createSpy('onChange');

                triggerEvent(nativeInput, 'input');
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(42);
            }
        )
    );

    it('does not emit "change" when the native input is blurred',
        componentTest(() => TestComponent, `
            <gtx-input (change)="onChange($event)" value="foo"></gtx-input>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onChange = jasmine.createSpy('onChange');

                triggerEvent(nativeInput, 'blur');
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('can bind the value with ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-input [(ngModel)]="value"></gtx-input>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('testValue');
                }
            )
        );

        it('starts with the value specified by ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-input [(ngModel)]="value"></gtx-input>`,
                (fixture, instance) => {
                    instance.value = 'initial value';
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('initial value');
                }
            )
        );

        it('can bind the value with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-input [(ngModel)]="value"></gtx-input>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = 'bar';
                    triggerEvent(nativeInput, 'input');

                    expect(instance.value).toBe('bar');
                }
            )
        );

        it('can bind the value with formControlName (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input [formControlName]="'test'"></gtx-input>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('controlValue');
                }
            )
        );

        it('can bind the value with formControlName (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input formControlName="test"></gtx-input>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = 'bar';
                    triggerEvent(nativeInput, 'input');
                    tick();

                    expect(instance.testForm.controls['test'].value).toBe('bar');
                }
            )
        );

        it('marks the component as "touched" when the native input blurs',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input formControlName="test"></gtx-input>
                </form>`,
                (fixture, instance) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].touched).toBe(false);
                    expect(instance.testForm.controls['test'].untouched).toBe(true);

                    triggerEvent(nativeInput, 'focus');
                    triggerEvent(nativeInput, 'blur');
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].touched).toBe(true);
                    expect(instance.testForm.controls['test'].untouched).toBe(false);
                }
            )
        );

        it('does not change the user selection when typing',
            componentTest(() => TestComponent, `
                <gtx-input [(ngModel)]="value"></gtx-input>`,
                (fixture, instance) => {
                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    instance.value = 'foo';
                    fixture.detectChanges();
                    tick();
                    expect(nativeInput.value).toBe('foo');

                    // Set cursor to f|oo
                    nativeInput.setSelectionRange(1, 1);

                    // Type 'x' => fx|oo
                    nativeInput.value = 'fxoo';
                    nativeInput.setSelectionRange(2, 2);
                    triggerEvent(nativeInput, 'input');
                    fixture.detectChanges();
                    tick();

                    // Cursor should still be at fx|oo
                    expect(nativeInput.value).toBe('fxoo');
                    expect(instance.value).toBe('fxoo');
                    expect([nativeInput.selectionStart, nativeInput.selectionEnd]).toEqual([2, 2]);
                }
            )
        );

        it('correctly marks the Input as untouched/touched',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input formControlName="test"></gtx-input>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    expect(instance.testForm.get('test').touched).toBe(false);
                    expect(instance.testForm.get('test').untouched).toBe(true);

                    const input = fixture.debugElement.query(By.css('input'));
                    input.triggerEventHandler('focus', { target: input.nativeElement });

                    expect(instance.testForm.get('test').touched).toBe(false);
                    expect(instance.testForm.get('test').untouched).toBe(true);

                    input.triggerEventHandler('blur', {
                        stopPropagation(): void {},
                        target: input.nativeElement
                    });

                    expect(instance.testForm.get('test').touched).toBe(true);
                    expect(instance.testForm.get('test').untouched).toBe(false);
                }
            )
        );

        it('correctly marks the Input as pristine/dirty',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input formControlName="test"></gtx-input>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    expect(instance.testForm.get('test').dirty).toBe(false);
                    expect(instance.testForm.get('test').pristine).toBe(true);

                    const input = fixture.debugElement.query(By.css('input'));
                    (input.nativeElement as HTMLInputElement).value = 'some different value';
                    input.triggerEventHandler('input', { target: input.nativeElement });

                    expect(instance.testForm.get('test').dirty).toBe(true);
                    expect(instance.testForm.get('test').pristine).toBe(false);
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-input formControlName="test"></gtx-input>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(input.disabled).toBe(false);

                    instance.testForm.get('test').disable();
                    fixture.detectChanges();
                    expect(input.disabled).toBe(true);
                }
            )
        );

        it('works when binding to a Subject',
            componentTest(() => TestComponent, `
                <gtx-input
                    [ngModel]="subject | async"
                    (ngModelChange)="subject.next($event)">
                </gtx-input>`,
                (fixture, testInstance) => {
                    testInstance.subject.next('A');
                    fixture.detectChanges();
                    tick();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value).toBe('A');

                    input.value = 'B';
                    const event = document.createEvent('Event');
                    event.initEvent('input', true, true);
                    input.dispatchEvent(event);

                    tick();

                    expect(testInstance.subject.value).toBe('B');
                }
            )
        );

    });
});


@Component({
    template: `<gtx-input></gtx-input>`
})
class TestComponent {

    value: string = 'testValue';
    numberVal: number = 42;
    subject = new BehaviorSubject('testValue');
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
