import {Component} from '@angular/core';
import {inject} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {By} from '@angular/platform-browser';

import {SortableList, ISortableEvent} from './sortable-list.component';


describe('SortableList:', () => {

    describe('sort() method', () => {

        /**
         * Returns the sort() function of the SortableList class, configured with the indexes supplied.
         */
        function getSortFn(fixture: ComponentFixture<TestComponent>, oldIndex: number = 0, newIndex: number = 2): Function {
            let instance: SortableList = fixture.debugElement.query(By.css('gtx-sortable-list')).componentInstance;
            let event: ISortableEvent = <ISortableEvent> {
                oldIndex,
                newIndex
            };
            return instance.sortFactory(event);
        }

        it('should be a function', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let sortFn: any = getSortFn(fixture);
                    expect(typeof sortFn).toBe('function');
                });
        }));

        it('should return a new array be default', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture);
                    let sorted = sortFn(initial);
                    expect(initial).not.toBe(sorted);
                });
        }));

        it('should return the same array when byReference = true', inject([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture: ComponentFixture<TestComponent>) => {
                        let initial = [1, 2, 3];
                        let sortFn = getSortFn(fixture);
                        let sorted = sortFn(initial, true);
                        expect(initial).toBe(sorted);
                    });
            }));

        it('should sort a simple small array', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let expected = [2, 3, 1];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                });
        }));

        it('should sort a simple large array', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    let expected = [1, 2, 3, 5, 6, 7, 4, 8, 9, 10];
                    let sortFn = getSortFn(fixture, 3, 6);

                    expect(sortFn(initial)).toEqual(expected);
                });
        }));


        it('should sort an array of objects', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [{ name: 'john' }, { name: 'joe' }, { name: 'mary' }];
                    let expected = [{ name: 'joe' }, { name: 'mary' }, { name: 'john' }];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                });
        }));

        it('should preserve array for undefined indexes', inject([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let instance: SortableList = fixture
                        .debugElement.query(By.css('gtx-sortable-list')).componentInstance;
                    let sortFn = instance.sortFactory(<ISortableEvent> {});

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

        it('should preserve array for out-of-bound oldIndex', inject([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 3, 1);

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

        it('should preserve array for out-of-bound newIndex', inject([TestComponentBuilder],
            (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 0, 3);

                    expect(sortFn(initial)).toEqual(initial);
                });
        }));

    });

    describe('disabled attribute:', () => {

        it('should bind to the sortable instance', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
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
