import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {componentTest} from '../../testing';
import {Button} from './button.component';


describe('Button:', () => {

    beforeEach(() => TestBed.configureTestingModule({
        declarations: [TestComponent, Button]
    }));

    it('is enabled by default',
        componentTest(() => TestComponent, fixture => {
            let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
            fixture.detectChanges();

            expect(button.disabled).toBe(false);
        })
    );

    it('binds the "disabled" property',
        componentTest(() => TestComponent, `
            <gtx-button [disabled]="true"></gtx-button>`,
            fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            }
        )
    );

    it('accepts string values for the "disabled" property',
        componentTest(() => TestComponent, `
            <gtx-button disabled="true"></gtx-button>`,
            fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                expect(button.disabled).toBe(true);
            }
        )
    );

    it('accepts an empty "disabled" property',
        componentTest(() => TestComponent, `
            <gtx-button disabled></gtx-button>`,
            fixture => {
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();
                expect(button.disabled).toBe(true);
            }
        )
    );

    it('forwards its "click" event when enabled',
        componentTest(() => TestComponent, `
            <gtx-button (click)="onClick($event)"></gtx-button>`,
            fixture => {
                let onClick = fixture.componentRef.instance.onClick = jasmine.createSpy('onClick');
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                let event = document.createEvent('MouseEvent');
                event.initEvent('click', true, true);

                button.dispatchEvent(event);
                button.parentElement.dispatchEvent(event);
                button.click();

                expect(onClick).toHaveBeenCalledTimes(3);
            }
        )
    );

    // Disabled elements don't fire mouse events in some browsers, but not all
    // http://stackoverflow.com/a/3100395/5460631
    it('does not forward "click" event when disabled',
        componentTest(() => TestComponent, `
            <gtx-button [disabled]="true" (click)="onClick($event)"></gtx-button>`,
            fixture => {
                let onClick = fixture.componentRef.instance.onClick = jasmine.createSpy('onClick');
                let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
                fixture.detectChanges();

                let event = document.createEvent('MouseEvent');
                event.initEvent('click', true, true);

                button.dispatchEvent(event);
                button.parentElement.dispatchEvent(event);
                button.click();

                expect(onClick).not.toHaveBeenCalled();
            }
        )
    );

});

@Component({
    template: `<gtx-button></gtx-button>`
})
class TestComponent {
    onClick(): void {}
}
