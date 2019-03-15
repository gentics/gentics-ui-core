import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Injectable,
    Input, Output, ReflectiveInjector, Type, ViewChild} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import {componentTest} from '../../testing';
import {DateTimePicker} from './date-time-picker.component';
import {DateTimePickerModal} from './date-time-picker-modal.component';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {ModalService} from '../modal/modal.service';
import {IModalInstance, IModalOptions} from '../modal/modal-interfaces';
import {DateTimePickerFormatProvider} from './date-time-picker-format-provider.service';
import {Observable} from 'rxjs/Observable';
import {InputField} from '../input/input.component';
import {DynamicModalWrapper} from '../modal/dynamic-modal-wrapper.component';
import {Button} from '../button/button.component';
import {Icon} from '../icon/icon.directive';
import {UserAgentRef} from '../modal/user-agent-ref';

const TEST_TIMESTAMP: number = 1457971763;

let modalService: SpyModalService;
let overlayHostService: OverlayHostService;
let formatProviderToUse: DateTimePickerFormatProvider = null;
type TestFunction = (fixture: ComponentFixture<TestComponent>, instance: TestComponent) => (void | Promise<any>);


describe('DateTimePicker:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                Button,
                DateTimePicker,
                DateTimePickerModal,
                DynamicModalWrapper,
                Icon,
                InputField,
                MockDateTimePickerControls,
                OnPushTestComponent,
                OverlayHost,
                TestComponent
            ],
            providers: [
                { provide: DateTimePickerFormatProvider, useFactory: (): any => formatProviderToUse },
                { provide: ModalService, useClass: SpyModalService },
                { provide: UserAgentRef, useClass: MockUserAgentRef },
                { provide: OverlayHostService, useFactory: () => overlayHostService = new OverlayHostService() }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DynamicModalWrapper, DateTimePickerModal]
            }
        });
    });

    it('binds its label text to the label input property',
        componentTest(() => TestComponent, `<gtx-date-time-picker label="test"></gtx-date-time-picker>`,
            fixture => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');
            }
        )
    );

    it('shows its modal when clicked',
        componentTest(() => TestComponent, fixture => {
            openDatepickerModal(fixture);
            expect(modalService.lastModal).toBeDefined();
        })
    );

    it('passes displayTime=true to the DateTimePickerControls',
        componentTest(() => TestComponent, `
                <gtx-date-time-picker label="test" displayTime="true"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
            fixture => {
                openDatepickerModal(fixture);
                const mockControls: MockDateTimePickerControls = fixture.debugElement
                    .query(By.directive(MockDateTimePickerControls)).componentInstance;
                expect(mockControls.displayTime).toBe(true);
            }
        )
    );

    it('passes displayTime=false to the DateTimePickerControls',
        componentTest(() => TestComponent, `
                <gtx-date-time-picker label="test" displayTime="false"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
            fixture => {
                openDatepickerModal(fixture);
                const mockControls: MockDateTimePickerControls = fixture.debugElement
                    .query(By.directive(MockDateTimePickerControls)).componentInstance;
                expect(mockControls.displayTime).toBe(false);
            }
        )
    );

    describe('binding timestamp value:', () => {

        it('defaults to the current time if "timestamp" is not set',
            componentTest(() => TestComponent, fixture => {
                let now = Math.floor(Date.now() / 1000);
                openDatepickerModal(fixture);
                expect(modalService.lastLocals).toBeDefined();
                let timestamp: number = modalService.lastLocals['timestamp'];
                expect(timestamp).toBeCloseTo(now, 1);
            })
        );

        it('can be bound to a string value of a timestamp',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    expect(instance.pickerInstance.getUnixTimestamp()).toEqual(TEST_TIMESTAMP);
                }
            )
        );

        it('"timestamp" can be bound to a variable',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testModel"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    // Check if the initial value matches that of testModel.
                    fixture.detectChanges();
                    expect(instance.pickerInstance.getUnixTimestamp()).toEqual(TEST_TIMESTAMP);

                    // Update the testModel value and check the value of the DateTimePicker again.
                    const newValue = TEST_TIMESTAMP + 1000;
                    fixture.componentInstance.testModel = newValue;
                    fixture.detectChanges();
                    expect(instance.pickerInstance.getUnixTimestamp()).toEqual(newValue);
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

        it('does not show a clear button if clearable is false',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" clearable="false" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    expect(clearButton).toBeNull();
                }
            )
        );

        it('shows a clear button if clearable is true',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker timestamp="${TEST_TIMESTAMP}" clearable="true" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    expect(clearButton).toBeTruthy();
                }
            )
        );

        it('clears its value when the clear button is clicked',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker clearable [(ngModel)]="testModel"
                    (change)="onChange($event)" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();

                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    clearButton.triggerEventHandler('click', document.createEvent('Event'));
                    fixture.detectChanges();

                    expect(instance.testModel).toBeNull();
                    expect(instance.onChange).toHaveBeenCalledWith(null);

                    const displayValue = fixture.debugElement.query(By.css('input')).nativeElement.value as string;
                    expect(displayValue).toBe('');
                }
            )
        );

        it('emits "clear" when the clear button is clicked',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker clearable (clear)="onClear($event)" timestamp="${TEST_TIMESTAMP}">
                </gtx-date-time-picker>`,
                (fixture, testComponent) => {
                    fixture.detectChanges();
                    tick();

                    expect(testComponent.onClear).not.toHaveBeenCalled();

                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    clearButton.triggerEventHandler('click', document.createEvent('Event'));
                    fixture.detectChanges();

                    expect(testComponent.onClear).toHaveBeenCalled();
                }
            )
        );

        it('does not clear its value when clicking the clear button if the date picker is disabled',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker clearable disabled [(ngModel)]="testModel"
                    (change)="onChange($event)" format="YY-MM-ddd">
                </gtx-date-time-picker>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    clearButton.triggerEventHandler('click', document.createEvent('Event'));
                    tick();
                    fixture.detectChanges();

                    expect(instance.testModel).not.toBeNull();
                    expect(instance.onChange).not.toHaveBeenCalledWith(null);
                    const displayValue = fixture.debugElement.query(By.css('input')).nativeElement.value as string;
                    expect(displayValue).not.toBe('');
                }
            )
        );

    });

    describe('confirm():', () => {

        const FIVE_DAYS = 60 * 60 * 24 * 5;

        function confirmTest(testFn: (fixture: ComponentFixture<TestComponent>) => void): any {
            return componentTest(() => TestComponent, `
                <gtx-date-time-picker
                    timestamp="${TEST_TIMESTAMP}"
                    (change)="onChange($event)">
                </gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    instance.onChange = jasmine.createSpy('onChange');
                    let modal = openDatepickerModal(fixture);
                    const mockControls: MockDateTimePickerControls = fixture.debugElement
                        .query(By.directive(MockDateTimePickerControls)).componentInstance;

                    mockControls.change.emit(TEST_TIMESTAMP - FIVE_DAYS);
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
                expect(nativeInput.value.trim()).toEqual('03/09/2016, 5:09:23 PM');
            })
        );

        it('fires the "change" event when a new date is selected',
            confirmTest(fixture => {
                // 5 days earlier than the start timestamp
                const expected = TEST_TIMESTAMP - FIVE_DAYS;
                expect(fixture.componentRef.instance.onChange).toHaveBeenCalledWith(expected);
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
                    expect(instance.pickerInstance.getUnixTimestamp()).toBe(TEST_TIMESTAMP);

                    instance.testModel -= 10;
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(instance.pickerInstance.getUnixTimestamp()).toBe(TEST_TIMESTAMP - 10);
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

                    const mockControls: MockDateTimePickerControls = fixture.debugElement
                        .query(By.directive(MockDateTimePickerControls)).componentInstance;

                    mockControls.change.emit(TEST_TIMESTAMP + 1);

                    // does not update the model value yet, until we click okay
                    expect(instance.testModel).toBe(TEST_TIMESTAMP);

                    modal.instance.okayClicked();
                    tick();
                    fixture.detectChanges();

                    expect(instance.testModel).toBe(TEST_TIMESTAMP + 1, 'second');
                }
            )
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-date-time-picker formControlName="test"></gtx-date-time-picker>
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

        it('takes precedence over a bound "timestamp" input property',
            componentTest(() => TestComponent, `
                <gtx-date-time-picker [timestamp]="testTimestamp" [(ngModel)]="testModel"></gtx-date-time-picker>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    // Check if the initial value matches that of testModel.
                    fixture.componentInstance.testTimestamp = TEST_TIMESTAMP + 1;
                    fixture.detectChanges();
                    tick();
                    expect(instance.pickerInstance.getUnixTimestamp()).toEqual(TEST_TIMESTAMP);

                    // Update both testModel and testTimestamp and check if testModel takes precendence.
                    const newTestModel = TEST_TIMESTAMP + 1000;
                    const newTestTimestamp = newTestModel + 1000;
                    fixture.componentInstance.testModel = newTestModel;
                    fixture.componentInstance.testTimestamp = newTestTimestamp;
                    fixture.detectChanges();
                    tick();
                    expect(instance.pickerInstance.getUnixTimestamp()).toEqual(newTestModel);
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
                    // fixture.autoDetectChanges(true);
                    // instance.changeDetector.markForCheck();
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
                </gtx-date-time-picker>`,
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

    describe('with OnPush components', () => {

        it('updates the text when a date was picked',
            componentTest(() => OnPushTestComponent, (fixture, instance) => {
                fixture.autoDetectChanges(true);
                tick();

                const nativeInput = fixture.nativeElement.querySelector('input') as HTMLInputElement;
                const firstValue = nativeInput.value;

                let pretendDatepickerModalWasClosed: (timestamp: number) => void;
                modalService.fromComponent = () => Promise.resolve<any>({
                    open: () => new Promise<number>(resolve => {
                        pretendDatepickerModalWasClosed = resolve;
                    })
                });

                nativeInput.click();
                tick();

                expect(nativeInput.value).toBe('');
                pretendDatepickerModalWasClosed(1234567890123);
                tick();
                expect(nativeInput.value).not.toBe('');
            })
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
        <gtx-overlay-host></gtx-overlay-host>`
})
class TestComponent {
    testModel: number = TEST_TIMESTAMP;
    testTimestamp: number = TEST_TIMESTAMP;
    testForm: FormGroup = new FormGroup({
        test: new FormControl(TEST_TIMESTAMP)
    });
    @ViewChild(DateTimePicker) pickerInstance: DateTimePicker;
    onChange = jasmine.createSpy('onChange');
    onClear = jasmine.createSpy('onClear');
}

@Component({
    template: `<gtx-date-time-picker></gtx-date-time-picker>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
class OnPushTestComponent { }


@Component({
    selector: `gtx-date-time-picker-controls`,
    template: ``
})
class MockDateTimePickerControls {
    @Input() timestamp: number;
    @Input() formatProvider: DateTimePickerFormatProvider = new DateTimePickerFormatProvider();
    @Input() min: Date;
    @Input() max: Date;
    @Input() selectYear: boolean;
    @Input() disabled: boolean;
    @Input() displayTime: boolean;
    @Input() displaySeconds: boolean;
    @Input() compact: boolean;
    @Output() change = new EventEmitter<number>();
}

class MockUserAgentRef {
    isIE11 = false;
}

@Injectable()
class TestFormatProvider extends DateTimePickerFormatProvider { }


@Injectable()
class SpyModalService extends ModalService {
    lastOptions: IModalOptions;
    lastLocals: { [key: string]: any };
    lastModal: IModalInstance<any>;

    constructor(componentFactoryResolver: ComponentFactoryResolver,
                overlayHostService: OverlayHostService) {
        super(componentFactoryResolver, overlayHostService);
        modalService = this;
    }

    fromComponent(component: Type<any>,
                  options?: IModalOptions,
                  locals?: { [key: string]: any }): Promise<IModalInstance<any>> {
        this.lastOptions = options;
        this.lastLocals = locals;

        return super.fromComponent(component, options, locals)
            .then(modal => {
                this.lastModal = modal;
                return modal;
            });
    }
}
