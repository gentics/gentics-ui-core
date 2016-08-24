import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    EmbeddedViewRef,
    ElementRef,
    Input,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {OverlayHostService} from '../overlay-host/overlay-host.service';

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
@Component({
    selector: 'gtx-dropdown-list',
    template: require('./dropdown-list.tpl.html'),
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownList {
    id: string = 'dropdown-' + Math.random().toString(36).substr(2);
    $trigger: JQuery;
    contentWrapper: HTMLElement;
    content: HTMLElement;
    contentStyles: any = {
        position: 'absolute'
    };
    isOpen = false;
    options = {
        inDuration: 300,
        outDuration: 225,
        hover: false,
        alignment: 'left',
        width: 'contents',
        belowTrigger: false
    };
    scrollMask: JQuery;
    @ViewChild(TemplateRef) contentsTemplate: TemplateRef<any>;
    embeddedView: EmbeddedViewRef<any>;

    /**
     * Set the alignment of the dropdown, either 'left' or 'right'. *Default: 'left'*.
     */
    @Input()
    get align(): string {
        return this.options.alignment;
    }
    set align(val: string) {
        this.options.alignment = val;
    }

    /**
     * Set the width of the dropdown. Can be either 'contents', 'trigger' or a numeric value. 'Contents' will
     * set a width sufficient to accommodate the widest list item. 'Trigger' sets the width to equal the width
     * of the trigger element. A numeric value sets the width the a specific number of pixels. *Default: 'contents'*.
     */
    @Input()
    get width(): string {
        return this.options.width;
    }
    set width(val: string) {
        const isValid = (s: string) => /^(trigger|contents|[\d\.]+)$/.test(s);
        if (isValid(val)) {
            this.options.width = val;
        }
    }

    /**
     * If true, the dropdown will be positioned below the bottom of the trigger element. *Default: false*.
     */
    @Input()
    get belowTrigger(): boolean {
        return this.options.belowTrigger;
    }
    set belowTrigger(val: boolean) {
        this.options.belowTrigger = (val === true || <any> val === 'true');
    }

    /**
     * Close the dropdown and unregister the global event handlers.
     */
    closeDropdown = () => {
        this.isOpen = false;
        setTimeout(() => {
            this.contentStyles.maxHeight = '';
            this.contentStyles.opacity = 0;
            this.cd.markForCheck();
        }, this.options.outDuration);
        this.destroyScrollMask();
        if (this.embeddedView) {
            this.embeddedView.destroy();
        }
    };

    constructor(private elementRef: ElementRef,
                private cd: ChangeDetectorRef,
                private overlayHostService: OverlayHostService) {}

    /**
     * Set up the various references to the DOM elements we will be working with,
     * and move the content-wrapper div to the body.
     */
    ngAfterViewInit(): void {
        const queryChild: Function = (selector: string): JQuery => $(this.elementRef.nativeElement).find(selector);
        this.$trigger = queryChild('.dropdown-trigger');
    }

    /**
     * Remove the content wrapper from the body.
     */
    ngOnDestroy(): void {
        this.destroyScrollMask();
        if (this.embeddedView) {
            this.embeddedView.destroy();
        }
    }

    /**
     * Open the dropdown contents in the correct position.
     */
    openDropdown(): void {
        this.overlayHostService.getHostView().then(view => {
            this.embeddedView = view.createEmbeddedView(this.contentsTemplate);
            this.contentWrapper = this.embeddedView.rootNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)[0];
            this.content = <HTMLElement> this.contentWrapper.querySelector('.dropdown-content');
            this.content.setAttribute('id', this.id);
            this.createScrollMask();
            const $content = $(this.content);

            let containerHeight = 0;

            const calculateContainerWidth = (): number => {
                let containerWidth = 0;
                // Set the width of the container
                if (this.width === 'contents') {
                    this.contentStyles.whiteSpace = 'nowrap';
                    containerWidth = $content.outerWidth();
                } else if (this.width === 'trigger') {
                    containerWidth = this.$trigger.outerWidth() + 1;
                } else {
                    containerWidth = +this.width;
                }
                // pad the width so the content drop shadow is displayed
                return containerWidth;
            };

            let positionStyles = this.calculatePositionStyles();
            let flowUpwards = parseInt(positionStyles.top, 10) < Math.floor(this.$trigger.offset().top);
            Object.assign(this.contentStyles, positionStyles);

            this.contentStyles.height = 0;
            this.contentStyles.marginTop = flowUpwards ? containerHeight : 0;
            this.contentStyles.opacity = 0;
            this.contentStyles.width = calculateContainerWidth() + 'px';


            // Show dropdown. Wrapped in a setTimeout to allow the contents of the dropdown
            // to re-flow (if needed) so that the true dimensions can then be re-calculated.
            setTimeout(() => {
                // pad the height so the content drop shadow is displayed
                this.contentStyles.height = $content.innerHeight() + 'px';
                this.contentStyles.width = calculateContainerWidth() + 'px';
                this.contentStyles.marginTop = 0;
                this.contentStyles.opacity = 1;
                this.cd.markForCheck();
            });

        });
    }

    /**
     * Creates a scroll mask and adds it to the DOM to prevent scrolling while the
     * dropdown is open.
     */
    createScrollMask(): void {
        this.scrollMask = $('<div>')
            .addClass('scroll-mask')
            .insertBefore(this.contentWrapper)
            .on('click', () => this.closeDropdown());
    }

    destroyScrollMask(): void {
        if (this.scrollMask && this.scrollMask.remove) {
            this.scrollMask.remove();
            this.scrollMask = undefined;
        }
    }

    /**
     * Calculates the position of the dropdown based on the height, width. alignment and screen boundaries.
     */
    calculatePositionStyles(): { top: string, left: string, maxHeight?: number } {
        let positionStyles: any = {};
        let $content = $(this.content);

        // Offscreen detection
        let windowHeight: number = window.innerHeight;
        let originHeight: number = this.$trigger.innerHeight();
        let offsetLeft: number = this.$trigger.offset().left;
        let offsetTop: number = this.$trigger.offset().top - $(window).scrollTop();
        let currAlignment: string = this.options.alignment;

        // Below Origin
        let verticalOffset: number = 0;
        if (this.belowTrigger === true) {
            verticalOffset = originHeight;
        }

        const PAGE_MARGIN = 50;
        const contentWidth =  $content.innerWidth() + PAGE_MARGIN;
        const contentHeight = $content.innerHeight() + PAGE_MARGIN;

        if (offsetLeft + contentWidth > $(window).width()) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';

        } else if (offsetLeft - contentWidth + this.$trigger.innerWidth() < 0) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }
        // Vertical bottom offscreen detection
        if (verticalOffset + offsetTop + contentHeight > windowHeight) {
            // If going upwards still goes offscreen, just crop height of dropdown.
            if (offsetTop + originHeight - contentHeight < 0) {
                let adjustedHeight: number = windowHeight - offsetTop - verticalOffset;
                positionStyles.maxHeight = adjustedHeight;
            } else {
                // Flow upwards.
                if (!verticalOffset) {
                    verticalOffset += originHeight + 1;
                }
                if (this.belowTrigger === true) {
                    verticalOffset -= originHeight;
                }
                verticalOffset -= $content.innerHeight();
            }
        }

        // Handle edge alignment
        let leftPosition: number = 0;
        let triggerLeft: number = Math.floor(this.$trigger[0].getBoundingClientRect().left);
        if (currAlignment === 'left') {
            leftPosition = triggerLeft;
        } else if (currAlignment === 'right') {
            leftPosition =  triggerLeft + this.$trigger.outerWidth() - $content.outerWidth();
        }

        positionStyles.top = this.$trigger[0].getBoundingClientRect().top + verticalOffset + 'px';
        positionStyles.left = leftPosition + 'px';

        return positionStyles;
    }

    onTriggerClick(): void {
        if (!this.isOpen) {
            this.isOpen = true;
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    onContentClick(): void {
        if (this.isOpen) {
            this.closeDropdown();
        }
    }
}
