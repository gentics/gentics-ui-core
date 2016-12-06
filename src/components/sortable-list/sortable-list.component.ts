import {Component, Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
const sortable: typeof Sortablejs.Sortable = require('sortablejs');

export type sortFn<T> = (source: T[], byReference?: boolean) => T[];

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
     * Fired when an item has been dragged and dropped to a new position in the list.
     */
    @Output() dragEnd = new EventEmitter<ISortableEvent>();

    sortable: Sortablejs.Sortable;

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.sortable) {
            this.sortable.option('disabled', this.disabled);
        }
    }

    ngOnInit(): void {
        this.sortable = sortable.create(this.elementRef.nativeElement, {
            animation: 150,
            setData: (dataTransfer: any, dragEl: Element): void => {
                this.setInvisibleDragImage(dataTransfer);
            },
            // dragging started
            onStart: (e: ISortableEvent): void => {},
            // dragging ended
            onEnd: (e: ISortableEvent): void => {
                e.sort = this.sortFactory(e);
                this.dragEnd.emit(e);
            },
            // Element is dropped into the list from another list
            onAdd: (e: ISortableEvent): void => {},
            // Changed sorting within list
            onUpdate: (e: ISortableEvent): void => {},
            // Called by any change to the list (add / update / remove)
            onSort: (e: ISortableEvent): void => {},
            // Element is removed from the list into another list
            onRemove: (e: ISortableEvent): void => {},
            // Attempt to drag a filtered element
            onFilter: (e: ISortableEvent): void => {},
            // Event when you move an item in the list or between lists
            onMove: (e: ISortableMoveEvent): boolean => {
                // Example: http://jsbin.com/tuyafe/1/edit?js,output
                e.dragged; // dragged HTMLElement
                e.draggedRect; // TextRectangle {left, top, right и bottom}
                e.related; // HTMLElement on which have guided
                e.relatedRect; // TextRectangle
                // return false; — for cancel
                return true;
            }
        });
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

    /**
     * Remove the default browser drag image, to give the impression that movement
     * is locked to the vertical axis.
     */
    private setInvisibleDragImage(dataTransfer: any): void {
        // Current IE and Edge do not support .setDragImage()
        if (dataTransfer.setDragImage !== undefined) {
            let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.createElement('canvas');
            canvas.width = canvas.height = 0;
            dataTransfer.setData('text', 'Data to Drag');
            dataTransfer.setDragImage(canvas, 25, 25);
        }
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
