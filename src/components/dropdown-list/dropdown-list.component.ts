import {ChangeDetectorRef, Component, EmbeddedViewRef, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
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
    template: require('./dropdown-list.tpl.html')
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
        $(this.content).fadeOut(this.options.outDuration);
        setTimeout(() => this.contentStyles.maxHeight = '', this.options.outDuration);
        $(document).off('click scroll', this.closeDropdown);
        this.destroyScrollMask();
    };

    constructor(private elementRef: ElementRef,
                private changeDetector: ChangeDetectorRef,
                private overlayHostService: OverlayHostService) {}

    /**
     * Set up the various references to the DOM elements we will be working with,
     * and move the content-wrapper div to the body.
     */
    ngAfterViewInit(): void {
        const queryChild: Function = (selector: string): JQuery => $(this.elementRef.nativeElement).find(selector);

        this.$trigger = queryChild('.dropdown-trigger');
        this.$trigger.attr('data-activates', this.id);

        this.overlayHostService.getHostView().then(view => {
            this.embeddedView = view.createEmbeddedView(this.contentsTemplate);
            this.contentWrapper = this.embeddedView.rootNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)[0];
            this.content = <HTMLElement> this.contentWrapper.querySelector('.dropdown-content');
            this.content.setAttribute('id', this.id);
        });
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
        this.createScrollMask();

        // Constrain width
        if (this.width === 'contents') {
            this.contentStyles.whiteSpace = 'nowrap';
        } else if (this.width === 'trigger') {
            this.contentStyles.width = this.$trigger.outerWidth() + 1 + 'px';
        } else {
            this.contentStyles.width = this.width + 'px';
        }
        this.changeDetector.markForCheck();

        // needs to be wrapped in a setTimeout due to positioning issues that arise if the
        // content re-flows after being displayed, this altering the height of the $content element.
        // The setTimeout allows the true (re-flowed) height to be used in calculating the
        // position of the dropdown.
        setTimeout(() => {
            let positionStyles = this.calculatePositionStyles();
            let height = $(this.content).innerHeight() + 'px';
            let flowUpwards = parseInt(positionStyles.top, 10) < Math.floor(this.$trigger.offset().top);
            Object.assign(this.contentStyles, positionStyles);
            this.changeDetector.markForCheck();

            // Show dropdown
            $(this.content).stop(true, true)
                .css({
                    opacity: 0,
                    display: 'block',
                    height: 0,
                    'margin-top': flowUpwards ? height : 0
                })
                .velocity({
                    height,
                    'margin-top': 0
                }, {
                    queue: false,
                    duration: this.options.inDuration,
                    easing: 'easeOutCubic'
                })
                .velocity({
                    opacity: 1
                }, {
                    queue: false,
                    duration: this.options.inDuration,
                    easing: 'easeOutSine'
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
            .insertBefore(this.contentWrapper);
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

        if (offsetLeft + $content.innerWidth() > $(window).width()) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';

        } else if (offsetLeft - $content.innerWidth() + this.$trigger.innerWidth() < 0) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }
        // Vertical bottom offscreen detection
        if (verticalOffset + offsetTop + $content.innerHeight() > windowHeight) {
            // If going upwards still goes offscreen, just crop height of dropdown.
            if (offsetTop + originHeight - $content.innerHeight() < 0) {
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
            setTimeout(() => $(document).on('click scroll', this.closeDropdown));
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
