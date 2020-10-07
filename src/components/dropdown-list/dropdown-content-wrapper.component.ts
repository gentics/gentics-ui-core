import {
    Component,
    HostListener,
    TemplateRef,
    ElementRef,
    ChangeDetectorRef,
    EventEmitter,
    ChangeDetectionStrategy,
    Inject, OnDestroy, AfterViewInit
} from '@angular/core';
import {KeyCode} from '../../common/keycodes';
import {DropdownAlignment, DropdownWidth} from './dropdown-list.component';
import {Config, ConfigService} from '../../module.config';

@Component({
    selector: 'gtx-dropdown-content-wrapper',
    template: `<div class="dropdown-content-wrapper"
                    (click)="onContentClick()"
                    [ngStyle]="contentStyles">
                    <ng-template [ngTemplateOutlet]="content"></ng-template>
               </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownContentWrapper implements AfterViewInit, OnDestroy {
    pageMargin: Config['dropDownPageMargin'];
    dropDownMaxHeight: Config['dropDownMaxHeight'];
    content: TemplateRef<any>;
    contentStyles: any = {
        position: 'absolute'
    };
    options = {
        alignment: 'left' as DropdownAlignment,
        width: 'contents' as DropdownWidth,
        belowTrigger: false
    };
    trigger: HTMLElement;
    id: string = 'dropdown-' + Math.random().toString(36).substr(2);
    clicked = new EventEmitter<any>();
    escapeKeyPressed = new EventEmitter<any>();
    private widthHasBeenAdjusted = false;

    constructor(private elementRef: ElementRef,
                private cd: ChangeDetectorRef,
                @Inject(ConfigService) private config: Config) {
        this.pageMargin = this.config.dropDownPageMargin;
        this.dropDownMaxHeight = this.config.dropDownMaxHeight;
    }

    ngAfterViewInit(): void {
        this.setPositionAndSize(true);
    }

    /**
     * Positions and resizes the dropdown contents container.
     */
    setPositionAndSize(initialOpening: boolean = false): void {
        const content = this.getDropdownContent();
        if (!content) {
            return;
        }
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

            if (this.options.width === 'contents') {
                this.contentStyles.whiteSpace = 'nowrap';
            }
            this.widthHasBeenAdjusted = true;
            this.cd.markForCheck();
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
            maxHeight: this.dropDownMaxHeight + 'px'
        };
        const content = this.getDropdownContent();
        const fullHeightContent = content && content.querySelector('.scroller') as HTMLElement;
        const contentHeight = this.innerHeight(fullHeightContent) + this.pageMargin;

        // Offscreen detection
        const windowHeight: number = window.innerHeight;
        const triggerHeight: number = this.innerHeight(this.trigger);
        const offset = this.offset(this.trigger);
        const triggerLeft = offset.left;
        const triggerTop = offset.top;
        const containerWidth = this.calculateContainerWidth();
        const currAlignment = this.calculateAlignment(triggerLeft, containerWidth);

        // Below Origin
        let verticalOffset = 0;
        if (this.options.belowTrigger === true) {
            verticalOffset = triggerHeight;
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
                positionStyles.flowUpwards = (windowHeight <= triggerTop + adjustedHeight) && (windowHeight / 2 < triggerTop);
            }

            if (!positionStyles.flowUpwards) {
                // If going upwards still goes offscreen, just crop height of dropdown.
                if (triggerTop + triggerHeight - contentHeight < 0) {
                    adjustedHeight = windowHeight - triggerTop - verticalOffset - this.pageMargin;
                }
            } else {
                if (!verticalOffset) {
                    verticalOffset += triggerHeight + 1;
                }
                if (this.options.belowTrigger === true) {
                    verticalOffset -= triggerHeight;
                }

                if (triggerTop + triggerHeight - this.pageMargin < adjustedHeight) {
                    adjustedHeight = (triggerTop + triggerHeight) - this.pageMargin;
                }
                adjustedHeight = this.limitHeight(adjustedHeight);
                verticalOffset -= adjustedHeight;
            }
            positionStyles.maxHeight = this.limitHeight(adjustedHeight) + 'px';
        }

        // Handle edge alignment
        let leftPosition: number = 0;
        switch (currAlignment) {
            case 'left':
                leftPosition = triggerLeft;
                break;
            case 'right':
                leftPosition =  triggerLeft + this.trigger.offsetWidth - containerWidth;
                break;
            case 'center':
            default:
                leftPosition = 0;
        }

        positionStyles.top = this.trigger.getBoundingClientRect().top + verticalOffset + 'px';
        positionStyles.left = leftPosition + 'px';

        return positionStyles;
    }

    onContentClick(): void {
        this.clicked.emit(true);
    }

    /**
     * Calculates the optimal alignment of the dropdown contents to avoid clipping over the edge of the window.
     */
    private calculateAlignment(triggerLeft: number, containerWidth: number): DropdownAlignment | 'center' {
        let currAlignment: DropdownAlignment | 'center' = this.options.alignment;

        const doesNotFitOnRight = triggerLeft - containerWidth + this.innerWidth(this.trigger) < 0;
        const doesNotFitOnLeft = window.innerWidth < triggerLeft + containerWidth;
        if (doesNotFitOnRight && doesNotFitOnLeft) {
            // Dropdown is wider than screen, force center alignment
            currAlignment = 'center';
        } else if (doesNotFitOnLeft) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';
        } else if (doesNotFitOnRight) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }
        return currAlignment;
    }

    /**
     * Given a true height of an element, returns a new height which is limited by both
     * the height of the window and the value of this.dropDownMaxHeight.
     */
    private limitHeight(trueHeight: number): number {
        const windowHeight = window.innerHeight - this.pageMargin * 2;
        return Math.min(trueHeight, this.dropDownMaxHeight, windowHeight);
    }

    private getDropdownContent(): HTMLElement | null {
        return this.elementRef.nativeElement.querySelector('gtx-dropdown-content');
    }

    /**
     * Returns the width of the container according to the `width` input passed into the component.
     */
    private calculateContainerWidth(): number {
        switch (this.options.width) {
            case 'contents':
                return this.calculateWidthContents();
            case 'trigger':
                return this.calculateWidthTrigger();
            case 'expand':
                return this.calculateWidthExpand();
            default:
                return this.calculateWidthNumber();
        }
    }

    private calculateWidthContents(): number {
        const content = this.getDropdownContent();
        // if the container is wider than the window, we just set the width to take up the full window
        if (window.innerWidth < content.offsetWidth) {
            return window.innerWidth;
        } else {
            // adjust the width by 1px once, to eliminate unwanted x-scrollbar when there is a y-scrollbar.
            // The `widthHasBeenAdjusted` flag prevents the contents from further widening on subsequent
            // calls to calculatePositionStyles()
            const adjustment = this.widthHasBeenAdjusted ? 0 : 1;
            return content.offsetWidth + adjustment;
        }
    }

    private calculateWidthTrigger(): number {
        return this.trigger.offsetWidth + 1;
    }

    private calculateWidthExpand(): number {
        return Math.max(this.calculateWidthTrigger(), this.calculateWidthContents());
    }

    private calculateWidthNumber(): number {
        return +this.options.width;
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
