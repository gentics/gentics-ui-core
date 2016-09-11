import {ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {addProviders, tick} from '@angular/core/testing';
import {FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest} from '../../testing';
import {DateTimePicker} from './date-time-picker.component';
import {Modal} from '../modal/modal.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';

const TEST_TIMESTAMP: number = 1457971763;

describe('DateTimePicker:', () => {

    beforeEach(() => {
        addProviders([OverlayHostService]);
    });

    it('binds its label text to the label input property',
        componentTest(() => TestComponent, `
            <gtx-date-time-picker label="test">
            </gtx-date-time-picker>`,
            fixture => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');

                // TODO: A pending setTimeout seems to make a tick() call necessary.
                tick();
            }
        )
    );

    it('displays the time-picker when displayTime=true',
        componentTest(() => TestComponent, `
            <gtx-date-time-picker label="test" displayTime="true">
            </gtx-date-time-picker>`,
            fixture => {
                fixture.detectChanges();
                let timePickerDiv = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).not.toBeNull();

                // TODO: A pending setTimeout seems to make a tick() call necessary.
                tick();
            }
        )
    );

    it('does not display the time-picker when displayTime=false',
        componentTest(() => TestComponent, `
            <gtx-date-time-picker label="test" displayTime="false"></gtx-date-time-picker>`,
            fixture => {
                fixture.detectChanges();
                let timePickerDiv = <HTMLElement> document.querySelector('.time-picker');

                expect(timePickerDiv).toBeNull();

                // TODO: A pending setTimeout seems to make a tick() call necessary.
                tick();
            }
        )
    );


    describe('binding timestamp value:', () => {

        it('defaults to the current time if "timestamp" is not set',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                expect(instance.pickerInstance.value.date()).toBeCloseTo(new Date().getDate(), 50);

                // TODO: A pending setTimeout seems to make a tick() call necessary.
                tick();
            })
        );

        it('can be bound to a string value of a timestamp',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    expect(instance.pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );

        it('"timestamp" can be bound to a variable',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testModel">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    expect(instance.pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );

    });

    describe('input display:', () => {

        function inputValue(fixture: ComponentFixture<TestComponent>): string {
            fixture.detectChanges();
            return fixture.nativeElement.querySelector('input').value.trim();
        }

        it('contains an empty input if timestamp is not set',
            componentTest(() => TestComponent, fixture => {
                expect(inputValue(fixture)).toBe('');

                // TODO: A pending setTimeout seems to make a tick() call necessary.
                tick();
            })
        );

        it('formats the timestamp in the input as a date when displayTime=false',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="1457971763" displayTime="false">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('14/03/2016');

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );

        it('formats the timestamp in the input with a time when displayTime=true',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" displayTime="true">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('14/03/2016, 17:09:23');

                   // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );

        it('formats the timestamp in the input when "timestamp" is bound to a variable',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testModel" displayTime="true">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('14/03/2016, 17:09:23');

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );

        it('formats the timestamp with a custom format string',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('16-03-Mon');

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            )
        );
    });

    describe('confirm():', () => {

        function confirmTest(testFn: (fixture: ComponentFixture<TestComponent>) => void): any {
            return componentTest(() => TestComponent, `
                <gtx-date-time-picker
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    const onChange = instance.onChange = jasmine.createSpy('onChange');
                    fixture.detectChanges();
                    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

                    let firstCalendarCell: HTMLElement = <HTMLElement> document
                        .querySelector('table tr:first-child td:first-child');
                    firstCalendarCell.click();
                    tick();

                    instance.pickerInstance.confirm(<Modal> { closeModal: (): void => {} });
                    fixture.detectChanges();
                    tick();

                    testFn(fixture);
                }
            );
        }

        it('changes the displayed date when a new date is selected',
            confirmTest(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                expect(nativeInput.value.trim()).toEqual('28/02/2016, 17:09:23');
            })
        );

        it('fires the "change" event when a new date is selected',
            confirmTest(fixture => {
                // 15 days earlier than the start timestamp
                let expected: number = TEST_TIMESTAMP - (15 * 60 * 60 * 24);
                expect(fixture.componentRef.instance.onChange).toHaveBeenCalledWith(expected);
            })
        );
    });

    describe('time increments:', () => {

        function incrementDecrementTest(testFn: (picker: DateTimePicker) => void): any {
            return componentTest(() => TestComponent, `
                <gtx-date-time-picker
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();

                    testFn(instance.pickerInstance);

                    // TODO: A pending setTimeout seems to make a tick() call necessary.
                    tick();
                }
            );
        }

        it('incrementTime("seconds") increments the time by one second',
            incrementDecrementTest(picker => {
                picker.incrementTime('seconds');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP + 1);
            })
        );

        it('incrementTime("minutes") increments the time by one minute',
            incrementDecrementTest(picker => {
                picker.incrementTime('minutes');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP + 60);
            })
        );

        it('incrementTime("hours") increments the time by one hour',
            incrementDecrementTest(picker => {
                picker.incrementTime('hours');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP + (60 * 60));
            })
        );

        it('decrementTime("seconds") decrement the time by one second',
            incrementDecrementTest(picker => {
                picker.decrementTime('seconds');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP - 1);
            })
        );

        it('decrementTime("minutes") decrements the time by one minute',
            incrementDecrementTest(picker => {
                picker.decrementTime('minutes');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP - 60);
            })
        );

        it('decrementTime("hours") decrements the time by one hour',
            incrementDecrementTest(picker => {
                picker.decrementTime('hours');
                expect(picker.value.unix()).toBe(TEST_TIMESTAMP - (60 * 60));
            })
        );
    });

    describe('ValueAccessor:', () => {

        it('binds the timestamp to a variable with ngModel (inbound)',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [(ngModel)]="testModel">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();

                    let pickerInstance: DateTimePicker = fixture.componentInstance.pickerInstance;

                    expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP);

                    instance.testModel -= 10;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(pickerInstance.value.unix()).toBe(TEST_TIMESTAMP - 10);
                }
            )
        );

        it('binds the timestamp to a variable with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [(ngModel)]="testModel">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    let pickerInstance: DateTimePicker = instance.pickerInstance;

                    pickerInstance.incrementTime('seconds');
                    tick();

                    // does not update the model value yet, until we confirm()
                    expect(instance.testModel).toBe(TEST_TIMESTAMP);

                    pickerInstance.confirm(<Modal> { closeModal: (): void => {} });
                    fixture.detectChanges();
                    tick();

                    expect(instance.testModel).toBe(TEST_TIMESTAMP + 1);
                }
            )
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
