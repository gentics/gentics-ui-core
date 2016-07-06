import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {addProviders, async, fakeAsync, inject, tick} from '@angular/core/testing';
import {FormGroup, FormControl, disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {DateTimePicker} from './date-time-picker.component';
import {Modal} from '../modal/modal.component';

const TEST_TIMESTAMP: number = 1457971763;

describe('DateTimePicker:', () => {

    beforeEach(() => addProviders([
        disableDeprecatedForms(),
        provideForms()
    ]));

    it('should bind the label',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-date-time-picker label="test"></gtx-date-time-picker>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');
                fixture.destroy();
            })
        ))
    );

    it('should display the time-picker when displayTime=true',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-date-time-picker label="test" displayTime="true">
                </gtx-date-time-picker>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let timePickerDiv: HTMLElement = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).not.toBeNull();
                fixture.destroy();
            })
        ))
    );

    it('should not display the time-picker when displayTime=false',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-date-time-picker label="test" displayTime="false"></gtx-date-time-picker>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let timePickerDiv: HTMLElement = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).toBeNull();
                fixture.destroy();
            })
        ))
    );


    describe('binding timestamp value:', () => {

        it('should default to current time if "timestamp" not set',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker></gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    expect(pickerInstance.value.date()).toEqual(new Date().getDate());
                    fixture.destroy();
                })
            ))
        );

        it('should bind to the a literal value of "timestamp"',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    expect(pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
                    fixture.destroy();
                })
            ))
        );

        it('should bind to the a variable value of "timestamp"',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker [timestamp]="testModel">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    expect(pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
                    fixture.destroy();
                })
            ))
        );

    });

    describe('input display:', () => {

        it('should have an empty input if timestamp is not set',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker></gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value.trim()).toBe('');
                    fixture.destroy();
                })
            ))
        );

        it('should format the timestamp in the input when displayTime=false',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker timestamp="1457971763" displayTime="false">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value.trim()).toBe('14/03/2016');
                    fixture.destroy();
                })
            ))
        );

        it('should format the timestamp in the input when displayTime=true',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" displayTime="true">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value.trim()).toBe('14/03/2016, 17:09:23');
                    fixture.destroy();
                })
            ))
        );

        it('should format the timestamp when "timestamp" bound to variable',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker [timestamp]="testModel" displayTime="true">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value.trim()).toBe('14/03/2016, 17:09:23');
                    fixture.destroy();
                })
            ))
        );

        it('should format the timestamp with custom format string',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" format="YY-MM-ddd">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    expect(input.value.trim()).toBe('16-03-Mon');
                    fixture.destroy();
                })
            ))
        );
    });

    describe('confirm():', () => {

        let fixture: ComponentFixture<TestComponent>;
        let nativeInput: HTMLInputElement;
        let instance: TestComponent;

        beforeEach(fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-date-time-picker
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker>
            `)
            .createAsync(TestComponent)
            .then(_fixture => {
                fixture = _fixture;
                instance = fixture.componentInstance;

                spyOn(instance, 'onChange');

                fixture.detectChanges();
                nativeInput = fixture.nativeElement.querySelector('input');
                let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                let firstCalendarCell: HTMLElement = <HTMLElement> document
                    .querySelector('table tr:first-child td:first-child');
                firstCalendarCell.click();
                tick();

                pickerInstance.confirm(<Modal> { closeModal: (): void => {} });
                fixture.detectChanges();
                tick();
            })
        )));

        it('should change the displayed date when a new date is selected', () => {
            expect(nativeInput.value.trim()).toEqual('28/02/2016, 17:09:23');
        });

        it('should fire the "change" event when a new date is selected', () => {
            // 15 days earlier than the start timestamp
            let expected: number = TEST_TIMESTAMP - (15 * 60 * 60 * 24);
            expect(instance.onChange).toHaveBeenCalledWith(expected);
        });

        afterEach(() => {
            fixture.destroy();
        });
    });

    describe('time increments:', () => {

        let fixture: ComponentFixture<TestComponent>;
        let pickerInstance: DateTimePicker;

        beforeEach(fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-date-time-picker
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker>
            `)
            .createAsync(TestComponent)
            .then(_fixture => {
                fixture = _fixture;
                fixture.detectChanges();
                pickerInstance = fixture.componentInstance.pickerInstance;
                tick();
            })
        )));

        it('incrementTime() should increment the time by one second', () => {
            pickerInstance.incrementTime('seconds');
            let expected: number = TEST_TIMESTAMP + 1;
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        it('incrementTime() should increment the time by one minute', () => {
            pickerInstance.incrementTime('minutes');
            let expected: number = TEST_TIMESTAMP + (60);
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        it('incrementTime() should increment the time by one hour', () => {
            pickerInstance.incrementTime('hours');
            let expected: number = TEST_TIMESTAMP + (60 * 60);
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        it('decrementTime() should decrement the time by one second', () => {
            pickerInstance.decrementTime('seconds');
            let expected: number = TEST_TIMESTAMP - 1;
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        it('decrementTime() should decrement the time by one minute', () => {
            pickerInstance.decrementTime('minutes');
            let expected: number = TEST_TIMESTAMP - (60);
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        it('decrementTime() should decrement the time by one hour', () => {
            pickerInstance.decrementTime('hours');
            let expected: number = TEST_TIMESTAMP - (60 * 60);
            expect(pickerInstance.value.unix()).toBe(expected);
        });

        afterEach(() => {
            fixture.destroy();
        });
    });

    describe('ValueAccessor:', () => {

        it('should bind the value with NgModel (inbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker [(ngModel)]="testModel">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();

                    let instance: TestComponent = fixture.componentInstance;
                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP);

                    instance.testModel -= 10;
                    fixture.detectChanges();

                    expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP - 10);
                })
            ))
        );

        it('should bind the value with NgModel (outbound)',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-date-time-picker [(ngModel)]="testModel">
                    </gtx-date-time-picker>
                `)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    tick();
                    let instance: TestComponent = fixture.componentInstance;
                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    pickerInstance.incrementTime('seconds');
                    tick();

                    // do not update the model value yet, until we confirm()
                    expect(instance.testModel).toBe(TEST_TIMESTAMP);

                    pickerInstance.confirm(<Modal> { closeModal: (): void => {} });
                    fixture.detectChanges();
                    tick();

                    expect(instance.testModel).toBe(TEST_TIMESTAMP + 1);
                })
            ))
        );

    });

});

@Component({
    template: `<gtx-date-time-picker></gtx-date-time-picker>`,
    directives: [DateTimePicker, REACTIVE_FORM_DIRECTIVES]
})
class TestComponent {
    showModal: boolean = false;
    testModel: number = TEST_TIMESTAMP;
    testForm: FormGroup = new FormGroup({
        test: new FormControl(TEST_TIMESTAMP)
    });
    @ViewChild(DateTimePicker) pickerInstance: DateTimePicker;
    onChange(): void {}
}
