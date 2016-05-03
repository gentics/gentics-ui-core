import {Component} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {describe, expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {InputField} from './input.component';

describe('InputField', () => {

    it('should bind the label', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-input label="testLabel"></gtx-input>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            });
    }));

    it('should not add the "active" class to label if input is empty', inject([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input label="testLabel"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let label: HTMLElement = fixture.nativeElement.querySelector('label');
                    fixture.detectChanges();

                    expect(label.classList.contains('active')).toBe(false);
                });
        }));

    it('should add the "active" class to label if input not empty', inject([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input label="testLabel" value="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let label: HTMLElement = fixture.nativeElement.querySelector('label');
                    fixture.detectChanges();

                    expect(label.classList.contains('active')).toBe(true);
                });
        }));

    it('should add the "active" class to label if placeholder is set', inject([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input label="testLabel" placeholder="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let label: HTMLElement = fixture.nativeElement.querySelector('label');
                    fixture.detectChanges();

                    expect(label.classList.contains('active')).toBe(true);
                });
        }));

    it('should bind the id to the label and input', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-input label="testLabel" id="testId"></gtx-input>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(nativeInput.id).toBe('testId');
            });
    }));

    it('should use defaults for undefined attributes which have a default', inject([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(nativeInput.disabled).toBe(false);
                    expect(nativeInput.readOnly).toBe(false);
                    expect(nativeInput.required).toBe(false);
                    expect(nativeInput.type).toBe('text');
                    expect(nativeInput.value).toBe('');
                });
        }));

    it('should not display undefined attributes', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-input></gtx-input>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
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
            });
    }));

    it('should pass through the native attributes', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-input
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
            .then((fixture: ComponentFixture) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(parseInt(nativeInput.max, 10)).toBe(100);
                expect(parseInt(nativeInput.min, 10)).toBe(5);
                expect(nativeInput.maxLength).toBe(25);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.pattern).toBe('testRegex');
                expect(nativeInput.placeholder).toBe('testPlaceholder');
                expect(nativeInput.readOnly).toBe(true);
                expect(nativeInput.required).toBe(true);
                expect(parseInt(nativeInput.step, 10)).toBe(5);
                expect(nativeInput.type).toBe('text');
                expect(nativeInput.value).toBe('testValue');
            });
    }));

    it('should bind a string value', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input [value]="value"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(nativeInput.value).toEqual('testValue');
                });
        })));

    it('should bind a number value', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input type="number" [value]="numberVal"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(nativeInput.value).toEqual('42');
                });
        })));

    it('should emit "blur" when native input blurs, with current value', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input (blur)="onBlur($event)" value="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onBlur');

                    triggerEvent(nativeInput, 'blur');
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit "focus" when native input is focused, with current value', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input (focus)="onFocus($event)" value="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onFocus');

                    triggerEvent(nativeInput, 'focus');
                    tick();

                    expect(instance.onFocus).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit "change" when native input value is changed (string)', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input (change)="onChange($event)" value="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onChange');

                    triggerEvent(nativeInput, 'input');
                    tick();

                    expect(instance.onChange).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit "change" when native input value is changed (number)', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent,
                `<gtx-input (change)="onChange($event)" type="number" [value]="numberVal"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onChange');

                    triggerEvent(nativeInput, 'input');
                    tick();

                    expect(instance.onChange).toHaveBeenCalledWith(42);
                });
        })));

    it('should emit "change" when native input is blurred', inject([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-input (change)="onChange($event)" value="foo"></gtx-input>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onChange');

                    triggerEvent(nativeInput, 'blur');
                    tick();

                    expect(instance.onChange).toHaveBeenCalledWith('foo');
                    expect(instance.onChange.calls.count()).toBe(1);
                });
        })));

    describe('ValueAccessor:', () => {

        it('should bind the value with NgModel (inbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-input [(ngModel)]="value"></gtx-input>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        expect(nativeInput.value).toBe('testValue');
                    });
            })));

        it('should bind the value with NgModel (outbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<gtx-input [(ngModel)]="value"></gtx-input>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let instance: TestComponent = fixture.componentInstance;
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        nativeInput.value = 'bar';
                        triggerEvent(nativeInput, 'input');
                        tick();

                        expect(instance.value).toBe('bar');
                    });
            })));

        it('should bind the value with NgControl (inbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<form [ngFormModel]="testForm">
                                                                <gtx-input ngControl="test"></gtx-input>
                                                            </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        expect(nativeInput.value).toBe('controlValue');
                    });
            })));

        it('should bind the value with NgControl (outbound)', inject([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestComponent, `<form [ngFormModel]="testForm">
                                                            <gtx-input ngControl="test"></gtx-input>
                                                        </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let instance: TestComponent = fixture.componentInstance;
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        nativeInput.value = 'bar';
                        triggerEvent(nativeInput, 'input');
                        tick();

                        expect(instance.testForm.controls['test'].value).toBe('bar');
                    });
            })));

    });
});


@Component({
    template: `<gtx-input></gtx-input>`,
    directives: [InputField]
})
class TestComponent {

    value: string = 'testValue';
    numberVal: number = 42;
    testForm: ControlGroup;

    constructor() {
        this.testForm = new ControlGroup({
            test: new Control('controlValue')
        });
    }

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
