import {Component, DebugElement, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

import {componentTest} from '../../testing';
import {Button} from '../button/button.component';
import {DropdownContentWrapper} from '../dropdown-list/dropdown-content-wrapper.component';
import {DropdownContent} from '../dropdown-list/dropdown-content.component';
import {DropdownItem} from '../dropdown-list/dropdown-item.component';
import {DropdownList} from '../dropdown-list/dropdown-list.component';
import {DropdownTriggerDirective} from '../dropdown-list/dropdown-trigger.directive';
import {ScrollMask} from '../dropdown-list/scroll-mask.component';
import {Icon} from '../icon/icon.directive';
import {OverlayHost} from '../overlay-host/overlay-host.component';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {SplitButtonPrimaryAction} from './split-button-primary-action.component';
import {SplitButton} from './split-button.component';

function assembleTemplate(additionalButtonTpl: string = ''): string {
    return `
        <gtx-split-button #testButton ${additionalButtonTpl}>
            <gtx-split-button-primary-action (click)="onClick(0)">Primary Action</gtx-split-button-primary-action>
            <gtx-dropdown-item (click)="onClick(1)">Secondary Action 1</gtx-dropdown-item>
            <gtx-dropdown-item (click)="onClick(2)">Secondary Action 2</gtx-dropdown-item>
        </gtx-split-button>
        <gtx-overlay-host></gtx-overlay-host>
    `;
}

fdescribe('SplitButtonComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [
                Button,
                DropdownContent,
                DropdownContentWrapper,
                DropdownItem,
                DropdownList,
                DropdownTriggerDirective,
                Icon,
                OverlayHost,
                ScrollMask,
                SplitButton,
                SplitButtonPrimaryAction,
                TestComponent
            ],
            providers: [ OverlayHostService ]
        });
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DropdownContentWrapper, ScrollMask]
            }
        });
    });

    it('is enabled by default',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            assertDisabledState(fixture, false);
        })
    );

    it('binds the "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('[disabled]="isDisabled"'),
            (fixture, testComponent) => {
                testComponent.isDisabled = true;
                fixture.detectChanges();
                assertDisabledState(fixture, true);

                testComponent.isDisabled = false;
                fixture.detectChanges();
                assertDisabledState(fixture, false);
            }
        )
    );

    it('accepts string values for the "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('disabled="true"'),
            fixture => {
                fixture.detectChanges();
                assertDisabledState(fixture, true);
            }
        )
    );

    it('accepts an empty "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('disabled'),
            fixture => {
                fixture.detectChanges();
                assertDisabledState(fixture, true);
            }
        )
    );

    it('primary action works',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();
            let button: HTMLButtonElement = fixture.nativeElement.querySelector('.primary-button button');
            button.click();
            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(0);
        })
    );

    it('secondary actions work',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();

        })
    );

    it('does not display the dropdown trigger if there are no secondary actions',
        componentTest(() => TestComponent, `
            <gtx-split-button #testButton>
                <gtx-split-button-primary-action (click)="onClick(0)">Primary Action</gtx-split-button-primary-action>
            </gtx-split-button>
            <gtx-overlay-host></gtx-overlay-host>`,
            fixture => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.directive(Button)).length).toBe(1);
                const moreTrigger: HTMLButtonElement = fixture.nativeElement.querySelector('.more-trigger');
                expect(moreTrigger).toBeFalsy();
            })
    );

});

function assertDisabledState(fixture: ComponentFixture<TestComponent>, expectedState: boolean): void {
    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.directive(Button));
    expect(buttons.length).toBe(2);
    expect(!!fixture.componentInstance.splitButton.disabled).toBe(expectedState);
    buttons.forEach(button => expect(!!button.componentInstance.disabled).toBe(expectedState));
}

@Component({
    template: assembleTemplate()
})
class TestComponent {

    @ViewChild('testButton')
    splitButton: SplitButton;

    isDisabled: boolean;

    onClick = jasmine.createSpy('onClick').and.stub();

}

