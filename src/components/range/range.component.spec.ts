import {Component, DebugElement} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {Range} from './range.component';

describe('Range:', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [Range, TestComponent]
    }));

    it('uses defaults for undefined attributes which have a default',
    componentTest(() => TestComponent, fixture => {
            let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
            fixture.detectChanges();

            expect(nativeInput.disabled).toBe(false);
            expect(nativeInput.required).toBe(false);
            expect(nativeInput.value).toBe('50');
        })
    );

    it('does not set attributes which are not defined',
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
            <gtx-range
                disabled="true"
                max="100"
                min="5"
                name="testName"
                required="true"
                step="5"
                value="35"
            ></gtx-range>`,
            fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();

                expect(nativeInput.disabled).toBe(true);
                expect(parseInt(nativeInput.max, 10)).toBe(100);
                expect(parseInt(nativeInput.min, 10)).toBe(5);
                expect(nativeInput.name).toBe('testName');
                expect(nativeInput.required).toBe(true);
                expect(parseInt(nativeInput.step, 10)).toBe(5);
                expect(nativeInput.value).toBe('35');
            }
        )
    );

    it('emits "blur" with the current value when its native input blurs',
        componentTest(() => TestComponent, `
            <gtx-range
                (blur)="onBlur($event)"
                [value]="value">
            </gtx-range>`,
            (fixture, instance) => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onBlur = jasmine.createSpy('onBlur');
                let event = createFocusEvent('blur');
                inputDel.nativeElement.dispatchEvent(event);
                tick();
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith(75);
            }
        )
    );

    it('emits "focus" with the current value when its native input is focused',
        componentTest(() => TestComponent, `
            <gtx-range
                (focus)="onFocus($event)"
                [value]="value">
            </gtx-range>`,
            (fixture, instance) => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onFocus = jasmine.createSpy('onFocus');

                let event = createFocusEvent('focus');
                inputDel.triggerEventHandler('focus', event);
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith(75);
            }
        )
    );

    it('emits "change" when the value of its native input is changed',
        componentTest(() => TestComponent, `
            <gtx-range (change)="onChange($event)" value="25">
            </gtx-range>`,
            (fixture, instance) => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                fixture.detectChanges();
                instance.onChange = jasmine.createSpy('onChange');

                triggerInputEvent(nativeInput);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(25);
            }
        )
    );

    it('emits "change" when its native input is blurred',
        componentTest(() => TestComponent, `
            <gtx-range
                (change)="onChange($event)"
                value="25">
            </gtx-range>`,
            (fixture, instance) => {
                let inputDel: DebugElement = fixture.debugElement.query(By.css('input'));
                fixture.detectChanges();
                instance.onChange = jasmine.createSpy('onChange');

                let event = createFocusEvent('blur');
                inputDel.nativeElement.dispatchEvent(event);
                tick();

                expect(instance.onChange).toHaveBeenCalledWith(25);
            }
        )
    );

    it('displays the thumb element by default',
        componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                let thumbElement: HTMLInputElement = fixture.nativeElement.querySelector('.thumb');

                expect(isHidden(thumbElement)).toBe(false);
            }
        )
    );

    it('hides the thumb element when thumbLabel == false',
        componentTest(() => TestComponent, `
            <gtx-range [thumbLabel]="false"></gtx-range>`,
            fixture => {
                fixture.detectChanges();
                let thumbElement: HTMLInputElement = fixture.nativeElement.querySelector('.thumb');

                expect(isHidden(thumbElement)).toBe(true);
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('can bind its value with ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-range [(ngModel)]="value"></gtx-range>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('75');
                }
            )
        );

        it('can bind its value with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-range [(ngModel)]="value"></gtx-range>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = '30';
                    triggerInputEvent(nativeInput);
                    tick();

                    expect(instance.value).toBe(30);
                }
            )
        );

        it('can bind its value with formControl (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-range formControlName="test"></gtx-range>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('75');
                }
            )
        );

        it('can bind its value with formControl (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-range formControlName="test"></gtx-range>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    nativeInput.value = '30';
                    triggerInputEvent(nativeInput);
                    tick();

                    expect(instance.testForm.controls['test'].value).toBe(30);
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-range formControlName="test"></gtx-range>
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

    });

    describe('DOM Events:', () => {

        function calledWithDomEvent(spy: jasmine.Spy): boolean {
            return spy.calls.all().some(call => call.args[0] instanceof Event);
        }

        it('does not forward the native blur event',
            componentTest(() => TestComponent, `
                <gtx-range (blur)="onBlur($event)"></gtx-range>`,
                (fixture, instance) => {
                    const onBlur = instance.onBlur = jasmine.createSpy('onBlur');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = createFocusEvent('blur');
                    nativeInput.dispatchEvent(event);

                    expect(calledWithDomEvent(onBlur)).toBe(false);
                }
            )
        );

        it('does not forward the native focus event',
            componentTest(() => TestComponent, `
                <gtx-range (focus)="onFocus($event)"></gtx-range>`,
                (fixture, instance) => {
                    const onFocus = instance.onFocus = jasmine.createSpy('onFocus');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = createFocusEvent('focus');
                    nativeInput.dispatchEvent(event);

                    expect(calledWithDomEvent(onFocus)).toBe(false);
                }
            )
        );

        it('does not forward the native change event',
            componentTest(() => TestComponent, `
                <gtx-range (change)="onChange($event)"></gtx-range>`,
                (fixture, instance) => {
                    const onChange = instance.onFocus = jasmine.createSpy('onChange');
                    fixture.detectChanges();

                    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    let event = document.createEvent('Event');
                    event.initEvent('change', true, false);
                    nativeInput.dispatchEvent(event);

                    calledWithDomEvent(onChange);

                    nativeInput.value = '15';
                    event = createFocusEvent('blur');
                    nativeInput.dispatchEvent(event);

                    expect(calledWithDomEvent(onChange)).toBe(false);
                }
            )
        );

    });
});

function isHidden(el: HTMLElement): boolean {
    return el.classList.contains('hidden');
}

/** Firefox has issues with document.createEvent('FocusEvent'). */
function createFocusEvent(type: 'focus' | 'blur'): FocusEvent {
    let event: FocusEvent;
    try {
        event = document.createEvent('FocusEvent');
        event.initFocusEvent(type, true, true, window, 0, null);
    } catch (firefox) {
        event = new FocusEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 0,
            relatedTarget: null
        });
    }

    return event;
}


@Component({
    template: `<gtx-range></gtx-range>`
})
class TestComponent {

    value: number = 75;
    testForm: FormGroup = new FormGroup({
        test: new FormControl(75)
    });

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
