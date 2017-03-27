import {Component} from '@angular/core';
import {TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {componentTest} from '../../testing';
import {AutofocusDirective} from './autofocus.directive';
import {Button} from '../../components/button/button.component';
import {Checkbox} from '../../components/checkbox/checkbox.component';
import {DateTimePicker} from '../../components/date-time-picker/date-time-picker.component';
import {FilePicker} from '../../components/file-picker/file-picker.component';
import {InputField} from '../../components/input/input.component';
import {OverlayHost} from '../../components/overlay-host/overlay-host.component';
import {RadioButton} from '../../components/radio-button/radio-button.component';
import {SearchBar} from '../../components/search-bar/search-bar.component';
import {Select} from '../../components/select/select.component';
import {Textarea} from '../../components/textarea/textarea.component';
import {ModalService} from '../../components/modal/modal.service';
import {IModalDialog} from '../../components/modal/modal-interfaces';
import {OverlayHostService} from '../../components/overlay-host/overlay-host.service';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {DynamicModalWrapper} from '../../components/modal/dynamic-modal-wrapper.component';
import {DropdownList} from '../../components/dropdown-list/dropdown-list.component';
import {DropdownContent} from '../../components/dropdown-list/dropdown-content.component';
import {DropdownTriggerDirective} from '../../components/dropdown-list/dropdown-trigger.directive';
import {Icon} from '../../components/icon/icon.component';
import {DropdownContentWrapper} from '../../components/dropdown-list/dropdown-content-wrapper.component';
import {ScrollMask} from '../../components/dropdown-list/scroll-mask.component';


describe('AutofocusDirective', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                AutofocusDirective,
                Button,
                Checkbox,
                DateTimePicker,
                DropdownList,
                DropdownTriggerDirective,
                DropdownContent,
                DropdownContentWrapper,
                DynamicModalWrapper,
                FilePicker,
                Icon,
                InputField,
                OverlayHost,
                RadioButton,
                ScrollMask,
                SearchBar,
                Select,
                TestComponent,
                TestModal,
                Textarea
            ],
            providers: [
                ModalService,
                OverlayHostService
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DropdownContentWrapper, DynamicModalWrapper, TestModal, ScrollMask]
            }
        });
    });

    it('works for Button',
        componentTest(() => TestComponent, `
            <gtx-button label="first"></gtx-button>
            <gtx-button label="second" autofocus></gtx-button>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('button') as HTMLButtonElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for CheckBoxe',
        componentTest(() => TestComponent, `
            <gtx-checkbox label="first"></gtx-checkbox>
            <gtx-checkbox label="second" autofocus></gtx-checkbox>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for DateTimePicker',
        componentTest(() => TestComponent, `
            <gtx-date-time-picker label="first"></gtx-date-time-picker>
            <gtx-date-time-picker label="second" autofocus></gtx-date-time-picker>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for FilePicker',
        componentTest(() => TestComponent, `
            <gtx-file-picker label="first"></gtx-file-picker>
            <gtx-file-picker label="second" autofocus></gtx-file-picker>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for InputField',
        componentTest(() => TestComponent, `
            <gtx-input label="first"></gtx-input>
            <gtx-input label="second" autofocus></gtx-input>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for RadioButton',
        componentTest(() => TestComponent, `
            <gtx-radio-button label="first"></gtx-radio-button>
            <gtx-radio-button label="second" autofocus></gtx-radio-button>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for SearchBar',
        componentTest(() => TestComponent, `
            <gtx-search-bar label="first"></gtx-search-bar>
            <gtx-search-bar label="second" autofocus></gtx-search-bar>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('can be bound to a property',
        componentTest(() => TestComponent, `
            <gtx-input label="first" [autofocus]="!boolProp"></gtx-input>
            <gtx-input label="second" [autofocus]="boolProp"></gtx-input>`,
            (fixture, testComponent) => {
                testComponent.boolProp = true;
                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works for Select',
        componentTest(() => TestComponent, `
            <gtx-select label="first"></gtx-select>
            <gtx-select label="second" autofocus></gtx-select>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('gtx-select .select-input') as HTMLElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
            }
        )
    );

    it('works for Textarea',
        componentTest(() => TestComponent, `
            <gtx-textarea label="first"></gtx-textarea>
            <gtx-textarea label="second" autofocus></gtx-textarea>`,
            fixture => {
                let [first, second] = fixture.nativeElement.querySelectorAll('textarea') as HTMLTextAreaElement[];
                fixture.detectChanges();
                tick(50);

                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works with components in ngIf',
        componentTest(() => TestComponent, `
            <gtx-input label="first"></gtx-input>
            <div *ngIf="boolProp">
                <gtx-input label="second" autofocus></gtx-input>
            </div>`,
            (fixture, testComponent) => {
                testComponent.boolProp = false;
                fixture.detectChanges();
                tick(50);

                expect(fixture.nativeElement.querySelectorAll('input').length).toBe(1);

                tick(1000);
                testComponent.boolProp = true;
                fixture.detectChanges();
                tick(50);

                let [first, second] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];
                expect(isFocused(first)).toBe(false);
                expect(isFocused(second)).toBe(true);
                expect(second.autofocus).toBe(true, 'autofocus attribute not set');
            }
        )
    );

    it('works with components inside a modal',
        componentTest(() => TestComponent, `
            <gtx-overlay-host></gtx-overlay-host>`,
            (fixture, testComponent) => {
                let opened = false;
                testComponent.modalService.fromComponent(TestModal)
                    .then(modal => {
                        modal.open();
                        opened = true;

                        fixture.detectChanges();
                        tick(50);
                        let [first, second] = Array.from(modal.element.querySelectorAll('input'));

                        expect(isFocused(first)).toBe(false);
                        expect(isFocused(second)).toBe(true);
                        expect(second.autofocus).toBe(true, 'autofocus attribute not set');

                        modal.instance.closeFn(undefined);
                    });

                tick(50);
                expect(opened).toBe(true, 'was not opened');
            }
        )
    );

    it('automatically scrolls the focused element into view',
        componentTest(() => TestComponent, `
            <div style="height: 9999px"></div>
            <gtx-input autofocus></gtx-input>`,
            fixture => {
                let input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

                expect(isInView(input)).toBe(false);
                fixture.detectChanges();
                tick(50);
                expect(isInView(input)).toBe(true);
            }
        )
    );

});

function isFocused(element: Element): boolean {
    return document.activeElement === element;
}

function isInView(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const {clientHeight, clientLeft, clientTop, clientWidth} = document.documentElement;
    return rect.top < (clientTop + clientHeight)
        && rect.bottom >= clientTop
        && rect.left < (clientLeft + clientWidth)
        && rect.right >= clientLeft;
}



@Component({
    template: `<gtx-input></gtx-input>`
})
class TestComponent {
    boolProp: boolean = false;
    constructor(public modalService: ModalService) { }
}


@Component({
    template: `
        <div class="modal-content">
            <gtx-input label="first"></gtx-input>
            <gtx-input label="second" autofocus></gtx-input>
        </div>`
})
class TestModal implements IModalDialog {
    closeFn: any;
    cancelFn: any;
    registerCloseFn(close: any): void { this.closeFn = close; }
    registerCancelFn(cancel: any): void { this.cancelFn = cancel; }
}
