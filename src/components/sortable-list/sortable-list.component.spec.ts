import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {async, inject} from '@angular/core/testing';

import {SortableList, ISortableEvent} from './sortable-list.component';


describe('SortableList:', () => {

    describe('sort() method', () => {

        /**
         * Returns the sort() function of the SortableList class, configured with the indexes supplied.
         */
        function getSortFn(fixture: ComponentFixture<TestComponent>, oldIndex: number = 0, newIndex: number = 2): Function {
            let instance: SortableList = fixture.componentInstance.listInstance;
            let event: ISortableEvent = <ISortableEvent> {
                oldIndex,
                newIndex
            };
            return instance.sortFactory(event);
        }

        it('should be a function',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let sortFn: any = getSortFn(fixture);
                    expect(typeof sortFn).toBe('function');
                })
            ))
        );

        it('should return a new array be default',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture);
                    let sorted = sortFn(initial);
                    expect(initial).not.toBe(sorted);
                })
            ))
        );

        it('should return the same array when byReference = true',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture);
                    let sorted = sortFn(initial, true);
                    expect(initial).toBe(sorted);
                })
            ))
        );

        it('should sort a simple small array',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let expected = [2, 3, 1];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                })
            ))
        );

        it('should sort a simple large array',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    let expected = [1, 2, 3, 5, 6, 7, 4, 8, 9, 10];
                    let sortFn = getSortFn(fixture, 3, 6);

                    expect(sortFn(initial)).toEqual(expected);
                })
            ))
        );

        it('should sort an array of objects',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [{ name: 'john' }, { name: 'joe' }, { name: 'mary' }];
                    let expected = [{ name: 'joe' }, { name: 'mary' }, { name: 'john' }];
                    let sortFn = getSortFn(fixture);

                    expect(sortFn(initial)).toEqual(expected);
                })
            ))
        );

        it('should preserve array for undefined indexes',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let instance: SortableList = fixture.componentInstance.listInstance;
                    let sortFn = instance.sortFactory(<ISortableEvent> {});

                    expect(sortFn(initial)).toEqual(initial);
                })
            ))
        );

        it('should preserve array for out-of-bound oldIndex',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 3, 1);

                    expect(sortFn(initial)).toEqual(initial);
                })
            ))
        );

        it('should preserve array for out-of-bound newIndex',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    let initial = [1, 2, 3];
                    let sortFn = getSortFn(fixture, 0, 3);

                    expect(sortFn(initial)).toEqual(initial);
                })
            ))
        );

    });

    describe('disabled attribute:', () => {

        it('should bind to the sortable instance',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.createAsync(TestComponent)
                .then((fixture: ComponentFixture<TestComponent>) => {
                    fixture.detectChanges();
                    let sortable: Sortablejs.Sortable = fixture.componentInstance.listInstance.sortable;

                    expect(sortable.option('disabled')).toBe(false);

                    fixture.componentInstance.disabled = true;
                    fixture.detectChanges();

                    expect(sortable.option('disabled')).toBe(true);
                })
            ))
        );

    });

});


@Component({
    template: `<gtx-sortable-list [disabled]="disabled"></gtx-sortable-list>`,
    directives: [SortableList]
})
class TestComponent {
    disabled: boolean = false;
    @ViewChild(SortableList) listInstance: SortableList;
}
