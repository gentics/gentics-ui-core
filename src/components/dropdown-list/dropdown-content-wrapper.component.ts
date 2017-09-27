import {
    Component,
    HostListener,
    TemplateRef,
    ElementRef,
    ChangeDetectorRef,
    EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';
import {KeyCode} from '../../common/keycodes';

const PAGE_MARGIN = 50;
const DROPDOWN_MAX_HEIGHT = 650;

@Component({
    selector: 'gtx-dropdown-content-wrapper',
    template: `<div class="dropdown-content-wrapper"
                    (click)="onContentClick()"
                    [ngStyle]="contentStyles">
                    <ng-template [ngTemplateOutlet]="content"></ng-template>
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
    clicked = new EventEmitter<any>();
    escapeKeyPressed = new EventEmitter<any>();

    constructor(private elementRef: ElementRef,
                private cd: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        this.setPositionAndSize(true);
    }

    /**
     * Positions and resizes the dropdown contents container.
     */
    setPositionAndSize(initialOpening: boolean = false): void {
        const content = this.getDropdownContent();
        if (initialOpening) {
            // When opening for the first time, some extra logic is required
            this.contentStyles.height = 0;
            this.contentStyles.opacity = 0;
            content.setAttribute('id', this.id);
        }

        const positionStyles = this.calculatePositionStyles();
        Object.assign(this.contentStyles, positionStyles);
        // const flowUpwards = parseInt(positionStyles.top, 10) < Math.floor(this.trigger.getBoundingClientRect().top);
        const contentHeight = this.innerHeight(this.elementRef.nativeElement.querySelector('gtx-dropdown-content'));

        // when flowing upwards, we animate the `top` property, so must remember the final value.
        const finalTop = parseInt(this.contentStyles.top);
        if (positionStyles.flowUpwards) {
            this.contentStyles.top = finalTop + Math.min(contentHeight, parseInt(positionStyles.maxHeight)) + 'px';
        }

        this.contentStyles.width = this.calculateContainerWidth() + 'px';
        this.cd.markForCheck();
        this.cd.detectChanges();

        // Show dropdown. Wrapped in a setTimeout to allow the contents of the dropdown
        // to re-flow (if needed) so that the true dimensions can then be re-calculated.
        setTimeout(() => {
            const maxHeightValue = parseInt(positionStyles.maxHeight);
            let contentHeight = this.innerHeight(content);
            if (maxHeightValue < contentHeight) {
                contentHeight = maxHeightValue;
            }
            content.style.maxHeight = Math.max(contentHeight, maxHeightValue) + 'px';

            this.contentStyles.height = contentHeight + 'px';
            this.contentStyles.width = this.calculateContainerWidth() + 'px';

            if (positionStyles.flowUpwards) {
                this.contentStyles.top = finalTop + 'px';
            }
            this.contentStyles.transform = `translateZ(0)`;
            this.contentStyles.opacity = 1;

            if (this.options.width === 'content') {
                this.contentStyles.whiteSpace = 'nowrap';
            }
            this.cd.markForCheck();
            this.cd.detectChanges();
        }, 0);
    }

    @HostListener('keydown', ['$event'])
    clickHandler(e: KeyboardEvent): void {
        if (e.keyCode === KeyCode.Escape) {
            this.escapeKeyPressed.emit(true);
        }
    }

    ngOnDestroy(): void {
        const content = this.getDropdownContent();
        if (content) {
            content.style.maxHeight = 'none';
        }
        this.contentStyles.opacity = 0;
        this.contentStyles.maxHeight = 'none';
    }
    /**
     * Calculates the position of the dropdown based on the height, width. alignment and screen boundaries.
     */
    calculatePositionStyles(): { top: string, left: string, maxHeight: string, flowUpwards: boolean; } {
        const positionStyles: any = {
            flowUpwards: false,
            maxHeight: DROPDOWN_MAX_HEIGHT + 'px'
        };
        const content = this.getDropdownContent();
        const fullHeightContent = content.querySelector('.scroller') as HTMLElement;

        // Offscreen detection
        const windowHeight: number = window.innerHeight;
        const triggerHeight: number = this.innerHeight(this.trigger);
        const offset = this.offset(this.trigger);
        const triggerLeft = offset.left;
        const triggerTop = offset.top;
        let currAlignment: string = this.options.alignment;

        // Below Origin
        let verticalOffset = 0;
        if (this.options.belowTrigger === true) {
            verticalOffset = triggerHeight;
        }

        const contentWidth =  this.innerWidth(fullHeightContent) + PAGE_MARGIN;
        const contentHeight = this.innerHeight(fullHeightContent) + PAGE_MARGIN;

        if (triggerLeft + contentWidth > window.innerWidth) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';

        } else if (triggerLeft - contentWidth + this.innerWidth(this.trigger) < 0) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }


        // Vertical bottom offscreen detection
        if (verticalOffset + triggerTop + contentHeight > windowHeight) {
            let adjustedHeight = this.limitHeight(this.innerHeight(content));
            const contentLargerThanWindow = windowHeight <= adjustedHeight;
            // If content is greater than half of the window height, it should
            // flow upward if the trigger is below the half-way point
            if (contentLargerThanWindow) {
                positionStyles.flowUpwards = windowHeight / 2 < triggerTop;
            } else {
                positionStyles.flowUpwards = windowHeight <= triggerTop + adjustedHeight;
            }

            if (!positionStyles.flowUpwards) {
                // If going upwards still goes offscreen, just crop height of dropdown.
                if (triggerTop + triggerHeight - contentHeight < 0) {
                    adjustedHeight = windowHeight - triggerTop - verticalOffset - PAGE_MARGIN;
                }
            } else {
                if (!verticalOffset) {
                    verticalOffset += triggerHeight + 1;
                }
                if (this.options.belowTrigger === true) {
                    verticalOffset -= triggerHeight;
                }

                if (triggerTop + triggerHeight - PAGE_MARGIN < adjustedHeight) {
                    adjustedHeight = (triggerTop + triggerHeight) - PAGE_MARGIN;
                }
                adjustedHeight = this.limitHeight(adjustedHeight);
                verticalOffset -= adjustedHeight;
            }
            positionStyles.maxHeight = this.limitHeight(adjustedHeight) + 'px';
        }

        // Handle edge alignment
        let leftPosition: number = 0;
        // const triggerLeft: number = Math.floor(this.trigger.getBoundingClientRect().left);
        if (currAlignment === 'left') {
            leftPosition = triggerLeft;
        } else if (currAlignment === 'right') {
            leftPosition =  triggerLeft + this.trigger.offsetWidth - this.calculateContainerWidth();
        }

        positionStyles.top = this.trigger.getBoundingClientRect().top + verticalOffset + 'px';
        positionStyles.left = leftPosition + 'px';

        return positionStyles;
    }

    onContentClick(): void {
        this.clicked.emit(true);
    }

    /**
     * Given a true height of an element, returns a new height which is limited by both
     * the height of the window and the value of DROPDOWN_MAX_HEIGHT.
     */
    private limitHeight(trueHeight: number): number {
        const windowHeight = window.innerHeight - PAGE_MARGIN * 2;
        return Math.min(trueHeight, DROPDOWN_MAX_HEIGHT, windowHeight);
    }

    private getDropdownContent(): HTMLElement | null {
        return this.elementRef.nativeElement.querySelector('gtx-dropdown-content');
    }

    private calculateContainerWidth(): number {
        let containerWidth = 0;
        // Set the width of the container
        if (this.options.width === 'contents') {
            let content = <HTMLElement> this.elementRef.nativeElement.querySelector('gtx-dropdown-content');
            containerWidth = content.offsetWidth;
        } else if (this.options.width === 'trigger') {
            containerWidth = this.trigger.offsetWidth + 1;
        } else {
            containerWidth = +this.options.width;
        }
        // pad the width so the content drop shadow is displayed
        return containerWidth;
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
