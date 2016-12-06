import {Component, TemplateRef, ElementRef, ChangeDetectorRef, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

const PAGE_MARGIN = 50;

@Component({
    selector: 'gtx-dropdown-content-wrapper',
    template: `<div class="dropdown-content-wrapper"
                    (click)="onContentClick()"
                    [ngStyle]="contentStyles">
                    <template [ngTemplateOutlet]="content"></template>
               </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownContentWrapper {
    content: TemplateRef<any>;
    contentStyles: any = {
        position: 'absolute'
    };
    options = {
        alignment: 'left',
        width: 'contents',
        belowTrigger: false
    };
    trigger: HTMLElement;
    id: string = 'dropdown-' + Math.random().toString(36).substr(2);
    close = new EventEmitter<any>();

    constructor(private elementRef: ElementRef,
                private cd: ChangeDetectorRef) {}

    ngAfterViewInit(): void {

        let content = <HTMLElement> this.elementRef.nativeElement.querySelector('gtx-dropdown-content');
        content.setAttribute('id', this.id);

        let containerHeight = 0;

        const calculateContainerWidth = (): number => {
            let containerWidth = 0;
            // Set the width of the container
            if (this.options.width === 'contents') {
                this.contentStyles.whiteSpace = 'nowrap';
                containerWidth = content.offsetWidth;
            } else if (this.options.width === 'trigger') {
                containerWidth = this.trigger.offsetWidth + 1;
            } else {
                containerWidth = +this.options.width;
            }
            // pad the width so the content drop shadow is displayed
            return containerWidth;
        };

        let positionStyles = this.calculatePositionStyles();
        let flowUpwards = parseInt(positionStyles.top, 10) < Math.floor(this.trigger.offsetTop);
        Object.assign(this.contentStyles, positionStyles);

        this.contentStyles.height = 0;
        this.contentStyles.marginTop = flowUpwards ? containerHeight : 0;
        this.contentStyles.opacity = 0;
        this.contentStyles.width = calculateContainerWidth() + 'px';
        this.cd.markForCheck();
        this.cd.detectChanges();

        // Show dropdown. Wrapped in a setTimeout to allow the contents of the dropdown
        // to re-flow (if needed) so that the true dimensions can then be re-calculated.
        setTimeout(() => {
            // pad the height so the content drop shadow is displayed
            let contentHeight = this.innerHeight(content);
            let contentOffsetTop = Number.parseInt(this.contentStyles.top);
            let bleed = contentHeight + contentOffsetTop - window.innerHeight;
            if (0 < bleed) {
                // the dropdown is too long to fit in the window, we make it shorter.
                contentHeight = contentHeight - bleed - PAGE_MARGIN;
                content.style.maxHeight = contentHeight + 'px';
            }

            this.contentStyles.height = contentHeight + 'px';
            this.contentStyles.width = calculateContainerWidth() + 'px';
            this.contentStyles.marginTop = 0;
            this.contentStyles.opacity = 1;
            this.cd.markForCheck();
        }, 0);
    }


    ngOnDestroy(): void {
        this.contentStyles.maxHeight = '';
        this.contentStyles.opacity = 0;
    }
    /**
     * Calculates the position of the dropdown based on the height, width. alignment and screen boundaries.
     */
    calculatePositionStyles(): { top: string, left: string, maxHeight?: number } {
        let positionStyles: any = {};
        let content = <HTMLElement> this.elementRef.nativeElement.querySelector('gtx-dropdown-content');

        // Offscreen detection
        let windowHeight: number = window.innerHeight;
        let originHeight: number = this.innerHeight(this.trigger);
        let offsetLeft: number = this.offset(this.trigger).left;
        let offsetTop: number = this.offset(this.trigger).top - window.scrollY;
        let currAlignment: string = this.options.alignment;

        // Below Origin
        let verticalOffset: number = 0;
        if (this.options.belowTrigger === true) {
            verticalOffset = originHeight;
        }

        const contentWidth =  this.innerWidth(content) + PAGE_MARGIN;
        const contentHeight = this.innerHeight(content) + PAGE_MARGIN;

        if (offsetLeft + contentWidth > window.innerWidth) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';

        } else if (offsetLeft - contentWidth + this.innerWidth(this.trigger) < 0) {
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
                if (this.options.belowTrigger === true) {
                    verticalOffset -= originHeight;
                }
                verticalOffset -= this.innerHeight(content);
            }
        }

        // Handle edge alignment
        let leftPosition: number = 0;
        let triggerLeft: number = Math.floor(this.trigger.getBoundingClientRect().left);
        if (currAlignment === 'left') {
            leftPosition = triggerLeft;
        } else if (currAlignment === 'right') {
            leftPosition =  triggerLeft + this.trigger.offsetWidth - content.offsetWidth;
        }

        positionStyles.top = this.trigger.getBoundingClientRect().top + verticalOffset + 'px';
        positionStyles.left = leftPosition + 'px';

        return positionStyles;
    }

    onContentClick(): void {
        this.close.emit(true);
    }

    /**
     * Returns the offset of the element relative to the document.
     */
    private offset(elem: HTMLElement): { top: number; left: number; } {
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top  = box.top +  scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }


    private innerWidth(el: HTMLElement): number {
        if (el) {
            let style = window.getComputedStyle(el, null);
            return Number.parseInt(style.getPropertyValue('width')) || el.offsetWidth;
        }
        return 0;
    }

    private innerHeight(el: HTMLElement): number {
        if (el) {
            let style = window.getComputedStyle(el, null);
            return Number.parseInt(style.getPropertyValue('height')) || el.offsetHeight;
        }
        return 0;
    }
}
