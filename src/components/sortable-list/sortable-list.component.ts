import {Component, Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges, HostBinding} from '@angular/core';
import * as Sortable from 'sortablejs';

export type sortFn<T> = (source: T[], byReference?: boolean) => T[];

/**
 * An augmented version of the event object returned by each of the Sortablejs callbacks, which can then be emitted up
 * to the consuming component.
 */
export interface ISortableEvent extends Sortable.SortableEvent {
    sort: sortFn<any>;
}

export interface ISortableMoveEvent extends Sortable.MoveEvent {
    sort: sortFn<any>;
}

export interface SortableInstance {
    el: HTMLElement;
    nativeDraggable: boolean;
    options: any;
}

export type PutPullType = true | false | 'clone';
export interface PutPullFn {
    (to: SortableInstance, from: SortableInstance): PutPullType;
}

export type ISortableGroupOptions = Sortable.GroupOptions;

export type SortableGroup = string | ISortableGroupOptions;

/**
 * Enables the creation of lists which can be re-ordered by dragging the items. Built on top of
 * [sortablejs](https://github.com/RubaXa/Sortable). Note that this component does not do the actual
 * sorting of the list data - this logic must be implemented by the consumer of the component. However,
 * this component provides a convenience `sort()` function which considerably simplifies this process - see below.
 *
 * ```html
 * <gtx-sortable-list (dragEnd)="sortList($event)">
 *     <gtx-sortable-item *ngFor="let item of items">
 *         <div>{{ item }}</div>
 *     </gtx-sortable-item>
 * </gtx-sortable-list>
 * ```
 *
 * ```typescript
 * items = ['foo', 'bar', 'baz'];
 * sortList(e: ISortableEvent): void {
 *     this.items = e.sort(this.items);
 * }
 * ```
 *
 * ##### `ISortableEvent`
 *
 * The `dragEnd` event emits an `ISortableEvent` object. For a full listing of its properties, see the source. Below
 * are the more important properties:
 *
 * | Property       | Type         | Description |
 * | --------       | ------------ | ----------- |
 * | **oldIndex**   | `number`     | The index in the list that the item started from |
 * | **newIndex**   | `number`     | The index in the list that the item was dropped |
 * | **sort()**     | `Function`   | A pre-configured sort function - see below |
 *
 * ##### `ISortableEvent.sort()`
 *
 * When the `dragEnd` event is fired, the event object exposes a `sort(array, byReference)` method. This is a convenience method for
 * sorting an array, so that the consumer of this component does not have to re-implement array sorting
 * each time the component is used.
 *
 * The sort function expects an array, and returns a new copy of that array, unless
 * `byReference === true`, in which case the original array is mutated and returned.
 *
 * ```typescript
 * items = [1, 2, 3, 4, 5];
 *
 * sortList(e: ISortableEvent): void {
 *     // assume that the 2nd item was dragged and dropped in the last place.
 *     this.items = e.sort(this.items);
 *     // this.items = [1, 3, 4, 5, 2]
 * }
 * ```
 */
@Component({
    selector: 'gtx-sortable-list',
    templateUrl: './sortable-list.tpl.html'
})
export class SortableList {

    /**
     * Set to true to disable sorting. i.e. items will no longer be draggable.
     */
    @Input() disabled: boolean = false;

    /**
     * Specify a group to allow dragging items between SortableLists. See
     * [the Sortable docs](https://github.com/RubaXa/Sortable/blob/473bd8fecfd2f2834e4187fb033dfa6912eb3b98/README.md#group-option)
     * for more information.
     */
    @Input() group: SortableGroup;

    /**
     * Invoked when an item is moved in the list or between lists. Return `false` to cancel the move.
     */
    @Input() onMove: (e: ISortableMoveEvent) => boolean;

    /**
     * Fired when an item drag is started.
     */
    @Output() dragStart = new EventEmitter<ISortableEvent>();

    /**
     * Fired when an item has been dragged and dropped to a new position in the list.
     */
    @Output() dragEnd = new EventEmitter<ISortableEvent>();

    /**
     * Fired when an item has been dropped onto this list from a different list.
     */
    @Output() addItem = new EventEmitter<ISortableEvent>();

    /**
     * Fired when creating a clone of element.
     */
    @Output() cloneItem = new EventEmitter<ISortableEvent>();


    /**
     * Fired when an item has been remove from this list to a different list.
     */
    @Output() removeItem = new EventEmitter<ISortableEvent>();

    @HostBinding('class.gtx-dragging') dragging = false;
    
    private sortable: Sortable;

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.sortable) {
            this.sortable.option('disabled', this.disabled);
        }
    }

    ngOnInit(): void {
        this.sortable = Sortable.create(this.elementRef.nativeElement, {
            animation: 150,
            setData: (dataTransfer: any, dragEl: Element): void => {},
            // dragging started
            onStart: (e: ISortableEvent): void => {
                this.dragging = true;
                this.dragStart.emit(e);
            },
            // dragging ended
            onEnd: (e: ISortableEvent): void => {
                e.sort = this.sortFactory(e);
                this.dragging = false;
                this.dragEnd.emit(e);
            },
            // Element is dropped into the list from another list
            onAdd: (e: ISortableEvent): void => {
                this.addItem.emit(e);
            },
            // Changed sorting within list
            onUpdate: (e: ISortableEvent): void => {},
            // Called by any change to the list (add / update / remove)
            onSort: (e: ISortableEvent): void => {},
            // Element is removed from the list into another list
            onRemove: (e: ISortableEvent): void => {
                this.removeItem.emit(e);
            },
            // Attempt to drag a filtered element
            onFilter: (e: ISortableEvent): void => {},
            // Event when you move an item in the list or between lists
            onMove: (e: ISortableMoveEvent): any => {
                if (typeof this.onMove === 'function') {
                    return this.onMove(e);
                }
            }
        });

        this.sortable.option('onClone', (e: ISortableEvent) => {
            this.cloneItem.emit(e);
        });

        if (this.group) {
            this.sortable.option('group', this.group);
        }
    }

    ngAfterContentInit(): void {
        let dragHandles = this.elementRef.nativeElement.querySelectorAll('gtx-drag-handle');
        if (dragHandles && 0 < dragHandles.length) {
            this.sortable.option('handle', '.gtx-drag-handle');
        }
    }

    /**
     * Returns a pre-configured sort function which uses the indexes of the sort operation.
     */
    sortFactory(e: ISortableEvent): sortFn<any> {
        return (source: any[], byReference: boolean = false) => {
            let result: any[] = byReference ? source : source.slice();
            let oldIndex: number = e.oldIndex;
            let newIndex: number = e.newIndex;

            // Check that index i is an integer
            const isInt = (i: any): boolean => Number(i) === i && i % 1 === 0;
            // Check that index i is within the bounds of the array
            const inBounds = (i: number): boolean => 0 <= i && i < result.length;
            // Valid if numeric and in bounds
            const valid = (i: any): boolean => isInt(i) && inBounds(i);

            if (oldIndex !== newIndex && valid(oldIndex) && valid(newIndex)) {
                result.splice(newIndex, 0, result.splice(oldIndex, 1)[0]);
            }

            return result;
        };
    }
}

@Directive({
    selector: 'gtx-sortable-item'
})
export class SortableItem {}


@Component({
    selector: 'gtx-drag-handle',
    template: `<div class="gtx-drag-handle"><i class="material-icons">drag_handle</i></div>`
})
export class SortableListDragHandle {}
