import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    HostListener,
    Input,
    TemplateRef,
    ViewChild,
    ComponentFactoryResolver,
    ContentChild,
    ComponentRef,
    ComponentFactory,
    ViewContainerRef
} from '@angular/core';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {DropdownContentWrapper} from './dropdown-content-wrapper.component';
import {ScrollMask} from './scroll-mask.component';
import {UP_ARROW, DOWN_ARROW, PAGE_UP, PAGE_DOWN, SPACE} from '../../common/keycodes';

@Directive({
    selector: 'gtx-dropdown-trigger'
})
export class DropdownTriggerDirective {}

@Directive({
    selector: 'gtx-dropdown-content'
})
export class DropdownContentDirective {}


/**
 * A Dropdown component.
 *
 * The component expects two child elements:
 *
 * * `<gtx-dropdown-trigger>` - this element is the button/label which the user will click to open the dropdown.
 * * `<gtx-dropdown-content>` - contains the contents of the dropdown. If it contains a `<ul>`, specific styles will be applied
 *
 *
 * ```html
 * <gtx-dropdown-list>
 *     <gtx-dropdown-trigger>
 *         <a>Show List</a>
 *     </gtx-dropdown-trigger>
 *     <gtx-dropdown-content>
 *          <ul>
 *              <li><a>First</a></li>
 *              <li><a>Second</a></li>
 *              <li><a>Third</a></li>
 *          </ul>
 *     </gtx-dropdown-content>
 * </gtx-dropdown-list>
 * ```
 *
 * ##### Programmatic Use
 * When used programmatically (e.g. by getting a reference to the component via `@ContentChild(DropdownList)`, the
 * following extended API is available:
 *
 * - `dropdownList.isOpen: boolean`
 * - `dropdownList.openDropdown(): void`
 * - `dropdownList.closeDropdown(): void`
 */
@Component({
    selector: 'gtx-dropdown-list',
    templateUrl: './dropdown-list.tpl.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownList {
    options = {
        alignment: 'left',
        width: 'contents',
        belowTrigger: false
    };
    @ViewChild(TemplateRef) contentsTemplate: TemplateRef<any>;
    @ContentChild(DropdownTriggerDirective, { read: ElementRef }) trigger: ElementRef;

    private overlayHostView: ViewContainerRef;
    private scrollMaskFactory: ComponentFactory<ScrollMask>;
    private scrollMaskRef: ComponentRef<ScrollMask>;
    private contentComponentFactory: ComponentFactory<DropdownContentWrapper>;
    private contentComponentRef: ComponentRef<DropdownContentWrapper>;

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

    get isOpen(): boolean {
        return !!this.contentComponentRef;
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                overlayHostService: OverlayHostService) {

        this.contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(DropdownContentWrapper);
        this.scrollMaskFactory = this.componentFactoryResolver.resolveComponentFactory(ScrollMask);
        overlayHostService.getHostView().then(view => this.overlayHostView = view);
    }

    /**
     * Remove the content wrapper from the body.
     */
    ngOnDestroy(): void {
        this.closeDropdown();
    }

    /**
     * Prevent the user from causing a scroll via the keyboard.
     */
    @HostListener('keydown', ['$event'])
    keyHandler(e: KeyboardEvent): void {
        const keysToPrevent = [UP_ARROW, DOWN_ARROW, PAGE_UP, PAGE_DOWN, SPACE];
        if (-1 < keysToPrevent.indexOf(e.keyCode)) {
            e.preventDefault();
        }
    }

    /**
     * Open the dropdown contents in the correct position.
     */
    openDropdown(): void {
        this.contentComponentRef = this.overlayHostView.createComponent(this.contentComponentFactory, null);
        const contentInstance = this.contentComponentRef.instance;
        contentInstance.content = this.contentsTemplate;
        contentInstance.trigger = this.trigger.nativeElement;
        Object.assign(contentInstance.options, this.options);
        contentInstance.close.take(1).subscribe(() => this.closeDropdown());

        this.scrollMaskRef = this.overlayHostView.createComponent(this.scrollMaskFactory, null);
        this.scrollMaskRef.instance.close.take(1).subscribe(() => this.closeDropdown());
    }

    onTriggerClick(): void {
        if (!this.isOpen) {
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    /**
     * Close the dropdown.
     */
    closeDropdown(): void {
        if (this.scrollMaskRef) {
            this.scrollMaskRef.destroy();
        }
        if (this.contentComponentRef) {
            this.contentComponentRef.destroy();
            this.contentComponentRef = null;
        }
    }
}
