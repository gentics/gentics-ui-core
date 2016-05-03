import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {describe, expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {SearchBar} from './search-bar.component';

describe('SearchBar', () => {

    it('should fill input with value of the "query" prop', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
                expect(input.value).toBe('foo');
            });
    }));

    it('should emit the "search" event when button clicked',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

                    spyOn(testInstance, 'onSearch');
                    button.click();
                    tick();

                    expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit the "search" event when enter key pressed in input',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let searchBar: SearchBar = fixture.debugElement.query(By.css('gtx-search-bar')).componentInstance;
                    spyOn(testInstance, 'onSearch');

                    // Unable to test keyboard events directly - tried several approaches from
                    // http://stackoverflow.com/questions/596481/simulate-javascript-key-events,
                    // so we just directly invoke the class method.
                    searchBar.onKeyDown(<KeyboardEvent> { keyCode: 13 }, 'foo');
                    tick();

                    expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit the "change" event when input changed with "input" event',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    spyOn(testInstance, 'onChange');

                    let event: Event = document.createEvent('Event');
                    event.initEvent('input', true, true);
                    input.dispatchEvent(event);
                    tick();
                    tick();

                    expect(testInstance.onChange).toHaveBeenCalledWith('foo');
                });
        })));
});

@Component({
    template: `<gtx-search-bar query="foo" (search)="onSearch($event)" (change)="onChange($event)"></gtx-search-bar>`,
    directives: [SearchBar]
})
class TestComponent {
    onSearch(): void {}
    onChange(): void {}
}
