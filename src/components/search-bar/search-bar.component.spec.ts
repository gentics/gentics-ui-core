import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {describe, expect, fakeAsync, inject, it, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {SearchBar} from './search-bar.component';

describe('SearchBar', () => {

    it('should fill input with value of the "query" prop', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
                expect(input.value).toBe('foo');
            });
    }));

    it('should default to empty string if query not defined', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<gtx-search-bar></gtx-search-bar>`)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
                expect(input.value).toBe('');
            });
    }));

    it('should not display the clear button when query is empty',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `<gtx-search-bar [query]="query"></gtx-search-bar>`)
                .createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    const getButton = (): HTMLButtonElement => fixture.nativeElement
                        .querySelector('.clear-button button');

                    expect(getButton()).toBeNull();

                    fixture.componentInstance.query = 'foo';
                    fixture.detectChanges();

                    expect(getButton()).not.toBeNull();
                });
        })));

    it('should emit the "search" event when button clicked',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let button: HTMLButtonElement = fixture.nativeElement.querySelector('.submit-button button');

                    spyOn(testInstance, 'onSearch');
                    button.click();
                    tick();

                    expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit the "clear" event when button clicked',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let button: HTMLButtonElement = fixture.nativeElement.querySelector('.clear-button button');

                    spyOn(testInstance, 'onClear');
                    button.click();
                    tick();

                    expect(testInstance.onClear).toHaveBeenCalledWith(true);
                });
        })));

    it('should emit the "search" event when enter key pressed in input',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let searchBar: SearchBar = fixture.debugElement.query(By.css('gtx-search-bar')).componentInstance;
                    spyOn(testInstance, 'onSearch');

                    // Unable to test keyboard events directly - tried several approaches from
                    // http://stackoverflow.com/questions/596481/simulate-javascript-key-events,
                    // so we just directly invoke the class method.
                    (<Function> searchBar.onKeyDown)(<KeyboardEvent> { keyCode: 13 }, 'foo');
                    tick();

                    expect(testInstance.onSearch).toHaveBeenCalledWith('foo');
                });
        })));

    it('should emit the "change" event when input changed with "input" event',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
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

    it('should not emit the "change" event when input blurred',
        inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let testInstance: TestComponent = fixture.componentInstance;
                    let input: HTMLInputElement = fixture.nativeElement.querySelector('input');
                    spyOn(testInstance, 'onChange');

                    let event: Event = document.createEvent('Event');
                    event.initEvent('blur', true, true);
                    input.dispatchEvent(event);
                    tick();
                    tick();

                    expect(testInstance.onChange).not.toHaveBeenCalled();
                });
        })));
});

@Component({
    template: `<gtx-search-bar query="foo" 
                               (search)="onSearch($event)" 
                               (change)="onChange($event)"
                               (clear)="onClear($event)"></gtx-search-bar>`,
    directives: [SearchBar]
})
class TestComponent {
    query: string = '';
    onSearch(): void {}
    onChange(): void {}
    onClear(): void {}
}
