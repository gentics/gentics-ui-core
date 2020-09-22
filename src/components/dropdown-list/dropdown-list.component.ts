import {
    ChangeDetectionStrategy,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChild,
    EventEmitter,
    HostListener,
    Input,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {take} from 'rxjs/operators';

import {coerceToBoolean} from '../../common/coerce-to-boolean';
import {KeyCode} from '../../common/keycodes';
import {OverlayHostService} from '../overlay-host/overlay-host.service';
import {DropdownContentWrapper} from './dropdown-content-wrapper.component';
import {DropdownContent} from './dropdown-content.component';
import {DropdownTriggerDirective} from './dropdown-trigger.directive';
import {ScrollMask} from './scroll-mask.component';

export type DropdownAlignment = 'left' | 'right';
export type DropdownWidth = 'contents' | 'trigger' | 'expand' | number;

/**
 * A Dropdown component. Depends on the [`<gtx-overlay-host>`](#/overlay-host) being present in the app.
 *
 * The component expects two child elements:
 *
 * * `<gtx-dropdown-trigger>` - this element is the button/label which the user will click to open the dropdown.
 * * `<gtx-dropdown-content>` - contains the contents of the dropdown. If it contains a `<ul>`, specific styles will be applied
 *
 * The `<gtx-dropdown-content>` element may contain arbitrary content, but list items should be wrapped in `<gtx-dropdown-item>`.
 * This will allow keyboard support for list navigation.
 *
 *
 * ```html
 * <gtx-dropdown-list>
 *     <gtx-dropdown-trigger>
 *         <a>Show List</a>
 *     </gtx-dropdown-trigger>
 *     <gtx-dropdown-content>
 *          <gtx-dropdown-item>First</gtx-dropdown-item>
 *          <gtx-dropdown-item>Second</gtx-dropdown-item>
 *          <gtx-dropdown-item>Third</gtx-dropdown-item>
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
 * - `dropdownList.resize(): void`
 */
@Component({
    selector: 'gtx-dropdown-list',
    templateUrl: './dropdown-list.tpl.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownList {
    options = {
        alignment: 'left' as DropdownAlignment,
        width: 'contents' as DropdownWidth,
        belowTrigger: false,
        sticky: false,
        closeOnEscape: true
    };
    @ViewChild(TemplateRef, { static: true }) contentsTemplate: TemplateRef<any>;
    @ContentChild(DropdownTriggerDirective, { static: true }) trigger: DropdownTriggerDirective;
    @ContentChild(DropdownContent, { static: false }) content: DropdownContent;

    /**
     * Fired whenever the dropdown contents are opened.
     */
    @Output() open = new EventEmitter<void>();

    /**
     * Fired whenever the dropdown contents are closed.
     */
    @Output() close = new EventEmitter<void>();

    private _disabled: boolean = false;
    private overlayHostView: ViewContainerRef;
    private scrollMaskFactory: ComponentFactory<ScrollMask>;
    private scrollMaskRef: ComponentRef<ScrollMask>;
    private contentComponentFactory: ComponentFactory<DropdownContentWrapper>;
    private contentComponentRef: ComponentRef<DropdownContentWrapper>;

    /**
     * Set the alignment of the dropdown, either 'left' or 'right'. *Default: 'left'*.
     */
    @Input()
    get align(): DropdownAlignment {
        return this.options.alignment;
    }
    set align(val: DropdownAlignment) {
        this.options.alignment = val;
    }

    /**
     * Set the width of the dropdown. Can be either `contents`, `trigger`, `expand` or a numeric value. 'Contents' will
     * set a width sufficient to accommodate the widest list item. 'Trigger' sets the width to equal the width
     * of the trigger element. 'Expand' is equivalent to the maximum of 'trigger' and 'contents'.
     * A numeric value sets the width the a specific number of pixels. *Default: 'contents'*.
     */
    @Input()
    get width(): DropdownWidth {
        return this.options.width;
    }
    set width(val: DropdownWidth) {
        const isValid = (s: string) => /^(trigger|contents|expand|[\d\.]+)$/.test(s);
        if (isValid(val as string)) {
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
        this.options.belowTrigger = coerceToBoolean(val);
    }

    /**
     * If true, the dropdown will not close when clicked, but may only be closed by clicking outside the dropdown or
     * pressing escape. *Default: false*
     */
    @Input()
    get sticky(): boolean {
        return this.options.sticky;
    }
    set sticky(val: boolean) {
        this.options.sticky = coerceToBoolean(val);
    }

    /**
     * If true, the dropdown will close when the escape key is pressed. *Default: true*
     */
    @Input()
    get closeOnEscape(): boolean {
        return this.options.closeOnEscape;
    }
    set closeOnEscape(val: boolean) {
        this.options.closeOnEscape = coerceToBoolean(val);
    }

    /**
     * If true, the dropdown will not open when the trigger is clicked.
     */
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(val: boolean) {
        this._disabled = coerceToBoolean(val);
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
        const keyCode = e.keyCode;
        const toPrevent = [
            KeyCode.UpArrow,
            KeyCode.DownArrow,
            KeyCode.PageUp,
            KeyCode.PageDown,
            KeyCode.Space,
            KeyCode.Home,
            KeyCode.End
        ];

        if (-1 < toPrevent.indexOf(keyCode)) {
            e.preventDefault();
        }

        switch (keyCode) {
            case KeyCode.Escape:
                if (this.options.closeOnEscape === true) {
                    this.closeDropdown();
                }
                break;
            case KeyCode.Tab:
                if (this.isOpen) {
                    e.preventDefault();
                    this.content.focusFirstItem();
                }
        }
    }

    /**
     * Open the dropdown contents in the correct position.
     */
    openDropdown(): void {
        if (this._disabled) {
            return;
        }
        this.contentComponentRef = this.overlayHostView.createComponent(this.contentComponentFactory, null);
        const contentInstance = this.contentComponentRef.instance;
        contentInstance.content = this.contentsTemplate;
        contentInstance.trigger = this.trigger.elementRef.nativeElement;
        Object.assign(contentInstance.options, this.options);
        contentInstance.clicked.pipe(take(1)).subscribe(() => {
            if (!this.sticky) {
                this.closeDropdown();
            }
        });
        contentInstance.escapeKeyPressed.pipe(take(1)).subscribe(() => {
            if (this.closeOnEscape) {
                this.closeDropdown();
            }
        });
        // When focus is lost from the list items (by tabbing), close the dropdown and focus the
        // first child of the trigger is possible.
        this.content.focusLost.pipe(take(1)).subscribe(() => {
            this.closeDropdown();
            this.trigger.focus();
        });

        this.scrollMaskRef = this.overlayHostView.createComponent(this.scrollMaskFactory, null);
        this.scrollMaskRef.instance.clicked.pipe(take(1)).subscribe(() => this.closeDropdown());
        this.open.emit();
    }

    resize(): void {
        if (this.contentComponentRef) {
            this.contentComponentRef.instance.setPositionAndSize();
        }
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
        this.close.emit();
    }
}
