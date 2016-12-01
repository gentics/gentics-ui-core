import {ComponentFixture} from '@angular/compiler/testing';
import {Component, ComponentResolver, Injectable, ViewChild} from '@angular/core';
import {Type} from '@angular/core/src/facade/lang';
import {addProviders, tick, getTestInjector} from '@angular/core/testing';
import {FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {componentTest, createClickEvent, worksButHasPendingTimers} from '../../testing';
import {DateTimePicker} from './date-time-picker.component';
import {DateTimePickerModal} from './date-time-picker-modal.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {ModalService} from '../modal/modal.service';
import {IModalInstance, IModalOptions} from '../modal/modal-interfaces';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {Observable} from 'rxjs';

const TEST_TIMESTAMP: number = 1457971763;

let modalService: SpyModalService;
let overlayHostService: OverlayHostService;
let formatProviderToUse: DateTimePickerFormatProvider = null;


describe('DateTimePicker:', () => {

    beforeEach(() => {
        let injector = getTestInjector().createInjector()
            .resolveAndCreateChild([ModalService, OverlayHostService]);

        let componentResolver: ComponentResolver = injector.get(ComponentResolver);
        overlayHostService = injector.get(OverlayHostService);
        modalService = new SpyModalService(componentResolver, overlayHostService);
    });

    it('binds its label text to the label input property',
        componentTest(() => TestComponent, `
            <gtx-date-time-picker label="test">
            </gtx-date-time-picker>`,
            fixture => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');
            }
        )
    );

    it('shows its modal when clicked',
        worksButHasPendingTimers(
            componentTest(() => TestComponent, fixture => {
                openDatepickerModal(fixture);
                expect(modalService.lastModal).toBeDefined();
            })
        )
    );

    it('displays the time-picker when displayTime=true',
        worksButHasPendingTimers(
            componentTest(() => TestComponent, `
                <gtx-date-time-picker label="test" displayTime="true"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                fixture => {
                    openDatepickerModal(fixture);
                    expect(modalService.lastModal).toBeDefined();
                    let timePickerDiv = <HTMLElement> modalService.lastModal.element.querySelector('.time-picker');
                    expect(timePickerDiv).not.toBeNull();
                }
            )
        )
    );

    it('does not display the time-picker when displayTime=false',
        worksButHasPendingTimers(
            componentTest(() => TestComponent, `
                <gtx-date-time-picker label="test" displayTime="false"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                fixture => {
                    openDatepickerModal(fixture);
                    expect(modalService.lastModal).toBeDefined();
                    let timePickerDiv = <HTMLElement> modalService.lastModal.element.querySelector('.time-picker');
                    expect(timePickerDiv).toBeNull();
                }
            )
        )
    );


    describe('binding timestamp value:', () => {

        it('defaults to the current time if "timestamp" is not set',
            worksButHasPendingTimers(
                componentTest(() => TestComponent, (fixture, instance) => {
                    let now = Math.floor(Date.now() / 1000);
                    openDatepickerModal(fixture);
                    expect(modalService.lastLocals).toBeDefined();
                    let timestamp: number = modalService.lastLocals['timestamp'];
                    expect(timestamp).toBeCloseTo(now, 1);
                })
            )
        );

        it('can be bound to a string value of a timestamp',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    expect(instance.pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
                }
            )
        );

        it('"timestamp" can be bound to a variable',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testModel"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    expect(instance.pickerInstance.value.unix()).toEqual(TEST_TIMESTAMP);
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
            })
        );

        it('formats the timestamp in the input as a date when displayTime=false',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="1457971763" displayTime="false">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('03/14/2016');
                }
            )
        );

        it('formats the timestamp in the input with a time when displayTime=true',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" displayTime="true">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('03/14/2016, 5:09:23 PM');
                }
            )
        );

        it('formats the timestamp in the input when "timestamp" is bound to a variable',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testModel" displayTime="true">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('03/14/2016, 5:09:23 PM');
                }
            )
        );

        it('formats the timestamp with a custom format string',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                fixture => {
                    expect(inputValue(fixture)).toBe('16-03-Mon');
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
                </gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    const onChange = instance.onChange = jasmine.createSpy('onChange');
                    let modal = openDatepickerModal(fixture);

                    let firstCalendarCell: HTMLElement = modal.query('tbody tr:first-child td:first-child');
                    firstCalendarCell.click();
                    modal.instance.okayClicked();

                    tick();
                    fixture.detectChanges();

                    testFn(fixture);
                }
            );
        }

        it('changes the displayed date when a new date is selected',
            confirmTest(fixture => {
                let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
                expect(nativeInput.value.trim()).toEqual('02/28/2016, 5:09:23 PM');
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

        function incrementDecrementTest(testFn: (picker: DateTimePickerModal) => void): any {
            return worksButHasPendingTimers(
                componentTest(() => TestComponent, `
                    <gtx-date-time-picker
                        timestamp="${TEST_TIMESTAMP}"
                        (change)="onChange($event)">
                    </gtx-date-time-picker>
                    <gtx-overlay-host></gtx-overlay-host>`,
                    (fixture, instance) => {
                        let modal = openDatepickerModal(fixture);
                        testFn(modal.instance);
                    }
                )
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
                    expect(instance.pickerInstance.value.unix()).toBe(TEST_TIMESTAMP);

                    instance.testModel -= 10;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(instance.pickerInstance.value.unix()).toBe(TEST_TIMESTAMP - 10);
                }
            )
        );

        it('binds the timestamp to a variable with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [(ngModel)]="testModel">
                </gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    let modal = openDatepickerModal(fixture);
                    expect(modalService.lastLocals['timestamp']).toBe(TEST_TIMESTAMP, 'local not set');

                    modal.instance.incrementTime('seconds');

                    // does not update the model value yet, until we click okay
                    expect(instance.testModel).toBe(TEST_TIMESTAMP);

                    modal.instance.okayClicked();
                    tick();
                    fixture.detectChanges();

                    expect(instance.testModel).toBe(TEST_TIMESTAMP + 1, 'second');
                }
            )
        );

    });

    describe('l10n/i18n support:', () => {

        let formatProvider: TestFormatProvider;
        beforeEach(() => {
            formatProviderToUse = formatProvider = new TestFormatProvider();
        });

        it('uses a custom format provider to display the date in the input field',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [(ngModel)]="testModel">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    let format = formatProvider.format = jasmine.createSpy('format').and.returnValue('formatted date');
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    let nativeInput = fixture.nativeElement.querySelector('input');

                    expect(format).toHaveBeenCalledTimes(1);
                    expect(nativeInput.value).toBe('formatted date');
                    expect(format).toHaveBeenCalledWith(jasmine.anything(), true, true);
                    expect(format.calls.mostRecent().args[0]).toBeDefined();
                    expect(format.calls.mostRecent().args[0].unix()).toEqual(instance.testModel);

                    instance.testModel -= 10;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(format).toHaveBeenCalledTimes(2);
                    expect(format.calls.mostRecent().args[0].unix()).toEqual(instance.testModel);
                }
            )
        );

        it('updates the text in the input field when the format provider signals a change',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}">
                </gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    // Change date format after 1 second
                    formatProvider.format = () => 'date in first format';
                    formatProvider.changed$ = Observable.timer(1000).take(1)
                        .do(() => { formatProvider.format = () => 'date in second format'; });

                    fixture.detectChanges();
                    tick();

                    let nativeInput = fixture.nativeElement.querySelector('input');
                    expect(nativeInput.value).toBe('date in first format');

                    tick(1000);
                    fixture.detectChanges();
                    expect(nativeInput.value).toBe('date in second format');
                }
            )
        );

    });


});

