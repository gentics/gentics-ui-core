import {Component} from '@angular/core';
import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BehaviorSubject} from 'rxjs';

import {componentTest} from '../../testing';
import {Select} from './select.component';
import {InputField} from '../input/input.component';
import {DropdownList} from '../dropdown-list/dropdown-list.component';
import {DropdownContentWrapper} from '../dropdown-list/dropdown-content-wrapper.component';
import {DropdownContent} from '../dropdown-list/dropdown-content.component';
import {DropdownTriggerDirective} from '../dropdown-list/dropdown-trigger.directive';
import {ScrollMask} from '../dropdown-list/scroll-mask.component';
import {SelectOption, SelectOptionGroup} from './option.component';
import {Icon} from '../icon/icon.directive';
import {Button} from '../button/button.component';
import {Checkbox} from '../checkbox/checkbox.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {crossBrowserInitKeyboardEvent, KeyboardEventConfig} from '../../testing/keyboard-event';
import {KeyCode} from '../../common/keycodes';

fdescribe('Select:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                Select,
                SelectOption,
                SelectOptionGroup,
                Icon,
                Button,
                TestComponent,
                InputField,
                Checkbox,
                DropdownList,
                DropdownContent,
                DropdownContentWrapper,
                DropdownTriggerDirective,
                ScrollMask,
                OverlayHost
            ],
            providers: [OverlayHostService]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DropdownContentWrapper, ScrollMask]
            }
        });
    });

    it('emits "clear" when the clear selection button is clicked',
            componentTest(() => TestComponent, `
                <gtx-select clearable (change)="onChange($event)"></gtx-select>`,
                (fixture, instance) => {
                    instance.onChange = jasmine.createSpy('onChange');
                    fixture.detectChanges();
                    tick();

                    expect(instance.onChange).not.toHaveBeenCalled();

                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    clearButton.triggerEventHandler('click', document.createEvent('Event'));
                    tick();
                    fixture.detectChanges();

                    expect(instance.onChange).toHaveBeenCalledWith(null);
                }
            )
    );

    it('updates the value via ngModel when the clear selection button is clicked',
            componentTest(() => TestComponent, `
                <gtx-select [(ngModel)]="ngModelValue" (change)="onChange($event)" clearable>
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                </gtx-select>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    expect(instance.ngModelValue).toEqual('Bar');

                    const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                    clearButton.triggerEventHandler('click', document.createEvent('Event'));
                    tick();
                    fixture.detectChanges();

                    expect(instance.ngModelValue).toBeNull();
                }
            )
        );

    it('displays the placeholder, if it is set and if nothing is selected',
        componentTest(() => TestComponent, `
            <gtx-select [(ngModel)]="ngModelValue" (change)="onChange($event)" clearable [placeholder]="placeholder">
                    <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
            </gtx-select>`,
            (fixture, instance) => {
                fixture.detectChanges();
                tick();
                expect(instance.ngModelValue).toEqual('Bar');

                const clearButton = fixture.debugElement.query(By.css('gtx-button'));
                clearButton.triggerEventHandler('click', document.createEvent('Event'));
                tick();
                fixture.detectChanges();

                let placeholder: HTMLElement = fixture.debugElement.query(By.css('.placeholder')).nativeElement;

                expect(placeholder).toBeDefined();
                expect(placeholder.textContent).toEqual('More...');
            }
        )
    );

    it('binds its label to the input value',
        componentTest(() => TestComponent, `
            <gtx-select label="testLabel"></gtx-select>`,
            fixture => {
                fixture.detectChanges();
                let label: HTMLElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText).toBe('testLabel');
            }
        )
    );

    it('contains class with-label if label is present',
        componentTest(() => TestComponent, `
        <gtx-select label="testLabel"></gtx-select>`,
            fixture => {
                fixture.detectChanges();
                let dropdown: HTMLElement = fixture.nativeElement.querySelector('gtx-dropdown-trigger');

                expect(dropdown.classList).toContain('with-label');
            }
        )
    );

    it('does not contain class with-label if label is not present',
        componentTest(() => TestComponent, `
        <gtx-select></gtx-select>`,
            fixture => {
                fixture.detectChanges();
                let dropdown: HTMLElement = fixture.nativeElement.querySelector('gtx-dropdown-trigger');

                expect(dropdown.classList).not.toContain('with-label');
            }
        )
    );

    it('adds a "disabled" attribute to the view-value div if the disabled attribute is true.',
        componentTest(() => TestComponent, `
            <gtx-select label="testLabel" disabled="true"></gtx-select>`,
            fixture => {
                fixture.detectChanges();
                let viewValue: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;

                expect(viewValue.getAttribute('disabled')).toBe('true');
            }
        )
    );

    it('when disabled, the viewValue div is not focusable.',
        componentTest(() => TestComponent, `
            <gtx-select label="testLabel" disabled="true"></gtx-select>`,
            fixture => {
                fixture.detectChanges();
                let viewValue: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;
                viewValue.focus();
                expect(document.activeElement).not.toBe(viewValue);
            }
        )
    );

    it('accepts a string "value" and sets the viewValue to match.',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            clickSelectAndOpen(fixture);
            let viewValue: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;
            expect(viewValue.innerText).toContain('Bar');

            tick(1000);
        })
    );

    it('marks the initial value as selected.',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            clickSelectAndOpen(fixture);
            let viewValue: HTMLElement = fixture.debugElement.query(By.css('li.selected')).nativeElement;
            expect(viewValue.innerText).toContain('Bar');

            tick(1000);
        })
    );

    it('if no value is set, the viewValue is empty.',
        componentTest(() => TestComponent, `
            <gtx-select>
                <gtx-option>Foo</gtx-option>
                <gtx-option>Bar</gtx-option>
                <gtx-option>Baz</gtx-option>
            </gtx-select>
            <gtx-overlay-host></gtx-overlay-host>`,
            fixture => {
                fixture.detectChanges();
                tick();

                let viewValue: HTMLElement = fixture.debugElement.query(By.css('.view-value > div')).nativeElement;

                expect(viewValue.innerText).toBe('');

                tick(1000);
            })
    );

    it('accept an array "value" and marks the matching options "selected" (multi select)',
        componentTest(() => TestComponent, `
            <gtx-select [value]="multiValue" multiple="true">
                <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
            </gtx-select>
            <gtx-overlay-host></gtx-overlay-host>`,
            fixture => {
                fixture.detectChanges();
                tick();
                clickSelectAndOpen(fixture);

                let checkboxes: Checkbox[] = fixture.debugElement.queryAll(By.directive(Checkbox)).map(de => de.componentInstance);

                expect(checkboxes[0].checked).toBe(false);
                expect(checkboxes[1].checked).toBe(true);
                expect(checkboxes[2].checked).toBe(true);

                tick(1000);
            }
        )
    );

    it('updates the "value" when a different option is clicked',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            clickSelectAndOpen(fixture);

            let selectInstance: Select = fixture.debugElement.query(By.directive(Select)).componentInstance;
            let listItems = getListItems(fixture);

            listItems[0].click();
            tick();
            expect(selectInstance.value).toBe('Foo');

            listItems[2].click();
            tick();
            expect(selectInstance.value).toBe('Baz');
        })
    );

    it('emits "blur" with the current value when the native input is blurred',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            let fakeInput: HTMLInputElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;
            spyOn(instance, 'onBlur');

            triggerEvent(fakeInput, 'blur');
            tick();
            fixture.detectChanges();

            expect(instance.onBlur).toHaveBeenCalledWith('Bar');
        })
    );

    it('emits "change" when a list item is clicked',
        componentTest(() => TestComponent, (fixture, instance) => {
            fixture.detectChanges();
            tick();
            clickSelectAndOpen(fixture);

            let listItems = getListItems(fixture);
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
            <gtx-select multiple="true" [value]="[value]" (change)="onChange($event)">
                <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
            </gtx-select>
            <gtx-overlay-host></gtx-overlay-host>`,
            (fixture, instance) => {
                fixture.detectChanges();
                tick();
                clickSelectAndOpen(fixture);

                let listItems = getListItems(fixture);
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
                <gtx-select multiple="true" [value]="[value]" (change)="onChange($event)">
                    <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                </gtx-select>
                <gtx-overlay-host></gtx-overlay-host>`,
            (fixture, instance) => {
                fixture.detectChanges();
                tick();
                clickSelectAndOpen(fixture);

                let listItems = getListItems(fixture);
                let onChange = instance.onChange = jasmine.createSpy('onChange');

                listItems[1].click();
                tick();
                expect(onChange.calls.argsFor(0)[0]).toEqual([]);
            }
        )
    );

    it('updates options when the gtx-options elements change',
        componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                tick();
                clickSelectAndOpen(fixture);
                const getOptionText = () => getListItems(fixture).map(el => el.innerText);
                expect(getOptionText()).toEqual(['Foo', 'Bar', 'Baz']);

                instance.options.push('Quux');
                fixture.detectChanges();
                expect(getOptionText()).toEqual(['Foo', 'Bar', 'Baz', 'Quux']);
                tick(1000);
            }
        )
    );

    it('updates options when the gtx-options elements change asynchronously',
        componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                tick();
                clickSelectAndOpen(fixture);
                const getOptionText = () => getListItems(fixture).map(el => el.innerText);
                expect(getOptionText()).toEqual(['Foo', 'Bar', 'Baz']);

                setTimeout(() => instance.options.push('Quux'), 500);
                tick(500);

                fixture.detectChanges();
                expect(getOptionText()).toEqual(['Foo', 'Bar', 'Baz', 'Quux']);
                tick(1000);
            }
        )
    );

    describe('keyboard controls', () => {

        it('should open when enter is pressed',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);
                let optionsDropdown = fixture.debugElement.query(By.css('.select-options'));
                expect(optionsDropdown).toBeTruthy();
                tick(1000);
            })
        );

        it('should open when space is pressed',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Space);
                let optionsDropdown = fixture.debugElement.query(By.css('.select-options'));
                expect(optionsDropdown).toBeTruthy();
                tick(1000);
            })
        );

        it('initial value should be initially selected',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);
                const selected = fixture.debugElement.nativeElement.querySelector('li.selected');
                expect(selected.innerHTML).toContain('Bar');
                tick(1000);
            })
        );

        it('down arrow should select subsequent items',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);

                sendKeyDown(fixture, KeyCode.DownArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                sendKeyDown(fixture, KeyCode.DownArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                sendKeyDown(fixture, KeyCode.DownArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Bar');

                sendKeyDown(fixture, KeyCode.DownArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                tick(1000);
            })
        );

        it('up arrow should select previous items',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);

                sendKeyDown(fixture, KeyCode.UpArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                sendKeyDown(fixture, KeyCode.UpArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                sendKeyDown(fixture, KeyCode.UpArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Bar');

                sendKeyDown(fixture, KeyCode.UpArrow);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                tick(1000);
            })
        );

        it('home and end should select first and last items',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);

                sendKeyDown(fixture, KeyCode.Home);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                sendKeyDown(fixture, KeyCode.End);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                tick(1000);
            })
        );

        it('page up and page down should select first and last items',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);

                sendKeyDown(fixture, KeyCode.PageUp);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                sendKeyDown(fixture, KeyCode.PageDown);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                tick(1000);
            })
        );

        it('characters should select subsequent matching options',
            componentTest(() => TestComponent, fixture => {
                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);
                const F = { key: 'f', keyCode: 70 };
                const B = { key: 'b', keyCode: 66 };

                sendKeyDown(fixture, F);
                expect(getSelectedItem(fixture).textContent).toContain('Foo');

                sendKeyDown(fixture, B);
                expect(getSelectedItem(fixture).textContent).toContain('Bar');

                sendKeyDown(fixture, B);
                expect(getSelectedItem(fixture).textContent).toContain('Baz');

                sendKeyDown(fixture, B);
                expect(getSelectedItem(fixture).textContent).toContain('Bar');

                tick(1000);
            })
        );

        it('umlauts should work as expected',
            componentTest(() => TestComponent, (fixture, testComponent) => {
                testComponent.options = [
                    'Ägypten',
                    'Äquatorialguinea',
                    'Äthiopien',
                    'Österreich'
                ];
                testComponent.value = 'Ägypten';

                fixture.detectChanges();
                tick();
                sendKeyDown(fixture, KeyCode.Enter);
                const A_UMLAUT = { key: 'ä', keyCode: 222 };
                const O_UMLAUT = { key: 'ö', keyCode: 192 };

                sendKeyDown(fixture, O_UMLAUT);
                expect(getSelectedItem(fixture).textContent).toContain('Österreich');

                sendKeyDown(fixture, A_UMLAUT);
                expect(getSelectedItem(fixture).textContent).toContain('Ägypten');

                sendKeyDown(fixture, A_UMLAUT);
                expect(getSelectedItem(fixture).textContent).toContain('Äquatorialguinea');

                sendKeyDown(fixture, A_UMLAUT);
                expect(getSelectedItem(fixture).textContent).toContain('Äthiopien');

                tick(1000);
            })
        );

        function sendKeyDown(fixture: ComponentFixture<any>, keyToSend: number | { key: string, keyCode: number }): void {
            const eventTarget: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;
            const eventProps: KeyboardEventConfig = { bubbles: true };
            if (typeof keyToSend === 'number') {
                eventProps.key = KeyCode[keyToSend];
                eventProps.keyCode = keyToSend;
            } else {
                eventProps.key = keyToSend.key;
                eventProps.keyCode = keyToSend.keyCode;
            }
            const keydownEvent = crossBrowserInitKeyboardEvent('keydown', eventProps);
            eventTarget.dispatchEvent(keydownEvent);
            tick();
            fixture.detectChanges();
        }

        function getSelectedItem(fixture: ComponentFixture<TestComponent>): HTMLElement {
            return fixture.debugElement.query(By.css('.select-option.selected')).nativeElement;
        }

    });

    describe('ValueAccessor:', () => {

        it('updates a variable bound with ngModel (outbound)',
            componentTest(() => TestComponent, `
                <gtx-select [(ngModel)]="ngModelValue">
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                </gtx-select>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    clickSelectAndOpen(fixture);

                    let listItems = getListItems(fixture);

                    listItems[0].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.ngModelValue).toBe('Foo');

                    listItems[2].click();
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
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                    </gtx-select>
                </form>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    clickSelectAndOpen(fixture);

                    let listItems = getListItems(fixture);

                    listItems[0].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.testForm.get('test').value).toBe('Foo');

                    listItems[2].click();
                    tick();
                    tick();
                    fixture.detectChanges();
                    expect(instance.testForm.get('test').value).toBe('Baz');
                }
            )
        );

        it('binds the value to a variable with formControlName (inbound)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                    </gtx-select>
                </form>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    clickSelectAndOpen(fixture);

                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input.select-dropdown');
                    let selectInstance: Select = fixture.debugElement.query(By.directive(Select)).componentInstance;

                    expect(instance.testForm.get('test').value).toBe('Bar');
                    expect(selectInstance.value).toBe('Bar');

                    (instance.testForm.get('test') as FormControl).setValue('Baz');
                    fixture.detectChanges();

                    expect(instance.testForm.get('test').value).toBe('Baz');
                    expect(selectInstance.value).toBe('Baz');

                    tick(1000);
                }
            )
        );

        it('marks the component as "touched" when the native input is blurred',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                    </gtx-select>
                </form>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    let fakeInput: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;

                    expect(instance.testForm.get('test').touched).toBe(false);
                    expect(instance.testForm.get('test').untouched).toBe(true);

                    triggerEvent(fakeInput, 'focus');
                    triggerEvent(fakeInput, 'blur');
                    tick();
                    fixture.detectChanges();

                    expect(instance.testForm.get('test').touched).toBe(true);
                    expect(instance.testForm.get('test').untouched).toBe(false);
                })
        );

        it('marks the component as "disabled" if the associated FormControl is set to disabled',
            componentTest(() => TestComponent, `
                   <form [formGroup]="testForm">
                       <gtx-select formControlName="test">
                           <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                       </gtx-select>
                   </form>
                   <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    fixture.detectChanges();
                    tick();
                    let fakeInput: HTMLElement = fixture.debugElement.query(By.css('.view-value')).nativeElement;

                    expect(instance.testForm.get('test').disabled).toBe(false);
                    expect(fakeInput.getAttribute('disabled')).toBe(null);

                    instance.testForm.get('test').disable();
                    fixture.detectChanges();

                    expect(instance.testForm.get('test').disabled).toBe(true);
                    expect(fakeInput.getAttribute('disabled')).toBe('true');
                })
        );

        it('can be disabled via the form control',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                    </gtx-select>
                </form>`,
                (fixture, instance) => {
                    fixture.detectChanges();

                    const div: HTMLDivElement = fixture.nativeElement.querySelector('.view-value');
                    expect(div.getAttribute('disabled')).not.toBe('true');

                    instance.testForm.get('test').disable();
                    fixture.detectChanges();
                    expect(div.getAttribute('disabled')).toBe('true');
                }
            )
        );

        it('renders the correct value as selected when used with reactive forms (string values)',
            componentTest(() => TestComponent, `
                <form [formGroup]="testForm">
                    <gtx-select formControlName="test">
                        <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
                    </gtx-select>
                </form>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    instance.testForm.reset({ test: 'Bar' }, { emitEvent: false });
                    fixture.detectChanges();
                    tick();
                    const displayedText: string = fixture.nativeElement.querySelector('.view-value').innerText;
                    expect(displayedText).toContain('Bar');
                }
            )
        );

        it('renders the correct value as selected when used with reactive forms (number values)',
        componentTest(() => TestComponent, `
            <form [formGroup]="testForm">
                <gtx-select formControlName="test">
                    <gtx-option [value]="1">One</gtx-option>
                    <gtx-option [value]="2">Two</gtx-option>
                    <gtx-option [value]="3">Three</gtx-option>
                    <gtx-option [value]="4">Four</gtx-option>
                </gtx-select>
            </form>
            <gtx-overlay-host></gtx-overlay-host>`,
            (fixture, instance) => {
                instance.testForm.reset({ test: 3 }, { emitEvent: false });
                fixture.detectChanges();
                tick();
                const displayedText: string = fixture.nativeElement.querySelector('.view-value').innerText;
                expect(displayedText).toContain('Three');
            }
        )
    );

        it('works as expected when value is provided with a subject',
            componentTest(() => TestComponent, `
                <gtx-select [value]="valueSubject | async" (change)="valueSubject.next($event)">
                    <gtx-option *ngFor="let option of optionsSubject | async" [value]="option">
                        {{ option.name }}
                    </gtx-option>
                </gtx-select>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    let lastEmittedValue: any;
                    instance.valueSubject.subscribe(v => lastEmittedValue = v);

                    const options = [
                        { name: 'First option' },
                        { name: 'Second option' },
                        { name: 'Third option' }
                    ];
                    instance.optionsSubject.next(options);
                    instance.valueSubject.next(options[1]);
                    fixture.detectChanges();
                    tick();

                    expect(lastEmittedValue).toBe(options[1]);

                    clickSelectAndOpen(fixture);
                    getListItems(fixture)[2].click();
                    fixture.detectChanges();

                    expect(lastEmittedValue).toBe(options[2]);

                    tick(1000);
                }
            )
        );

        it('works as expected when ngModel is provided with a subject',
            componentTest(() => TestComponent, `
                <gtx-select [ngModel]="valueSubject | async" (ngModelChange)="valueSubject.next($event)">
                    <gtx-option *ngFor="let option of optionsSubject | async" [value]="option">
                        {{ option.name }}
                    </gtx-option>
                </gtx-select>
                <gtx-overlay-host></gtx-overlay-host>`,
                (fixture, instance) => {
                    let lastEmittedValue: any;
                    instance.valueSubject.subscribe(v => lastEmittedValue = v);

                    const options = [
                        { name: 'First option' },
                        { name: 'Second option' },
                        { name: 'Third option' }
                    ];
                    instance.optionsSubject.next(options);
                    instance.valueSubject.next(options[1]);
                    fixture.detectChanges();
                    tick();

                    expect(lastEmittedValue).toBe(options[1]);

                    clickSelectAndOpen(fixture);
                    getListItems(fixture)[2].click();
                    fixture.detectChanges();

                    expect(lastEmittedValue).toBe(options[2]);

                    tick(1000);
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
            <gtx-option *ngFor="let option of options" [value]="option">{{ option }}</gtx-option>
        </gtx-select>
        <gtx-overlay-host></gtx-overlay-host>
`
})
class TestComponent {

    value: string = 'Bar';
    multiValue: string[] = ['Bar', 'Baz'];
    ngModelValue: string = 'Bar';
    placeholder: string = 'More...';
    options: string[] = ['Foo', 'Bar', 'Baz'];
    optionsSubject = new BehaviorSubject<any[]>([]);
    valueSubject = new BehaviorSubject<any>('Initial value');
    testForm: FormGroup = new FormGroup({
        test: new FormControl('Bar')
    });

    onBlur(): void {}
    onFocus(): void {}
    onChange(): void {}
}


function clickSelectAndOpen(fixture: ComponentFixture<TestComponent>): void {
    fixture.debugElement.query(By.directive(DropdownTriggerDirective)).nativeElement.click();
    tick(100);
    fixture.detectChanges();
}

function getListItems(fixture: ComponentFixture<TestComponent>): HTMLLIElement[] {
    return fixture.debugElement.queryAll(By.css('.select-option')).map(de => de.nativeElement);
}

/**
 * Create an dispatch an 'input' event on the <input> element
 */
function triggerEvent(el: HTMLElement, eventName: string): void {
    let event: Event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    el.dispatchEvent(event);
}
