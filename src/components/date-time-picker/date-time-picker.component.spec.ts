import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    flushMicrotasks,
    injectAsync,
    it,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {DateTimePicker} from './date-time-picker.component';

describe('DateTimePicker:', () => {

    it('should bind the label', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker label="test"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let label: HTMLLabelElement = fixture.nativeElement.querySelector('label');

                expect(label.innerText.trim()).toBe('test');
                fixture.destroy();
            });
    }));

    it('should be empty if timestamp is not set', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, `<gtx-date-time-picker></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                expect(input.value.trim()).toBe('');
                fixture.destroy();
            });
    }));

    it('should format the timestamp without time', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent,
                `<gtx-date-time-picker timestamp="1457971763" displayTime="false"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                expect(input.value.trim()).toBe('14/03/2016');
                fixture.destroy();
            });
    }));

    it('should format the timestamp with time', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent,
                `<gtx-date-time-picker timestamp="1457971763" displayTime="true"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                expect(input.value.trim()).toBe('14/03/2016, 17:09:23');
                fixture.destroy();
            });
    }));

    it('should format the timestamp with custom format string', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent,
                `<gtx-date-time-picker timestamp="1457971763" format="YY-MM-ddd"></gtx-date-time-picker>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.nativeElement.querySelector('input');

                expect(input.value.trim()).toBe('16-03-Mon');
                fixture.destroy();
            });
    }));

});

@Component({
    template: `<gtx-date-time-picker></gtx-date-time-picker>`,
    directives: [DateTimePicker]
})
class TestComponent {
    showModal: boolean = false;
    onClose(): void {}
}