function openDatepickerModal(fixture: ComponentFixture<TestComponent>):
        { instance: DateTimePickerModal, query: (selector: string) => HTMLElement } {

    fixture.detectChanges();
    let nativeInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    nativeInput.click();
    tick();
    fixture.detectChanges();

    let instance = modalService.lastModal.instance as DateTimePickerModal;
    let query = (selector: string): HTMLElement => modalService.lastModal.element.querySelector(selector) as HTMLElement;
    return { instance, query };
}


@Component({
    template: `
        <gtx-date-time-picker></gtx-date-time-picker>
        <gtx-overlay-host></gtx-overlay-host>`,
    directives: [DateTimePicker, OverlayHost, REACTIVE_FORM_DIRECTIVES],
    providers: [
        { provide: OverlayHostService, useFactory: (): any => overlayHostService },
        { provide: ModalService, useFactory: (): any => modalService },
        { provide: DateTimePickerFormatProvider, useFactory: (): any => formatProviderToUse }
    ]
})
class TestComponent {
    testModel: number = TEST_TIMESTAMP;
    testForm: FormGroup = new FormGroup({
        test: new FormControl(TEST_TIMESTAMP)
    });
    @ViewChild(DateTimePicker) pickerInstance: DateTimePicker;
    onChange(): void {}
}

@Injectable()
class TestFormatProvider extends DateTimePickerFormatProvider { }


@Injectable()
class SpyModalService extends ModalService {
    lastOptions: IModalOptions;
    lastLocals: { [key: string]: any };
    lastModal: IModalInstance;
    fakeModalReturnValue: any;

    constructor(componentResolver: ComponentResolver,
                overlayHostService: OverlayHostService) {
        super(componentResolver, overlayHostService);
    }

    fromComponent(component: Type,
                  options?: IModalOptions,
                  locals?: { [key: string]: any }): Promise<IModalInstance> {
        this.lastOptions = options;
        this.lastLocals = locals;

        return super.fromComponent(component, options, locals)
            .then(modal => {
                this.lastModal = modal;
                return modal;
            });
    }
}
