import {Component, DebugElement} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {By} from '@angular/platform-browser';
import {describe, expect, fakeAsync, injectAsync, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Range} from './range.component';

describe('Range:', () => {

    it('should use defaults for undefined attributes which have a default', injectAsync([TestComponentBuilder],
        (tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-range></gtx-range>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    fixture.detectChanges();

                    expect(nativeInput.disabled).toBe(false);
                    expect(nativeInput.readOnly).toBe(false);
                    expect(nativeInput.required).toBe(false);
                    expect(nativeInput.value).toBe('50');
                });
        }));

    it('should not display undefined attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-range></gtx-range>`)
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

    it('should pass through the native attributes', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-range
                       disabled="true"
                       max="100"
                       min="5"
                       name="testName"
                       readonly="true"
                       required="true"
                       step="5"
                       value="35"
                   ></gtx-range>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
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
            });
    }));

    it('should emit "blur" when native input blurs, with current value', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-range (blur)="onBlur($event)" [value]="value"></gtx-range>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onBlur');

                    inputDel.triggerEventHandler('blur', null);
                    tick();

                    expect(instance.onBlur).toHaveBeenCalledWith(75);
                });
        })));

    it('should emit "focus" when native input is focused, with current value', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-range (focus)="onFocus($event)" [value]="value"></gtx-range>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onFocus');

                    inputDel.triggerEventHandler('focus', null);
                    tick();

                    expect(instance.onFocus).toHaveBeenCalledWith(75);
                });
        })));

    it('should emit "change" when native input value is changed', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-range (change)="onChange($event)" value="25"></gtx-range>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onChange');

                    triggerInputEvent(nativeInput);
                    tick();

                    expect(instance.onChange).toHaveBeenCalledWith(25);
                });
        })));

    it('should emit "change" when native input is blurred', injectAsync([TestComponentBuilder],
        fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.overrideTemplate(TestComponent, `<gtx-range (change)="onChange($event)" value="25"></gtx-range>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                    let instance: TestComponent = fixture.componentInstance;
                    fixture.detectChanges();
                    spyOn(instance, 'onChange');

                    inputDel.triggerEventHandler('blur', null);
                    tick();

                    expect(instance.onChange).toHaveBeenCalledWith(25);
                });
        })));

    describe('ValueAccessor:', () => {

        it('should bind the value with NgModel (inbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-range [(ngModel)]="value"></gtx-range>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        expect(nativeInput.value).toBe('75');
                    });
            })));

        it('should bind the value with NgModel (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-range [(ngModel)]="value"></gtx-range>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let instance: TestComponent = fixture.componentInstance;
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        nativeInput.value = '30';
                        triggerInputEvent(nativeInput);
                        tick();

                        expect(instance.value).toBe(30);
                    });
            })));

        it('should bind the value with NgControl (inbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<form [ngFormModel]="testForm">
                                                                <gtx-range ngControl="test"></gtx-range>
                                                            </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                        expect(nativeInput.value).toBe('75');
                    });
            })));

        it('should bind the value with NgControl (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<form [ngFormModel]="testForm">
                                                            <gtx-range ngControl="test"></gtx-range>
                                                        </form>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let instance: TestComponent = fixture.componentInstance;
                        let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        nativeInput.value = '30';
                        triggerInputEvent(nativeInput);
                        tick();

                        expect(instance.testForm.controls['test'].value).toBe(30);
                    });
            })));

    });
});

@Component({
    template: `<gtx-range></gtx-range>`,
    directives: [Range]
})
class TestComponent {

    value: number = 75;
    testForm: ControlGroup;

    constructor() {
        this.testForm = new ControlGroup({
            test: new Control(75)
        });
    }

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
