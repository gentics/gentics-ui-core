import {Component} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {Textarea} from './textarea.component';


describe('Textarea', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [Textarea, TestComponent]
    }));

    it('binds the label',
        componentTest(() => TestComponent, `
            <gtx-textarea label="testLabel"></gtx-textarea>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('binds the id to the label and input',
        componentTest(() => TestComponent, `
            <gtx-textarea label="testLabel" id="testId">
            </gtx-textarea>`,
            fixture => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                fixture.detectChanges();
                expect(label.htmlFor).toBe('testId');
                expect(nativeTextarea.id).toBe('testId');
            }
        )
    );

    it('uses defaults for undefined attributes which have a default',
        componentTest(() => TestComponent, `
            <gtx-textarea></gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.disabled).toBe(false);
                expect(nativeTextarea.readOnly).toBe(false);
                expect(nativeTextarea.required).toBe(false);
                expect(nativeTextarea.value).toBe('');
            }
        )
    );

    it('does not set undefined attributes',
        componentTest(() => TestComponent,
            `<gtx-textarea></gtx-textarea>`,
            fixture => {
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
            }
        )
    );

    it('passes native attributes to its textarea element',
        componentTest(() => TestComponent, `
            <gtx-textarea
                disabled="true"
                maxlength="25"
                name="testName"
                placeholder="testPlaceholder"
                readonly="true"
                required="true"
                value="testValue"
            ></gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();
                tick(1000);

                expect(nativeTextarea.disabled).toBe(true);
                expect(nativeTextarea.maxLength).toBe(25);
                expect(nativeTextarea.name).toBe('testName');
                expect(nativeTextarea.placeholder).toBe('testPlaceholder');
                expect(nativeTextarea.readOnly).toBe(true);
                expect(nativeTextarea.required).toBe(true);
                expect(nativeTextarea.value).toBe('testValue');
            }
        )
    );

    it('ignores maxLength if not positive integer [0]',
        componentTest(() => TestComponent, `
            <gtx-textarea [maxlength]="0"></gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            }
        )
    );

    it('ignores maxLength if not positive integer [-1]',
        componentTest(() => TestComponent, `
            <gtx-textarea [maxlength]="-1"></gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            }
        )
    );

    it('ignores maxLength if not positive integer [null]',
        componentTest(() => TestComponent, `
            <gtx-textarea [maxlength]="null"></gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                fixture.detectChanges();

                expect(nativeTextarea.attributes.getNamedItem('maxLength')).toBe(null);
            }
        )
    );

    it('emits "blur" when native input blurs, with current value',
        componentTest(() => TestComponent, `
            <gtx-textarea (blur)="onBlur($event)" value="foo">
            </gtx-textarea>`,
            fixture => {
                let textareaDebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                tick(1000);
                instance.onBlur = jasmine.createSpy('onBlur');

                textareaDebugElement.nativeElement.value = 'bar';

                triggerEvent(textareaDebugElement.nativeElement, 'blur');
                tick();

                expect(instance.onBlur).toHaveBeenCalledWith('bar');
                expect(instance.onBlur).toHaveBeenCalledTimes(1);
            }
        )
    );

    it('emits "focus" when native input is focused, with current value',
        componentTest(() => TestComponent, `
            <gtx-textarea (focus)="onFocus($event)" value="foo">
            </gtx-textarea>`,
            fixture => {
                let textareaDebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                tick(1000);
                instance.onFocus = jasmine.createSpy('onFocus');

                textareaDebugElement.nativeElement.value = 'bar';

                triggerEvent(textareaDebugElement.nativeElement, 'focus');
                tick();

                expect(instance.onFocus).toHaveBeenCalledWith('bar');
            }
        )
    );

    it('emits "change" when native input value is changed',
        componentTest(() => TestComponent, `
            <gtx-textarea (change)="onChangeEvent($event)" value="foo">
            </gtx-textarea>`,
            fixture => {
                let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                tick(1000);
                instance.onChangeEvent = jasmine.createSpy('onChangeEvent');

                triggerEvent(nativeTextarea, 'input');
                tick(1000);

                expect(instance.onChangeEvent).toHaveBeenCalledWith('foo');
                expect(instance.onChangeEvent).toHaveBeenCalledTimes(1);
            }
        )
    );

    it('does not emit "change" when native input is blurred',
        componentTest(() => TestComponent, `
            <gtx-textarea (change)="onChangeEvent($event)" value="foo">
            </gtx-textarea>`,
            fixture => {
                let textareaDebugElement = fixture.debugElement.query(By.css('textarea'));
                let instance: TestComponent = fixture.componentInstance;
                fixture.detectChanges();
                tick(1000);
                instance.onChangeEvent = jasmine.createSpy('onChangeEvent');

                triggerEvent(textareaDebugElement.nativeElement, 'blur');
                tick();

                expect(instance.onChangeEvent).not.toHaveBeenCalled();
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('binds the value with ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-textarea [(ngModel)]="value"></gtx-textarea>`,
                fixture => {
                    fixture.detectChanges();
                    tick(1000);
                    fixture.detectChanges();
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    expect(nativeTextarea.value).toBe('testValue');
                }
            )
        );

        it('binds the value with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-textarea [(ngModel)]="value"></gtx-textarea>`,
                fixture => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                    nativeTextarea.value = 'bar';
                    triggerEvent(nativeTextarea, 'input');
                    tick(1000);

                    expect(instance.value).toBe('bar');
                }
            )
        );

        it('binds the value with formControl (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-textarea formControlName="test"></gtx-textarea>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    tick(1000);
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    expect(nativeTextarea.value).toBe('controlValue');
                }
            )
        );

        it('binds the value with formControl (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-textarea formControlName="test"></gtx-textarea>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                    nativeTextarea.value = 'bar';
                    triggerEvent(nativeTextarea, 'input');
                    tick(1000);

                    expect(instance.testForm.controls['test'].value).toBe('bar');
                }
            )
        );

        it('updates the native input value when the bound value changes (inbound)',
            componentTest(() => TestComponent, `
                <gtx-textarea [(ngModel)]="value"></gtx-textarea>`,
                (fixture, instance) => {
                    instance.value = 'first';
                    const nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    fixture.detectChanges();
                    tick(1000);
                    fixture.detectChanges();

                    expect(nativeTextarea.value).toBe('first');

                    instance.value = 'second';
                    fixture.detectChanges();
                    tick(1000);
                    fixture.detectChanges();
                    expect(nativeTextarea.value).toBe('second');

                    instance.value = 'third';
                    fixture.detectChanges();
                    tick(1000);
                    fixture.detectChanges();
                    expect(nativeTextarea.value).toBe('third');
                }
            )
        );

        it('updates the bound value when the native input value changes (outbound)',
            componentTest(() => TestComponent, `
                <gtx-textarea [(ngModel)]="value"></gtx-textarea>`,
                (fixture, instance) => {
                    instance.value = 'first';
                    const nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    fixture.detectChanges();
                    tick(1000);

                    expect(instance.value).toBe('first');

                    nativeTextarea.value = 'second';
                    triggerEvent(nativeTextarea, 'input');
                    tick(1000);
                    expect(instance.value).toBe('second');

                    nativeTextarea.value = 'third';
                    triggerEvent(nativeTextarea, 'input');
                    tick(1000);
                    expect(instance.value).toBe('third');
                }
            )
        );

        it('does not change the user selection when typing',
            componentTest(() => TestComponent, `
                <gtx-textarea [(ngModel)]="value"></gtx-textarea>`,
                (fixture, instance) => {
                    const nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

                    instance.value = 'foo';
                    fixture.detectChanges();
                    tick(1000);
                    fixture.detectChanges();
                    expect(nativeTextarea.value).toBe('foo');

                    // Set cursor to f|oo
                    nativeTextarea.setSelectionRange(1, 1);

                    // Type 'x' => fx|oo
                    nativeTextarea.value = 'fxoo';
                    nativeTextarea.setSelectionRange(2, 2);
                    triggerEvent(nativeTextarea, 'input');
                    fixture.detectChanges();
                    tick(1000);

                    // Cursor should still be at fx|oo
                    expect(nativeTextarea.value).toBe('fxoo');
                    expect(instance.value).toBe('fxoo');
                    expect([nativeTextarea.selectionStart, nativeTextarea.selectionEnd]).toEqual([2, 2]);
                }
            )
        );

        it('correctly marks the Textarea as untouched/touched',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-textarea formControlName="test"></gtx-textarea>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick(1000);

                    expect(instance.testForm.get('test').touched).toBe(false);
                    expect(instance.testForm.get('test').untouched).toBe(true);

                    const debugTextarea = fixture.debugElement.query(By.css('textarea'));
                    triggerEvent(debugTextarea.nativeElement, 'focus');

                    expect(instance.testForm.get('test').touched).toBe(false);
                    expect(instance.testForm.get('test').untouched).toBe(true);

                    triggerEvent(debugTextarea.nativeElement, 'blur');

                    expect(instance.testForm.get('test').touched).toBe(true);
                    expect(instance.testForm.get('test').untouched).toBe(false);
                }
            )
        );

        it('correctly marks the Textarea as pristine/dirty',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-textarea formControlName="test"></gtx-textarea>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick(1000);

                    expect(instance.testForm.get('test').dirty).toBe(false);
                    expect(instance.testForm.get('test').pristine).toBe(true);

                    const debugTextarea = fixture.debugElement.query(By.css('textarea'));
                    (debugTextarea.nativeElement as HTMLTextAreaElement).value = 'some different value';
                    triggerEvent(debugTextarea.nativeElement, 'input');
                    tick(1000);

                    expect(instance.testForm.get('test').dirty).toBe(true);
                    expect(instance.testForm.get('test').pristine).toBe(false);
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-textarea formControlName="test"></gtx-textarea>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick(1000);

                    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    expect(textarea.disabled).toBe(false);

                    instance.testForm.get('test').disable();
                    fixture.detectChanges();
                    expect(textarea.disabled).toBe(true);
                }
            )
        );

    });

    describe('automatic height:', () => {

        it('changes its own height to fit the lines of text',
            componentTest(() => TestComponent, `
                <div style="width: 100px; height: 300px">
                    <gtx-textarea [value]="value"></gtx-textarea>
                </div>`,
                (fixture, instance) => {
                    instance.value = 'single line';
                    fixture.detectChanges();
                    tick(1000);

                    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    const firstHeight = textarea.offsetHeight;

                    instance.value = 'two\nlines';
                    fixture.detectChanges();
                    tick(1000);
                    const secondHeight = textarea.offsetHeight;
                    expect(secondHeight).toBeGreaterThan(firstHeight, 'two lines should be larger than one line');

                    instance.value = 'three\nlines\ntext';
                    fixture.detectChanges();
                    tick(1000);
                    const thirdHeight = textarea.offsetHeight;
                    expect(thirdHeight).toBeGreaterThan(secondHeight, 'three lines should be larger than two lines');
                }
            )
        );

        it('shrinks its own height if it is larger than necessary',
            componentTest(() => TestComponent, `
                <div style="width: 100px; height: 300px">
                    <gtx-textarea [value]="value"></gtx-textarea>
                </div>`,
                (fixture, instance) => {
                    instance.value = 'two\nlines';
                    fixture.detectChanges();
                    tick(1000);

                    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    const firstHeight = textarea.offsetHeight;

                    instance.value = 'single line';
                    fixture.detectChanges();
                    tick(1000);
                    const secondHeight = textarea.offsetHeight;
                    expect(secondHeight).toBeLessThan(firstHeight, 'one line should be smaller than two lines');
                }
            )
        );

        it('changes its own height to fit overly long lines of text which wrap',
            componentTest(() => TestComponent, `
                <div style="width: 100px; height: 300px">
                    <gtx-textarea [value]="value"></gtx-textarea>
                </div>`,
                (fixture, instance) => {
                    instance.value = 'short text';
                    fixture.detectChanges();
                    tick(1000);

                    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    const firstHeight = textarea.offsetHeight;

                    instance.value = 'very long single-line text which should wrap to a second line, increasing the textarea height';
                    fixture.detectChanges();
                    tick(1000);
                    const secondHeight = textarea.offsetHeight;
                    expect(secondHeight).toBeGreaterThan(firstHeight);

                    instance.value = 'short again';
                    fixture.detectChanges();
                    tick(1000);
                    const thirdHeight = textarea.offsetHeight;
                    expect(thirdHeight).toBeLessThan(secondHeight, 'does not change height when text no longer wraps');
                }
            )
        );

        it('does not throw an error in IE if the textarea value is changed from the outside',
            componentTest(() => TestComponent,
                `<gtx-textarea [value]="value"></gtx-textarea>`,
                (fixture, instance) => {
                    instance.value = 'A';
                    fixture.detectChanges();
                    tick(1000);

                    const nativeTextarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
                    nativeTextarea.value = 'B';

                    instance.value = 'C';
                    fixture.detectChanges();
                    tick(1000);
                }
            )
        );
    });

});


@Component({
    template: `<gtx-textarea></gtx-textarea>`
})
class TestComponent {

    value: string = 'testValue';
    testForm: FormGroup = new FormGroup({
        test: new FormControl('controlValue')
    });

    onBlur(): void {}
    onFocus(): void {}
    onChangeEvent(): void {}
}

/**
 * Create an dispatch an 'input' event on the <input> element
 */
function triggerEvent(el: HTMLTextAreaElement, eventName: string = 'input'): void {
    let event: Event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    el.dispatchEvent(event);
}
