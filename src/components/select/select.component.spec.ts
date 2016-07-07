import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {addProviders, async, discardPeriodicTasks, fakeAsync, inject, tick} from '@angular/core/testing';
import {FormGroup, FormControl, disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

import {Select} from './select.component';

describe('Select:', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the label',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select label="testLabel"></gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let label: HTMLElement = fixture.nativeElement.querySelector('label');
                fixture.detectChanges();

                expect(label.innerText).toBe('testLabel');
            })
        ))
    );

    it('should bind the id to the label and input',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select label="testLabel" id="testId"></gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');

                fixture.detectChanges();

                expect(label.htmlFor).toBe('testId');
                expect(nativeSelect.id).toBe('testId');
            })
        ))
    );

    it('should use defaults for undefined attributes which have a default',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select></gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                fixture.detectChanges();

                expect(nativeSelect.disabled).toBe(false);
                expect(nativeSelect.multiple).toBe(false);
                expect(nativeSelect.required).toBe(false);
            })
        ))
    );

    it('should not display undefined attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select></gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                const getAttr: Function = (name: string) => nativeSelect.attributes.getNamedItem(name);
                fixture.detectChanges();

                expect(getAttr('id')).toBe(null);
                expect(getAttr('name')).toBe(null);
            })
        ))
    );

    it('should pass through the native attributes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select
                    disabled="true"
                    multiple="true"
                    name="testName"
                    required="true"
                ></gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                let nativeSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                fixture.detectChanges();

                expect(nativeSelect.disabled).toBe(true);
                expect(nativeSelect.multiple).toBe(true);
                expect(nativeSelect.name).toBe('testName');
                expect(nativeSelect.required).toBe(true);
            })
        ))
    );

    it('should accept a "value" string and make the matching option "selected"',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                let optionBar: HTMLOptionElement = <HTMLOptionElement> fixture.nativeElement
                    .querySelector('option[value="Bar"]');

                expect(optionBar.selected).toBe(true);
            })
        ))
    );

    it('should accept a "value" array and make the matching options "selected" (multi select)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select [value]="multiValue" multiple="true">
                    <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                </gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();

                let options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('option');

                expect(options[0].selected).toBe(false);
                expect(options[1].selected).toBe(true);
                expect(options[2].selected).toBe(true);
            })
        ))
    );

    it('should update "value" when another option is clicked',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();
                let selectInstance: Select = fixture.componentInstance.selectInstance;
                let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');

                optionLIs[0].click();
                tick();
                expect(selectInstance.value).toBe('Foo');

                optionLIs[2].click();
                tick();
                expect(selectInstance.value).toBe('Baz');
            })
        ))
    );

    /**
     * TODO: Throws "1 periodic timer(s) still in the queue." - fix, then re-enable
     */
    xit('should emit "blur" when input blurs, with current value',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();
                let fakeInput: HTMLInputElement = fixture.nativeElement.querySelector('input.select-dropdown');
                let instance: TestComponent = fixture.componentInstance;
                spyOn(instance, 'onBlur');

                let event: Event = document.createEvent('Event');
                event.initEvent('blur', true, true);
                fakeInput.dispatchEvent(event);
                tick();
                fixture.detectChanges();

                expect(instance.onBlur).toHaveBeenCalledWith('Bar');
                tick();
                fixture.detectChanges();
                tick();

                fixture.destroy();
                discardPeriodicTasks();
            })
        ))
    );

    it('should emit "change" when a list item is clicked',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();

                let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                let instance: TestComponent = fixture.componentInstance;
                spyOn(instance, 'onChange');

                optionLIs[0].click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith('Foo');

                optionLIs[2].click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith('Baz');
            })
        ))
    );

    it('should emit "change" when a list item is clicked (multiple select)',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select multiple="true" [value]="value" (change)="onChange($event)">
                    <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                </gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();

                let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                let instance: TestComponent = fixture.componentInstance;
                let onChange = spyOn(instance, 'onChange');

                optionLIs[0].click();
                tick();
                expect(onChange.calls.argsFor(0)[0]).toEqual(['Bar', 'Foo']);

                optionLIs[2].click();
                tick();
                expect(onChange.calls.argsFor(1)[0]).toEqual(['Bar', 'Foo', 'Baz']);
            })
        ))
    );

    it('should emit "change" with an empty array when multiple select has no selected options',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-select multiple="true" [value]="value" (change)="onChange($event)">
                      <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                 </gtx-select>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                tick();

                let optionLIs: NodeListOf<HTMLLIElement> = fixture.nativeElement.querySelectorAll('li');
                let instance: TestComponent = fixture.componentInstance;
                let onChange = spyOn(instance, 'onChange');

                optionLIs[1].click();
                tick();
                expect(onChange.calls.argsFor(0)[0]).toEqual([]);
            })
        ))
    );

    describe('ValueAccessor:', () => {

        it('should bind the value with ngModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-select [(ngModel)]="ngModelValue">
                         <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                    </gtx-select>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
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
                })
            ))
        );

        it('should bind the value with formControlName (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-select formControlName="test">
                            <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                        </gtx-select>
                     </form>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
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
                })
            ))
        );

        /*
        * TODO: Throws "1 periodic timer(s) still in the queue"
        */
        xit('should mark the component as "touched" when native input blurs',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <form [formGroup]="testForm">
                        <gtx-select formControlName="test">
                             <option *ngFor="let option of options" [value]="option">{{ option }}</option>
                         </gtx-select>
                    </form>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
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
                })
            ))
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
