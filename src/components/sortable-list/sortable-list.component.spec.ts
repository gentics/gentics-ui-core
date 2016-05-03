import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {describe, expect, injectAsync, it} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {SortableList, ISortableEvent} from './sortable-list.component';



describe('SortableList:', () => {

    describe('sort() method', () => {

        /**
         * Returns the sort() function of the SortableList class, configured with the indexes supplied.
         */
        function getSortFn(fixture: ComponentFixture, oldIndex: number = 0, newIndex: number = 2): Function {
            let instance: SortableList = fixture.debugElement.query(By.css('gtx-sortable-list')).componentInstance;
            let event: ISortableEvent = <ISortableEvent> {
                oldIndex,
                newIndex
            };
            return instance.sortFactory(event);
        }

        it('should be a function', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let sortFn: any = getSortFn(fixture);
                    expect(typeof sortFn).toBe('function');
                });
        }));

        it('should return a new array be default', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture);
                    let sorted = sortFn(initial);
                    expect(initial).not.toBe(sorted);
                });
        }));

        it('should return the same array when byReference = true', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                return tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture) => {
                        let initial = [1, 2, 3];
                        let sortFn = getSortFn(fixture);
                        let sorted = sortFn(initial, true);
                        expect(initial).toBe(sorted);
                    });
            }));

        it('should sort a simple array', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [1, 2, 3];
                    let expected = [3, 2, 1];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                });
        }));


        it('should sort an array of objects', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [{ name: 'john' }, { name: 'joe' }, { name: 'mary' }];
                    let expected = [{ name: 'mary' }, { name: 'joe' }, { name: 'john' }];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                });
        }));

        it('should preserve array for undefined indexes', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [1, 2, 3];
                    let instance: SortableList = fixture
                        .debugElement.query(By.css('gtx-sortable-list')).componentInstance;
                    let sortFn = instance.sortFactory({});

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

        it('should preserve array for out-of-bound oldIndex', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 3, 1);

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

        it('should preserve array for out-of-bound newIndex', injectAsync([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 0, 3);

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

    });

    describe('disabled attribute:', () => {

        it('should bind to the sortable instance', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture) => {
                    fixture.detectChanges();
                    let sortable: Sortablejs.Sortable = fixture.debugElement
                        .query(By.css('gtx-sortable-list')).componentInstance.sortable;

                    expect(sortable.option('disabled')).toBe(false);

                    fixture.componentInstance.disabled = true;
                    fixture.detectChanges();

                    expect(sortable.option('disabled')).toBe(true);
                });
        }));
    });

});


@Component({
    template: `<gtx-sortable-list [disabled]="disabled"></gtx-sortable-list>`,
    directives: [SortableList]
})
class TestComponent {
    disabled: boolean = false;
}
