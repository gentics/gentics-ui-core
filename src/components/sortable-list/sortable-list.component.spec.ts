import {TestBed, ComponentFixture} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import * as Sortable from 'sortablejs';

import {componentTest} from '../../testing';
import {SortableList, ISortableEvent} from './sortable-list.component';

describe('SortableList:', () => {

    beforeEach(() => TestBed.configureTestingModule({
    declarations: [SortableList, TestComponent],
    teardown: { destroyAfterEach: false }
}));

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

        it('is a function',
            componentTest(() => TestComponent, fixture => {
                let sortFn: any = getSortFn(fixture);
                expect(typeof sortFn).toBe('function');
            })
        );

        it('returns a new array by default',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let sortFn = getSortFn(fixture);
                let sorted = sortFn(initial);
                expect(initial).not.toBe(sorted);
            })
        );

        it('returns the same array when byReference = true',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let sortFn = getSortFn(fixture);
                let sorted = sortFn(initial, true);
                expect(initial).toBe(sorted);
            })
        );

        it('sorts a simple small array',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let expected = [2, 3, 1];
                let sortFn = getSortFn(fixture);

                expect(sortFn(initial)).toEqual(expected);
            })
        );

        it('sorts a simple large array',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                let expected = [1, 2, 3, 5, 6, 7, 4, 8, 9, 10];
                let sortFn = getSortFn(fixture, 3, 6);

                expect(sortFn(initial)).toEqual(expected);
            })
        );

        it('sorts an array of objects',
            componentTest(() => TestComponent, fixture => {
                let initial = [{ name: 'john' }, { name: 'joe' }, { name: 'mary' }];
                let expected = [{ name: 'joe' }, { name: 'mary' }, { name: 'john' }];
                let sortFn = getSortFn(fixture);

                expect(sortFn(initial)).toEqual(expected);
            })
        );

        it('outputs the input array when undefined index values are passed',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let instance: SortableList = fixture.componentInstance.listInstance;
                let sortFn = instance.sortFactory(<ISortableEvent> {});

                expect(sortFn(initial)).toEqual(initial);
            })
        );

        it('outputs the input array for out-of-bound oldIndex',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let sortFn = getSortFn(fixture, 3, 1);

                expect(sortFn(initial)).toEqual(initial);
            })
        );

        it('outputs the input array for out-of-bound newIndex',
            componentTest(() => TestComponent, fixture => {
                let initial = [1, 2, 3];
                let sortFn = getSortFn(fixture, 0, 3);

                expect(sortFn(initial)).toEqual(initial);
            })
        );

    });

    describe('disabled attribute:', () => {

        it('is forwarded to the options of its sortable instance',
            componentTest(() => TestComponent, (fixture, instance) => {
                fixture.detectChanges();
                let sortable: Sortable = (instance.listInstance as any).sortable;

                expect(sortable.option('disabled')).toBe(false);

                fixture.componentInstance.disabled = true;
                fixture.detectChanges();

                expect(sortable.option('disabled')).toBe(true);
            })
        );

    });

});


@Component({
    template: `<gtx-sortable-list [disabled]="disabled"></gtx-sortable-list>`
})
class TestComponent {
    disabled: boolean = false;
    @ViewChild(SortableList, { static: true }) listInstance: SortableList;
}
