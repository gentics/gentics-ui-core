import { ElementRef } from '@angular/core';
/**
 * A Dropdown List component based on the [Materialize implementation](http://materializecss.com/dropdown.html),
 * but translated into a native Angular2 version.
 *
 * The component expects two child elements with the following classes:
 *
 * * `.dropdown-trigger` - this element is the button/label which the user will click to open the dropdown.
 * * `.dropdown-content` - this should be a `<ul>` list with the contents of the dropdown.
 *
 *
 * ```html
 * <gtx-dropdown-list>
 *     <a class="dropdown-trigger">Show List</a>
 *     <ul class="dropdown-content">
 *         <li><a>First</a></li>
 *         <li><a>Second</a></li>
 *         <li><a>Third</a></li>
 *     </ul>
 * </gtx-dropdown-list>
 * ```
 */
export declare class DropdownList {
    private elementRef;
    id: string;
    $trigger: JQuery;
    $contentWrapper: JQuery;
    $content: JQuery;
    contentStyles: any;
    isOpen: boolean;
    options: {
        inDuration: number;
        outDuration: number;
        constrain_width: boolean;
        hover: boolean;
        gutter: number;
        belowOrigin: boolean;
        alignment: string;
    };
    /**
     * Set the alignment of the dropdown, either 'left' or 'right'. Defaults to 'left'.
     */
    align: string;
    /**
     * Close the dropdown and unregister the global event handlers.
     */
    closeDropdown: () => void;
    constructor(elementRef: ElementRef);
    /**
     * Set up the various references to the DOM elements we will be working with,
     * and move the content-wrapper div to the body.
     */
    ngAfterViewInit(): void;
    /**
     * Remove the content wrapper from the body.
     */
    ngOnDestroy(): void;
    /**
     * Open the dropdown contents in the correct position.
     */
    openDropdown(): void;
    onTriggerClick(): void;
    onContentClick(): void;
}
