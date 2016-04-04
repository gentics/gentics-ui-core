import {
    Component,
    ElementRef,
    Input
} from 'angular2/core';

/**
 * A Dropdown List component. Based on the Materialize implementation, but translated into a native Angular2
 * version.
 */
@Component({
    selector: 'gtx-dropdown-list',
    template: require('./dropdown-list.tpl.html')
})
export class DropdownList {
    id: string = 'dropdown-' + Math.random().toString(36).substr(2);
    $trigger: JQuery;
    $contentWrapper: JQuery;
    $content: JQuery;
    contentStyles: any = {
        position: 'absolute'
    };
    isOpen = false;
    options = {
        inDuration: 300,
        outDuration: 225,
        constrain_width: true, // Constrains width of dropdown to the activator
        hover: false,
        gutter: 0, // Spacing from edge
        belowOrigin: false,
        alignment: 'left'
    };

    /**
     * Set the alignment of the dropdown, either 'left' or 'right'. Defaults to 'left'.
     */
    @Input()
    get align(): string {
        return this.options.alignment;
    }
    set align(val: string) {
        this.options.alignment = val;
    }

    /**
     * Close the dropdown and unregister the global event handlers.
     */
    closeDropdown = () => {
        this.isOpen = false;
        this.$content.fadeOut(this.options.outDuration);
        setTimeout(() => this.contentStyles.maxHeight = '', this.options.outDuration);
        $(document).off('click scroll', this.closeDropdown);
    };

    constructor(private elementRef: ElementRef) {}

    /**
     * Set up the various references to the DOM elements we will be working with,
     * and move the content-wrapper div to the body.
     */
    ngAfterViewInit(): void {
        const queryChild: Function = (selector: string): JQuery => $(this.elementRef.nativeElement).find(selector);

        let $body: JQuery = $('body');
        this.$trigger = queryChild('.dropdown-trigger');
        this.$contentWrapper = queryChild('.dropdown-content-wrapper');
        this.$content = queryChild('.dropdown-content');
        this.$content.attr('id', this.id);
        this.$trigger.attr('data-activates', this.id);

        // move the contents to body to avoid z-index issues.
        this.$contentWrapper.remove();
        $body.append(this.$contentWrapper);
    }

    /**
     * Remove the content wrapper from the body.
     */
    ngOnDestroy(): void {
        this.$contentWrapper.remove();
    }

    /**
     * Open the dropdown contents in the correct position.
     */
    openDropdown() {
        // Constrain width
        if (this.options.constrain_width === true) {
            this.contentStyles.width = this.$trigger.outerWidth();
        } else {
            this.contentStyles.whiteSpace = 'nowrap';
        }

        // Offscreen detection
        let windowHeight: number = window.innerHeight;
        let originHeight: number = this.$trigger.innerHeight();
        let offsetLeft: number = this.$trigger.offset().left;
        let offsetTop: number = this.$trigger.offset().top - $(window).scrollTop();
        let currAlignment: string = this.options.alignment;

        // Below Origin
        let verticalOffset: number = 0;
        if (this.options.belowOrigin === true) {
            verticalOffset = originHeight;
        }

        if (offsetLeft + this.$content.innerWidth() > $(window).width()) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';

        } else if (offsetLeft - this.$content.innerWidth() + this.$trigger.innerWidth() < 0) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }
        // Vertical bottom offscreen detection
        if (offsetTop + this.$content.innerHeight() > windowHeight) {
            // If going upwards still goes offscreen, just crop height of dropdown.
            if (offsetTop + originHeight - this.$content.innerHeight() < 0) {
                let adjustedHeight: number = windowHeight - offsetTop - verticalOffset;
                this.contentStyles.maxHeight = adjustedHeight;
            } else {
                // Flow upwards.
                if (!verticalOffset) {
                    verticalOffset += originHeight;
                }
                verticalOffset -= this.$content.innerHeight();
            }
        }

        // Handle edge alignment
        let leftPosition: number = 0;
        let triggerLeft: number = this.$trigger[0].getBoundingClientRect().left;
        if (currAlignment === 'left') {
            leftPosition = triggerLeft + this.options.gutter;
        } else if (currAlignment === 'right') {
            let offsetRight: number = triggerLeft + this.$trigger.outerWidth() - this.$content.outerWidth();
            leftPosition =  offsetRight + this.options.gutter;
        }

        this.contentStyles.top = this.$trigger[0].getBoundingClientRect().top + verticalOffset + 'px';
        this.contentStyles.left = leftPosition + 'px';

        // Show dropdown
        this.$content.stop(true, true).css('opacity', 0)
            .slideDown({
                queue: false,
                duration: this.options.inDuration,
                easing: 'easeOutCubic',
                complete: () => {
                    this.contentStyles.height = '';
                }
            })
            .velocity( { opacity: 1 }, {
                queue: false,
                duration: this.options.inDuration,
                easing: 'easeOutSine'
            });
    }

    onTriggerClick(): void {
        console.log('triggerClick');
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
