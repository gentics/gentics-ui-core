import {Component, DebugElement} from 'angular2/core';
import {ControlGroup, Control} from 'angular2/common';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    xdescribe,
    expect,
    fakeAsync,
    beforeEach,
    afterEach,
    flushMicrotasks,
    inject,
    injectAsync,
    it,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {DateTimePicker} from './date-time-picker.component';
import {Modal} from '../modal/modal.component';

const TEST_TIMESTAMP: number = 1457971763;

// TODO: re-enable once zone.js bug fixed in next version (these broke on angular2.0.0-beta.11)
describe('DateTimePicker:', () => {

    it('should bind the label', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker label="test"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');
                fixture.destroy();
            });
    }));

    it('should display the time-picker when displayTime=true', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker label="test" displayTime="true"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let timePickerDiv: HTMLElement = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).not.toBeNull();
                fixture.destroy();
            });
    }));


    it('should not display the time-picker when displayTime=false', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker label="test" displayTime="false"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let timePickerDiv: HTMLElement = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).toBeNull();
                fixture.destroy();
            });
    }));


    describe('binding timestamp value:', () => {

        it('should default to current time if "timestamp" not set', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let pickerInstance: DateTimePicker = fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        expect(pickerInstance.value.date()).toEqual(new Date().getDate());
                        fixture.destroy();
                    });
            }));

        it('should bind to the a literal value of "timestamp"', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker timestamp="${TEST_TIMESTAMP}">
                    </gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let pickerInstance: DateTimePicker = fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        expect(pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
                        fixture.destroy();
                    });
            }));

        it('should bind to the a variable value of "timestamp"', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker [timestamp]="testModel">
                    </gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let pickerInstance: DateTimePicker = fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        expect(pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
                        fixture.destroy();
                    });
            }));


    });

    describe('input display:', () => {

        it('should have an empty input if timestamp is not set', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(input.value.trim()).toBe('');
                        fixture.destroy();
                    });
            }));

        it('should format the timestamp in the input when displayTime=false', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker timestamp="1457971763" displayTime="false"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(input.value.trim()).toBe('14/03/2016');
                        fixture.destroy();
                    });
            }));

        it('should format the timestamp in the input when displayTime=true', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" displayTime="true"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(input.value.trim()).toBe('14/03/2016, 17:09:23');
                        fixture.destroy();
                    });
            }));

        it('should format the timestamp when "timestamp" bound to variable', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker [timestamp]="testModel" displayTime="true"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(input.value.trim()).toBe('14/03/2016, 17:09:23');
                        fixture.destroy();
                    });
            }));

        it('should format the timestamp with custom format string', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" format="YY-MM-ddd"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                        expect(input.value.trim()).toBe('16-03-Mon');
                        fixture.destroy();
                    });
            }));
    });

    describe('confirm():', () => {

        let fixture: ComponentFixture;
        let input: HTMLInputElement;
        let instance: TestComponent;

        beforeEach(<any> injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" (change)="onChange($event)">
                        </gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((_fixture: ComponentFixture) => {
                        fixture = _fixture;
                        instance = _fixture.componentInstance;

                        spyOn(instance, 'onChange');

                        _fixture.detectChanges();
                        input = _fixture.nativeElement.querySelector('input');
                        let pickerInstance: DateTimePicker = _fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        let firstCalendarCell: HTMLElement = <HTMLElement> document
                            .querySelector('table tr:first-child td:first-child');
                        firstCalendarCell.click();
                        tick();

                        pickerInstance.confirm(<Modal> { closeModal: () => {} });
                        _fixture.detectChanges();
                        tick();
                    });
            })));

        afterEach(() => {
            fixture.destroy();
        });

        it('should change the displayed date when a new date is selected', () => {
            expect(input.value.trim()).toEqual('28/02/2016, 17:09:23');
        });

        it('should fire the "change" event when a new date is selected', () => {
            // 15 days earlier than the start timestamp
            let expected: number = TEST_TIMESTAMP - (15 * 60 * 60 * 24);
            expect(instance.onChange).toHaveBeenCalledWith(expected);
        });
    });

    describe('time increments:', () => {

        let fixture: ComponentFixture;
        let pickerInstance: DateTimePicker;

        beforeEach(<any> injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent,
                    `<gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" (change)="onChange($event)">
                        </gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((_fixture: ComponentFixture) => {
                        fixture = _fixture;
                        _fixture.detectChanges();
                        pickerInstance = _fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;
                        tick();
                    });
            })));

        afterEach(() => {
            fixture.destroy();
        });

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

        // TODO: re-enable one issue fixed (ng2 beta.13?) https://github.com/angular/angular/issues/7721
        xit('incrementTime() should increment the time by one hour', () => {
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
    });

    describe('ValueAccessor:', () => {

        it('should bind the value with NgModel (inbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker [(ngModel)]="testModel"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();

                        let instance: TestComponent = fixture.componentInstance;
                        let pickerInstance: DateTimePicker = fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP);

                        instance.testModel -= 10;
                        fixture.detectChanges();

                        expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP - 10);
                    });
            })));

        it('should bind the value with NgModel (outbound)', injectAsync([TestComponentBuilder],
            fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker [(ngModel)]="testModel"></gtx-date-time-picker>`)
                    .createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        tick();
                        let instance: TestComponent = fixture.componentInstance;
                        let pickerInstance: DateTimePicker = fixture.debugElement
                            .query(By.css('gtx-date-time-picker')).componentInstance;

                        pickerInstance.incrementTime('seconds');
                        tick();

                        // do not update the model value yet, until we confirm()
                        expect(instance.testModel).toBe(TEST_TIMESTAMP);

                        pickerInstance.confirm(<Modal> { closeModal: () => {} });
                        fixture.detectChanges();
                        tick();

                        expect(instance.testModel).toBe(TEST_TIMESTAMP + 1);
                    });
            })));

    });

});

@Component({
    template: `<gtx-date-time-picker></gtx-date-time-picker>`,
    directives: [DateTimePicker]
})
class TestComponent {
    showModal: boolean = false;
    testModel: number = TEST_TIMESTAMP;
    testForm: ControlGroup;

    constructor() {
        this.testForm = new ControlGroup({
            test: new Control(TEST_TIMESTAMP)
        });
    }
    onChange(): void {}
}
