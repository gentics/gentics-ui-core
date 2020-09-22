import {Component, DebugElement, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
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
import { ConfigService, defaultConfig } from '../../module.config';

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

describe('SplitButtonComponent', () => {

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
            providers: [
                OverlayHostService,
                { provide: ConfigService, useValue: defaultConfig }
            ]
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
            tick();
            assertDisabledState(fixture, false);
        })
    );

    it('binds the "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('[disabled]="isDisabled"'),
            (fixture, testComponent) => {
                testComponent.isDisabled = true;
                fixture.detectChanges();
                tick();
                assertDisabledState(fixture, true);

                testComponent.isDisabled = false;
                fixture.detectChanges();
                tick();
                assertDisabledState(fixture, false);
            }
        )
    );

    it('accepts string values for the "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('disabled="true"'),
            fixture => {
                fixture.detectChanges();
                tick();
                assertDisabledState(fixture, true);
            }
        )
    );

    it('accepts an empty "disabled" property',
        componentTest(() => TestComponent, assembleTemplate('disabled'),
            fixture => {
                fixture.detectChanges();
                tick();
                assertDisabledState(fixture, true);
            }
        )
    );

    it('is not flat by default',
        componentTest(() => TestComponent,
            fixture => {
                fixture.detectChanges();
                tick();
                assertFlatState(fixture, false);
            }
        )
    );

    it('"flat" works',
        componentTest(() => TestComponent, assembleTemplate('flat'),
            fixture => {
                fixture.detectChanges();
                tick();
                assertFlatState(fixture, true);
            }
        )
    );

    it('shows the dropdown trigger and a spacer line when there are secondary actions',
        componentTest(() => TestComponent, fixture => {
            fixture.detectChanges();
            tick();
            expect(fixture.nativeElement.querySelector('.spacer-line')).toBeTruthy();
            expect(fixture.nativeElement.querySelector('.more-trigger')).toBeTruthy();
        })
    );

    it('primary action works by clicking the button',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();
            tick();

            const button: HTMLButtonElement = fixture.nativeElement.querySelector('.primary-button button');
            button.click();
            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(0);
            testComponent.onClick.calls.reset();

            const event = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            button.dispatchEvent(event);
            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(0);
        })
    );

    it('primary action works by clicking the button\'s content and does not fire the click event twice',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();
            tick();

            const primaryAction = fixture.debugElement.query(By.directive(SplitButtonPrimaryAction));
            primaryAction.nativeElement.click();
            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(0);
            testComponent.onClick.calls.reset();

            const textContent = (primaryAction.nativeElement as HTMLElement).childNodes[0];
            const event = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            textContent.dispatchEvent(event);
            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(0);
        })
    );

    it('secondary actions work',
        componentTest(() => TestComponent, (fixture, testComponent) => {
            fixture.detectChanges();
            tick();

            // Open the dropdown list.
            const moreTrigger: HTMLButtonElement = fixture.nativeElement.querySelector('.more-trigger button');
            moreTrigger.click();
            fixture.detectChanges();
            tick();

            // Click the second item.
            const secondaryActions = fixture.debugElement.queryAll(By.directive(DropdownItem));
            expect(secondaryActions).toBeTruthy();
            expect(secondaryActions.length).toBe(2);
            secondaryActions[1].nativeElement.click();

            expect(testComponent.onClick).toHaveBeenCalledTimes(1);
            expect(testComponent.onClick).toHaveBeenCalledWith(2);
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
                tick();

                expect(fixture.debugElement.queryAll(By.directive(Button)).length).toBe(1);
                expect(fixture.nativeElement.querySelector('.spacer-line')).toBeFalsy();
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

function assertFlatState(fixture: ComponentFixture<TestComponent>, expectedState: boolean): void {
    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.directive(Button));
    expect(buttons.length).toBe(2);
    expect(!!fixture.componentInstance.splitButton.flat).toBe(expectedState);
    buttons.forEach(button => expect(!!button.componentInstance.flat).toBe(expectedState));
}

@Component({
    template: assembleTemplate()
})
class TestComponent {

    @ViewChild('testButton', { static: true })
    splitButton: SplitButton;

    isDisabled: boolean;

    onClick = jasmine.createSpy('onClick').and.stub();

}
