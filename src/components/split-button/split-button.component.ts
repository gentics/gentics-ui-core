import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    Input,
    OnDestroy,
    QueryList
} from '@angular/core';
import {Subscription} from 'rxjs';

import {coerceToBoolean} from '../../common/coerce-to-boolean';
import {DropdownItem} from '../dropdown-list/dropdown-item.component';
import {SplitButtonPrimaryAction} from './split-button-primary-action.component';

/**
 * A split button component.
 *
 * The main content of the button and the handler of the main click event is specified by
 * using a `<gtx-split-button-primary-action>` child element.
 *
 * Secondary actions can be defined using `<gtx-dropdown-item>` child elements and
 * their click handlers. If secondary actions are defined, a dropdown trigger
 * will be displayed to the right of the main content.
 *
 * All input properties of `<gtx-button>`, except for `icon` and `submit` are supported.
 *
 * This component depends on the `<gtx-overlay-host>` being present in the app.
 *
 * ```html
 * <gtx-split-button>
 *     <gtx-split-button-primary-action (click)="save()">Save Document</gtx-split-button-primary-action>
 *     <gtx-dropdown-item (click)="saveAndPublish()">Save and Publish</gtx-dropdown-item>
 *     <gtx-dropdown-item (click)="saveAndEmail()">Save and Send via E-Mail</gtx-dropdown-item>
 * </gtx-split-button>
 * ```
 */
@Component({
    selector: 'gtx-split-button',
    templateUrl: './split-button.tpl.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitButton implements AfterViewInit, OnDestroy {

    /**
     * Sets the input field to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /**
     * Specify the size of the button. Can be "small", "regular" or "large".
     */
    @Input() size: 'small' | 'regular' | 'large' = 'regular';

    /**
     * Type determines the style of the button. Can be "default", "secondary",
     * "success", "warning" or "alert".
     */
    @Input() type: 'default' | 'secondary' | 'success' | 'warning' | 'alert' = 'default';

    /**
     * Setting the "flat" attribute gives the button a transparent background
     * and only depth on hover.
     */
    @Input()
    get flat(): boolean {
        return this.isFlat;
    }
    set flat(value: boolean) {
        this.isFlat = coerceToBoolean(value);
    }

    /**
     * Controls whether the button is disabled.
     */
    @Input()
    get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(value: boolean) {
        this.isDisabled = coerceToBoolean(value);
    }

    @ContentChild(SplitButtonPrimaryAction, { read: ElementRef })
    primaryAction: ElementRef;

    @ContentChildren(DropdownItem)
    secondaryActions: QueryList<DropdownItem>;

    isFlat = false;
    isDisabled = false;

    private queryListSub: Subscription;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        this.queryListSub = this.secondaryActions.changes.subscribe(
            () => this.changeDetector.markForCheck()
        );
        this.secondaryActions.notifyOnChanges();
    }

    ngOnDestroy(): void {
        if (this.queryListSub) {
            this.queryListSub.unsubscribe();
            this.queryListSub = null;
        }
    }

    /**
     * If the user does not click the primary action content itself, but the button around it,
     * this method is used to trigger a click event on the primary action content.
     */
    onPrimaryButtonClick(event: Event): void {
        if (this.primaryAction && this.isFromPrimaryButton(event)) {
            this.primaryAction.nativeElement.click();
        }
    }

    /**
     * Returns true if the event was fired by the primary `gtx-button` element or one of its children,
     * but not by the `gtx-split-button-primary-action` or one of its children.
     */
    private isFromPrimaryButton(event: Event): boolean {
        if (event && event.srcElement && event.srcElement instanceof Node) {
            // We traverse the DOM tree upwards from the srcElement.
            // If we first find a gtx-split-button-primary-action, the click came from
            // inside the primary action content.
            // If we find a gtx-button first, the click didn't come from inside the primary action content.
            let currNode: Node = event.srcElement;
            do {
                switch (currNode.nodeName) {
                    case 'GTX-BUTTON':
                        return true;
                    case 'GTX-SPLIT-BUTTON-PRIMARY-ACTION':
                        return false;
                    default:
                        break;
                }
            } while (currNode = currNode.parentNode);
        }
        return false;
    }

}
