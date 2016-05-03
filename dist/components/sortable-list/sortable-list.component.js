"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var sortable = require('sortablejs');
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
var SortableList = (function () {
    function SortableList(elementRef) {
        this.elementRef = elementRef;
        /**
         * Set to true to disable sorting. i.e. items will no longer be draggable.
         */
        this.disabled = false;
        /**
         * Fired when an item has been dragged and dropped to a new position in the list.
         */
        this.dragEnd = new core_1.EventEmitter();
    }
    SortableList.prototype.ngOnChanges = function () {
        if (this.sortable) {
            this.sortable.option('disabled', this.disabled);
        }
    };
    SortableList.prototype.ngOnInit = function () {
        var _this = this;
        this.sortable = sortable.create(this.elementRef.nativeElement, {
            animation: 150,
            setData: function (dataTransfer, dragEl) {
                _this.setInvisibleDragImage(dataTransfer);
            },
            // dragging started
            onStart: function (e) { },
            // dragging ended
            onEnd: function (e) {
                e.sort = _this.sortFactory(e);
                _this.dragEnd.emit(e);
            },
            // Element is dropped into the list from another list
            onAdd: function (e) { },
            // Changed sorting within list
            onUpdate: function (e) { },
            // Called by any change to the list (add / update / remove)
            onSort: function (e) { },
            // Element is removed from the list into another list
            onRemove: function (e) { },
            // Attempt to drag a filtered element
            onFilter: function (e) { },
            // Event when you move an item in the list or between lists
            onMove: function (e) {
                // Example: http://jsbin.com/tuyafe/1/edit?js,output
                e.dragged; // dragged HTMLElement
                e.draggedRect; // TextRectangle {left, top, right и bottom}
                e.related; // HTMLElement on which have guided
                e.relatedRect; // TextRectangle
                // return false; — for cancel
            }
        });
    };
    SortableList.prototype.ngAfterContentInit = function () {
        var dragHandles = this.elementRef.nativeElement.querySelectorAll('gtx-drag-handle');
        if (dragHandles && 0 < dragHandles.length) {
            this.sortable.option('handle', '.gtx-drag-handle');
        }
    };
    /**
     * Returns a pre-configured sort function which uses the indexes of the sort operation.
     */
    SortableList.prototype.sortFactory = function (e) {
        return function (source, byReference) {
            if (byReference === void 0) { byReference = false; }
            var result = byReference ? source : source.slice();
            var oldIndex = e.oldIndex;
            var newIndex = e.newIndex;
            // Check that index i is an integer
            var isInt = function (i) { return Number(i) === i && i % 1 === 0; };
            // Check that index i is within the bounds of the array
            var inBounds = function (i) { return 0 <= i && i < result.length; };
            // Valid if numeric and in bounds
            var valid = function (i) { return isInt(i) && inBounds(i); };
            if (oldIndex !== newIndex && valid(oldIndex) && valid(newIndex)) {
                var item = result[newIndex];
                result[newIndex] = result[oldIndex];
                result[oldIndex] = item;
            }
            return result;
        };
    };
    /**
     * Remove the default browser drag image, to give the impression that movement
     * is locked to the vertical axis.
     */
    SortableList.prototype.setInvisibleDragImage = function (dataTransfer) {
        // Current IE and Edge do not support .setDragImage()
        if (dataTransfer.setDragImage !== undefined) {
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 0;
            dataTransfer.setData('text', 'Data to Drag');
            dataTransfer.setDragImage(canvas, 25, 25);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SortableList.prototype, "disabled", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SortableList.prototype, "dragEnd", void 0);
    SortableList = __decorate([
        core_1.Component({
            selector: 'gtx-sortable-list',
            template: require('./sortable-list.tpl.html')
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SortableList);
    return SortableList;
}());
exports.SortableList = SortableList;
var SortableListDragHandle = (function () {
    function SortableListDragHandle() {
    }
    SortableListDragHandle = __decorate([
        core_1.Component({
            selector: 'gtx-drag-handle',
            template: "<div class=\"gtx-drag-handle\"><i class=\"material-icons\">drag_handle</i></div>"
        }), 
        __metadata('design:paramtypes', [])
    ], SortableListDragHandle);
    return SortableListDragHandle;
}());
exports.SortableListDragHandle = SortableListDragHandle;
