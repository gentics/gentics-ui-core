import {Component, EventEmitter, Input, Output, forwardRef} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

import {componentTest} from '../../testing/component-test';
import {DateTimePickerControls} from './date-time-picker-controls.component';
import {InputField} from '../input/input.component';
import {Button} from '../button/button.component';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {DateTimePickerStrings} from './date-time-picker-strings';
import {defaultStrings} from './date-time-picker-default-strings';

const TEST_TIMESTAMP: number = 1457971763;
let formatProviderToUse: DateTimePickerFormatProvider = null;

describe('DateTimePickerControls', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [
                TestComponent,
                InputField,
                Button,
                DateTimePickerControls,
                MockSelect,
                MockSelectOption
            ],
            providers: [
                { provide: DateTimePickerFormatProvider, useFactory: (): any => formatProviderToUse }
            ]
        });
    });

    it('does not emit a change event when the timestamp is externally changed', componentTest(() => TestComponent,
        `<gtx-date-time-picker-controls [timestamp]="timestamp" (change)="onChange($event)"></gtx-date-time-picker-controls>`,
        (fixture, instance) => {
            fixture.detectChanges();
            tick();
            expect(instance.onChange).not.toHaveBeenCalled();

            instance.timestamp = TEST_TIMESTAMP + 1;
            fixture.detectChanges();
            tick();

            instance.timestamp = TEST_TIMESTAMP + 2;
            fixture.detectChanges();
            tick();

            expect(instance.onChange).not.toHaveBeenCalled();
        })
    );

    describe('min and max', () => {

        const MIN_DATE = new Date(TEST_TIMESTAMP * 1000 - 2000);
        const MAX_DATE = new Date(TEST_TIMESTAMP * 1000 + 2000);

        it('should throw if min is not a Date object', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls [min]="min"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.min = 1234;
                const detectChanges = () => fixture.detectChanges();

                expect(detectChanges).toThrow();
            })
        );


        it('should throw if max is not a Date object', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls [max]="max"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.max = 1234;
                const detectChanges = () => fixture.detectChanges();

                expect(detectChanges).toThrow();
            })
        );

        it('does not allow dates earlier than min with time increment buttons', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     displayTime="true"
                                                     displaySeconds="true"
                                                     [min]="min"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.min = MIN_DATE;
                fixture.detectChanges();
                const decrementButton: HTMLButtonElement = fixture.debugElement
                    .query(By.css('.seconds .increment-button:last-of-type')).nativeElement;

                decrementButton.click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith(TEST_TIMESTAMP - 1);

                decrementButton.click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith(TEST_TIMESTAMP - 2);

                decrementButton.click();
                tick();
                expect(instance.onChange).not.toHaveBeenCalledWith(TEST_TIMESTAMP - 3);
            })
        );

        it('does not allow dates later than max with time increment buttons', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     displayTime="true"
                                                     displaySeconds="true"
                                                     [max]="max"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.max = MAX_DATE;
                fixture.detectChanges();
                const decrementButton: HTMLButtonElement = fixture.debugElement
                    .query(By.css('.seconds .increment-button:first-of-type')).nativeElement;

                decrementButton.click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith(TEST_TIMESTAMP + 1);

                decrementButton.click();
                tick();
                expect(instance.onChange).toHaveBeenCalledWith(TEST_TIMESTAMP + 2);

                decrementButton.click();
                tick();
                expect(instance.onChange).not.toHaveBeenCalledWith(TEST_TIMESTAMP + 3);
            })
        );

        it('does not allow dates earlier than min with time inputs', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     displayTime="true"
                                                     displaySeconds="true"
                                                     [min]="min"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.min = MIN_DATE;
                fixture.detectChanges();
                tick();
                const secondsInput: InputField = fixture.debugElement.queryAll(By.directive(InputField))[2].componentInstance;
                const nativeInput: HTMLInputElement = fixture.debugElement.query(By.css('.seconds input')).nativeElement;
                const initialValue = +nativeInput.value;
                const illegalValue = initialValue - 3;
                secondsInput.onInput({ target: { value: illegalValue } } as any);
                secondsInput.blur.emit();
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

        it('does not allow dates later than max with time inputs', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     displayTime="true"
                                                     displaySeconds="true"
                                                     [max]="max"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.max = MAX_DATE;
                fixture.detectChanges();
                tick();
                const secondsInput: InputField = fixture.debugElement.queryAll(By.directive(InputField))[2].componentInstance;
                const nativeInput: HTMLInputElement = fixture.debugElement.query(By.css('.seconds input')).nativeElement;
                const initialValue = +nativeInput.value;
                const illegalValue = initialValue + 3;
                secondsInput.onInput({ target: { value: illegalValue } } as any);
                secondsInput.blur.emit();
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

        it('does not allow dates earlier than min with calendar controls', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     [min]="min"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.min = MIN_DATE;
                fixture.detectChanges();
                const firstCalendarCell: HTMLElement = fixture.debugElement.nativeElement
                                    .querySelector('tbody.rd-days-body tr:first-child td:first-child');
                firstCalendarCell.click();
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

        it('does not allow dates later than max with calendar controls', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     [max]="max"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.max = MAX_DATE;
                fixture.detectChanges();
                const lastCalendarCell: HTMLElement = fixture.debugElement.nativeElement
                                    .querySelector('tbody.rd-days-body tr:last-child td:last-child');
                lastCalendarCell.click();
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

        it('does not allow dates earlier than min with year select', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     [min]="min"
                                                     selectYear="true"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.min = MIN_DATE;
                fixture.detectChanges();
                const select: MockSelect = fixture.debugElement.query(By.directive(MockSelect)).componentInstance;
                select.change.emit(1900);
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

        it('does not allow dates later than max with year select', componentTest(() => TestComponent,
            `<gtx-date-time-picker-controls timestamp="${TEST_TIMESTAMP}"
                                                     [max]="max"
                                                     selectYear="true"
                                                     (change)="onChange($event)"></gtx-date-time-picker-controls>`,
            (fixture, instance) => {
                instance.max = MAX_DATE;
                fixture.detectChanges();
                const select: MockSelect = fixture.debugElement.query(By.directive(MockSelect)).componentInstance;
                select.change.emit(3000);
                tick();

                expect(instance.onChange).not.toHaveBeenCalled();
            })
        );

    });

    describe('time increments:', () => {

        it('incrementTime("seconds") increments the time by one second',
            pickerTest(picker => {
                picker.incrementTime('seconds');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP + 1);
            })
        );

        it('incrementTime("minutes") increments the time by one minute',
            pickerTest(picker => {
                picker.incrementTime('minutes');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP + 60);
            })
        );

        it('incrementTime("hours") increments the time by one hour',
            pickerTest(picker => {
                picker.incrementTime('hours');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP + (60 * 60));
            })
        );

        it('decrementTime("seconds") decrement the time by one second',
            pickerTest(picker => {
                picker.decrementTime('seconds');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP - 1);
            })
        );

        it('decrementTime("minutes") decrements the time by one minute',
            pickerTest(picker => {
                picker.decrementTime('minutes');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP - 60);
            })
        );

        it('decrementTime("hours") decrements the time by one hour',
            pickerTest(picker => {
                picker.decrementTime('hours');
                expect(picker.getUnixTimestamp()).toBe(TEST_TIMESTAMP - (60 * 60));
            })
        );
    });

    describe('l10n/i18n - No Provider override:', () => {

        fit('should default to normal strings',
            pickerTest(picker => {
                const provider = picker.formatProvider;
                expect(provider).toBeDefined;
                expect(provider.strings).toEqual(defaultStrings);
            })
        );

        fit('should use the provider from input',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker-controls [formatProvider]="provider">
                </gtx-date-time-picker-controls>`,
                fixture => {
                    const picker = fixture.debugElement.query(By.directive(DateTimePickerControls)).componentInstance;
                    fixture.detectChanges();
                    tick();
                    const provider = picker.formatProvider;
                    expect(provider).toBeDefined;
                    expect(provider.strings).toEqual(timePickerTestStrings);
                }
            )
        );
    });

    describe('l10n/i18n - Provider override:', () => {

        let formatProvider: TestFormatProvider;
        beforeEach(() => {
            formatProviderToUse = formatProvider = new TestFormatProvider();
        });

        fit('should use the provider-override strings',
            pickerTest(picker => {
                const provider = picker.formatProvider;
                expect(provider).toBeDefined;
                expect(provider.strings).toEqual(timePickerTestStrings);
            })
        );
    });
});

function pickerTest(testFn: (picker: DateTimePickerControls) => void): any {
    return componentTest(() => TestComponent, `<gtx-date-time-picker-controls
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker-controls>`,
        fixture => {
            const picker = fixture.debugElement.query(By.directive(DateTimePickerControls)).componentInstance;
            fixture.detectChanges();
            tick();
            testFn(picker);
        }
    );
}

@Component({
    selector: 'test-component',
    template: `<gtx-date-time-picker-controls></gtx-date-time-picker-controls>`
})
class TestComponent {
    min: any;
    max: any;
    timestamp = TEST_TIMESTAMP;
    onChange = jasmine.createSpy('onChange');
    provider = new TestFormatProvider();
}

const timePickerTestStrings: DateTimePickerStrings = {
    hours: '_test_hours_',
    minutes: '_test_minutes_',
    seconds: '_test_seconds_',
    cancel: '_test_cancel_',
    months: ['_test_january_', '_test_february_', '_test_march_', '_test_april_', '_test_may_', '_test_june_', '_test_july_', '_test_august_', '_test_september_', '_test_october_', '_test_november_', '_test_december_'],
    monthsShort: ['_test_jan_', '_test_feb_', '_test_mar_', '_test_apr_', '_test_may_', '_test_jun_', '_test_jul_', '_test_aug_', '_test_sep_', '_test_oct_', '_test_nov_', '_test_dec_'],
    okay: '_test_okay_',
    weekdays: ['_test_sunday_', '_test_monday_', '_test_tuesday_', '_test_wednesday_', '_test_thursday_', '_test_friday_', '_test_saturday_'],
    weekdaysShort: ['_test_sun_', '_test_mon_', '_test_tue_', '_test_wed_', '_test_thu_', '_test_fri_', '_test_sat_'],
    weekdaysMin: ['_test_su_', '_test_mo_', '_test_tu_', '_test_we_', '_test_th_', '_test_fr_', '_test_sa_'],
};

class TestFormatProvider extends DateTimePickerFormatProvider {
    strings = timePickerTestStrings;
}

@Component({
    selector: 'gtx-select',
    template: ``,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MockSelect),
        multi: true
    }]
})
class MockSelect {
    @Output() change = new EventEmitter<any>();
    writeValue(): void {}
    registerOnChange(): void {}
    registerOnTouched(): void {}
}

@Component({
    selector: 'gtx-option',
    template: ``
})
class MockSelectOption {
    @Input() value: any;
}
