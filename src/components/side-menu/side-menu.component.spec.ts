import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    injectAsync,
    it,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {SideMenu} from './side-menu.component';

describe('SideMenu', () => {

    it('should not have the "opened" class when closed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let menu: HTMLElement = getMenuElement(fixture);
                fixture.detectChanges();

                expect(menu.classList.contains('opened')).toBe(false);
            });
    }));

    it('should have the "opened" class when open', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                let testInstance: TestComponent = fixture.componentInstance;
                let menu: HTMLElement = getMenuElement(fixture);
                testInstance.menuVisible = true;
                fixture.detectChanges();

                expect(menu.classList.contains('opened')).toBe(true);
            });
    }));

    describe('SideMenuToggleButton', () => {

        it('should not have the "active" class when closed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let button: HTMLElement = getToggleButtonElement(fixture);
                    fixture.detectChanges();

                    expect(button.classList.contains('active')).toBe(false);
                });
        }));

        it('should have the "active" class when open', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let testInstance: TestComponent = fixture.componentInstance;
                    let button: HTMLElement = getToggleButtonElement(fixture);
                    testInstance.menuVisible = true;
                    fixture.detectChanges();

                    expect(button.classList.contains('active')).toBe(true);
                });
        }));

        it('clicking toggle button should invoke "toggle()" callback with new state',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        let testInstance: TestComponent = fixture.componentInstance;
                        let buttonDel: DebugElement = getToggleButtonDebugElement(fixture);
                        spyOn(testInstance, 'menuChanged');
                        testInstance.menuVisible = true;
                        fixture.detectChanges();
                        buttonDel.triggerEventHandler('click', null);
                        tick();

                        expect(testInstance.menuChanged).toHaveBeenCalledWith(false);
                    });
            }))
        );

    });

    it('clicking overlay should invoke "toggle()" callback with new state',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let testInstance: TestComponent = fixture.componentInstance;
                    let overlay: HTMLElement = fixture.nativeElement.querySelector('.side-menu-overlay');
                    spyOn(testInstance, 'menuChanged');
                    testInstance.menuVisible = true;
                    fixture.detectChanges();
                    overlay.click();
                    tick();

                    expect(testInstance.menuChanged).toHaveBeenCalledWith(false);
                });
        }))
    );

    it('clicking overlay when opened === false should not invoke "toggle()"',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let testInstance: TestComponent = fixture.componentInstance;
                    let overlay: HTMLElement = fixture.nativeElement.querySelector('.side-menu-overlay');
                    spyOn(testInstance, 'menuChanged');
                    fixture.detectChanges();
                    overlay.click();
                    tick();

                    expect(testInstance.menuChanged).not.toHaveBeenCalled();
                });
        }))
    );

});

@Component({
    template: `<gtx-side-menu [opened]="menuVisible" (toggle)="menuChanged($event)"></gtx-side-menu>`,
    directives: [SideMenu]
})
class TestComponent {
    menuVisible: boolean = false;
    menuChanged() : void {}
}

// Helper functions

function getMenuElement(fixture: ComponentFixture): HTMLElement {
    return fixture.debugElement.query(By.css('gtx-side-menu')).nativeElement;
}
function getToggleButtonElement(fixture: ComponentFixture): HTMLElement {
    return getToggleButtonDebugElement(fixture).nativeElement;
}
function getToggleButtonDebugElement(fixture: ComponentFixture): DebugElement {
    return fixture.debugElement.query(By.css('gtx-side-menu-toggle-button'));
}
