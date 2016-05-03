import { ElementRef, EventEmitter } from '@angular/core';
export declare type sortFn<T> = (source: T[], byReference?: boolean) => T[];
/**
 * The event object returned by each of the Sortablejs callbacks, which can then be emitted up
 * to the consuming component.
 */
export interface ISortableEvent {
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    clone: any;
    currentTarget: any;
    defaultPrevented: boolean;
    eventPhase: number;
    from: Element;
    isTrusted: boolean;
    item: Element;
    newIndex: number;
    oldIndex: number;
    path: Element[];
    returnValue: any;
    srcElement: Element;
    target: Element;
    timeStamp: number;
    to: Element;
    type: 'start' | 'move' | 'sort' | 'update' | 'end' | 'add' | 'remove' | 'filter';
    sort: sortFn<any>;
}
export interface ISortableMoveEvent extends ISortableEvent {
    dragged: Element;
    draggedRect: ClientRect;
    related: Element;
    relatedRect: ClientRect;
}
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
export declare class SortableList {
    private elementRef;
    /**
     * Set to true to disable sorting. i.e. items will no longer be draggable.
     */
    disabled: boolean;
    /**
     * Fired when an item has been dragged and dropped to a new position in the list.
     */
    dragEnd: EventEmitter<ISortableEvent>;
    sortable: Sortablejs.Sortable;
    constructor(elementRef: ElementRef);
    ngOnChanges(): void;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    /**
     * Returns a pre-configured sort function which uses the indexes of the sort operation.
     */
    sortFactory(e: ISortableEvent): sortFn<any>;
    /**
     * Remove the default browser drag image, to give the impression that movement
     * is locked to the vertical axis.
     */
    private setInvisibleDragImage(dataTransfer);
}
export declare class SortableListDragHandle {
}
