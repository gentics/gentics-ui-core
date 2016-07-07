import {Component, DebugElement} from '@angular/core';
import {async, fakeAsync, inject, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';
import {SideMenu} from './side-menu.component';

describe('SideMenu', () => {

    it('should not have the "opened" class when closed',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let menu: HTMLElement = getMenuElement(fixture);
                fixture.detectChanges();

                expect(menu.classList).not.toContain('opened');
            })
        ))
    );

    it('should have the "opened" class when open',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let testInstance: TestComponent = fixture.componentInstance;
                let menu: HTMLElement = getMenuElement(fixture);
                testInstance.menuVisible = true;
                fixture.detectChanges();

                expect(menu.classList).toContain('opened');
            })
        ))
    );

    describe('SideMenuToggleButton', () => {

        it('should not have the "active" class when closed',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then(fixture => {
                    let button: HTMLElement = getToggleButtonElement(fixture);
                    fixture.detectChanges();

                    expect(button.classList).not.toContain('active');
                })
            ))
        );

        it('should have the "active" class when open',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then(fixture => {
                    let testInstance: TestComponent = fixture.componentInstance;
                    let button: HTMLElement = getToggleButtonElement(fixture);
                    testInstance.menuVisible = true;
                    fixture.detectChanges();

                    expect(button.classList).toContain('active');
                })
            ))
        );

        it('clicking toggle button should invoke "toggle()" callback with new state',
            fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then(fixture => {
                    let testInstance: TestComponent = fixture.componentInstance;
                    let buttonDel: DebugElement = getToggleButtonDebugElement(fixture);
                    spyOn(testInstance, 'menuChanged');
                    testInstance.menuVisible = true;
                    fixture.detectChanges();
                    buttonDel.triggerEventHandler('click', null);
                    tick();

                    expect(testInstance.menuChanged).toHaveBeenCalledWith(false);
                })
            ))
        );

    });

    it('clicking overlay should invoke "toggle()" callback with new state',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let testInstance: TestComponent = fixture.componentInstance;
                let overlay: HTMLElement = fixture.nativeElement.querySelector('.side-menu-overlay');
                spyOn(testInstance, 'menuChanged');
                testInstance.menuVisible = true;
                fixture.detectChanges();
                overlay.click();
                tick();


                expect(testInstance.menuChanged).toHaveBeenCalledWith(false);
                tick(500);
            })
        ))
    );

    it('clicking overlay when opened === false should not invoke "toggle()"',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                let testInstance: TestComponent = fixture.componentInstance;
                let overlay: HTMLElement = fixture.nativeElement.querySelector('.side-menu-overlay');
                spyOn(testInstance, 'menuChanged');
                fixture.detectChanges();
                overlay.click();
                tick();

                expect(testInstance.menuChanged).not.toHaveBeenCalled();
                tick(500);
            })
        ))
    );

});

@Component({
    template: `
        <gtx-side-menu [opened]="menuVisible" (toggle)="menuChanged($event)">
        </gtx-side-menu>`,
    directives: [SideMenu]
})
class TestComponent {
    menuVisible: boolean = false;
    menuChanged(): void {}
}

// Helper functions

function getMenuElement(fixture: ComponentFixture<TestComponent>): HTMLElement {
    return fixture.debugElement.query(By.css('gtx-side-menu')).nativeElement;
}
function getToggleButtonElement(fixture: ComponentFixture<TestComponent>): HTMLElement {
    return getToggleButtonDebugElement(fixture).nativeElement;
}
function getToggleButtonDebugElement(fixture: ComponentFixture<TestComponent>): DebugElement {
    return fixture.debugElement.query(By.css('gtx-side-menu-toggle-button'));
}
