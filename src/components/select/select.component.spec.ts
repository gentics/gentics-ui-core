import {Component, ViewChild} from '@angular/core';
import {discardPeriodicTasks, tick} from '@angular/core/testing';
import {FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

import {componentTest} from '../../testing';
import {Select} from './select.component';

describe('Select:', () => {

    it('binds its label to the input value',
        componentTest(() => TestComponent, `
            <gtx-select label="testLabel"></gtx-select>`,
            fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();
                tick();

                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('bind the id to the label "for" and input "id" attributes',
        componentTest(() => TestComponent, `
            <gtx-select label="testLabel" id="testId"></gtx-select>`,
            fixture => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');

                fixture.detectChanges();
                tick();

                expect(label.htmlFor).toBe('testId');
                expect(nativeSelect.id).toBe('testId');
            }
        )
    );

    it('uses defaults for undefined attributes which have a default',
        componentTest(() => TestComponent, `
            <gtx-select></gtx-select>`,
            fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                fixture.detectChanges();
                tick();

                expect(nativeSelect.disabled).toBe(false);
                expect(nativeSelect.multiple).toBe(false);
                expect(nativeSelect.required).toBe(false);
            }
        )
    );

    it('does not add attributes when they are not defined',
        componentTest(() => TestComponent, `
            <gtx-select></gtx-select>`,
            fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                const getAttr: Function = (name: string) => nativeSelect.attributes.getNamedItem(name);
                fixture.detectChanges();
                tick();

                expect(getAttr('id')).toBe(null);
                expect(getAttr('name')).toBe(null);
            }
        )
    );

    it('passes through the native attributes to its native "select" element',
        componentTest(() => TestComponent, `
            <gtx-select
                disabled="true"
                multiple="true"
                name="testName"
                required="true"
            ></gtx-select>`,
            fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                fixture.detectChanges();
                tick();

                expect(nativeSelect.disabled).toBe(true);
                expect(nativeSelect.multiple).toBe(true);
                expect(nativeSelect.name).toBe('testName');
                expect(nativeSelect.required).toBe(true);
            }
        )
    );

    it('accepts a string "value" and marks the matching option as "selected"',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            let barOption: HTMLOptionElement = fixture.nativeElement.querySelector('option[value="Bar"]');

            expect(barOption.selected).toBe(true);
        })
    );

    it('accept an array "value" and marks the matching options "selected" (multi select)',
        componentTest(() => TestComponent, `
            <gtx-select [value]="multiValue" multiple="true">
                <option *ngFor="let option of options" [value]="option">{{ option }}</option>
            </gtx-select>`,
            fixture => {
                fixture.detectChanges();
                tick();

                let options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('option');

                expect(options[0].selected).toBe(false);
                expect(options[1].selected).toBe(true);
                expect(options[2].selected).toBe(true);
            }
        )
    );

    it('updates the "value" when a different option is clicked',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            let selectInstance: Select = instance.selectInstance;
            let listItems: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

            listItems[0].click();
            tick();
            expect(selectInstance.value).toBe('Foo');

            listItems[2].click();
            tick();
            expect(selectInstance.value).toBe('Baz');
        })
    );

    /**
     * TODO: Throws "1 periodic timer(s) still in the queue." - fix, then re-enable
     */
    xit('emits "blur" with the current value when the native input is blurred',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            let fakeInput: HTMLInputElement = fixture.nativeElement.querySelector('input.select-dropdown');
            instance.onBlur = jasmine.createSpy('onBlur');

            let event: Event = document.createEvent('Event');
            event.initEvent('blur', true, true);
            fakeInput.dispatchEvent(event);
            tick();
            fixture.detectChanges();

            expect(instance.onBlur).toHaveBeenCalledWith('Bar');
            tick();
            fixture.detectChanges();
            tick();

            discardPeriodicTasks();
        })
    );

    it('emits "change" when a list item is clicked',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();

            let listItems: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
            instance.onChange = jasmine.createSpy('onChange');

            listItems[0].click();
            tick();
            expect(instance.onChange).toHaveBeenCalledWith('Foo');

            listItems[2].click();
            tick();
            expect(instance.onChange).toHaveBeenCalledWith('Baz');
        })
    );

    it('emits "change" when a list item is clicked (multiple select)',
        componentTest(() => TestComponent, `
            <gtx-select multiple="true" [value]="value" (change)="onChange($event)">
                <option *ngFor="let option of options" [value]="option">{{ option }}</option>
            </gtx-select>`,
            (fixture, instance) => {
                fixture.detectChanges();
                tick();

                let listItems: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                let onChange = instance.onChange = jasmine.createSpy('onChange');

                listItems[0].click();
                tick();
                expect(onChange.calls.argsFor(0)[0]).toEqual(['Bar', 'Foo']);

                listItems[2].click();
                tick();
                expect(onChange.calls.argsFor(1)[0]).toEqual(['Bar', 'Foo', 'Baz']);
            }
        )
    );

    it('emits "change" with an empty array when a multiselect has no selected options',
        componentTest(() => TestComponent, `
            <gtx-select multiple="true" [value]="value" (change)="onChange($event)">
                    <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                </gtx-select>`,
            fixture => {
                fixture.detectChanges();
                tick();

                let listItems: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                let instance: TestComponent = fixture.componentInstance;
                let onChange = instance.onChange = jasmine.createSpy('onChange');

                listItems[1].click();
                tick();
                expect(onChange.calls.argsFor(0)[0]).toEqual([]);
            }
        )
    );

    describe('ValueAccessor:', () => {

        it('updates a variable bound with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-select [(ngModel)]="ngModelValue">
                        <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                </gtx-select>`,
                fixture => {
                    fixture.detectChanges();
                    tick();

                    let instance: TestComponent = fixture.componentInstance;
                    let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                    optionLIs[0].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.ngModelValue).toBe('Foo');

                    optionLIs[2].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.ngModelValue).toBe('Baz');
                }
            )
        );

        it('updates a variable bound with formControlName (outbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                    </gtx-select>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    let instance: TestComponent = fixture.componentInstance;
                    let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                    optionLIs[0].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.testForm.controls['test'].value).toBe('Foo');

                    optionLIs[2].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.testForm.controls['test'].value).toBe('Baz');
                }
            )
        );

        it('binds the value to a variable with formControlName (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                    </gtx-select>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    let instance: TestComponent = fixture.componentInstance;
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input.select-dropdown');

                    expect(instance.testForm.controls['test'].value).toBe('Bar');
                    expect(input.value).toBe('Bar');

                    (instance.testForm.controls['test'] as FormControl).updateValue('Baz');
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].value).toBe('Baz');
                    expect(input.value).toBe('Baz');
                }
            )
        );

        /*
        * TODO: Throws "1 periodic timer(s) still in the queue"
        */
        xit('marks the component as "touched" when the native input is blurred',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                    </gtx-select>
                </form>`,
                fixture => {
                    fixture.detectChanges();
                    tick();
                    let instance: TestComponent = fixture.componentInstance;
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(instance.testForm.controls['test'].touched).toBe(false);
                    expect(instance.testForm.controls['test'].untouched).toBe(true);

                    triggerEvent(nativeInput, 'focus');
                    triggerEvent(nativeInput, 'blur');
                    tick();
                    fixture.detectChanges();

                    expect(instance.testForm.controls['test'].touched).toBe(true);
                    expect(instance.testForm.controls['test'].untouched).toBe(false);
                }
            )
        );

    });

});

@Component({
    template: `
        <gtx-select
            (blur)="onBlur($event)"
            (change)="onChange($event)"
            [value]="value"
        >
            <option *ngFor="let option of options" [value]="option">{{ option }}</option>
        </gtx-select>`,
    directives: [Select, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {

    value: string = 'Bar';
    multiValue: string[] = ['Bar', 'Baz'];
    ngModelValue: string = 'Bar';
    options: string[] = ['Foo', 'Bar', 'Baz'];
    testForm: FormGroup = new FormGroup({
        test: new FormControl('Bar')
    });
    @ViewChild(Select) selectInstance: Select;

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}


/**
 * Create an dispatch an 'input' event on the <input> element
 */
function triggerEvent(el: HTMLElement, eventName: string): void {
    let event: Event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    el.dispatchEvent(event);
}
