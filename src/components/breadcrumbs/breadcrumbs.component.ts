import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import {isPresent} from '@angular/core/src/facade/lang';

interface IBreadcrumbLink {
    href?: string;
    text: string;
}

/**
 * A Breadcrumbs navigation component.
 *
 * ```html
 * <gtx-breadcrumbs></gtx-breadcrumbs>
 * ```
 */
@Component({
    selector: 'gtx-breadcrumbs',
    template: require('./breadcrumbs.tpl.html')
})
export class Breadcrumbs {

    /**
     * A list of links to display
     */
    @Input() links: IBreadcrumbLink[] | string[] = [];

    /**
     * Controls whether the navigation is disabled.
     */
    @Input() get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(val: boolean) {
        this.isDisabled = isPresent(val) && val !== false;
    }

    /**
     * Fires when a link is clicked
     */
    @Output() clicked = new EventEmitter<IBreadcrumbLink | string>();


    private isDisabled: boolean = false;

    private linkClicked(link: IBreadcrumbLink, event: Event) {
        if (this.isDisabled) {
            event.preventDefault();
        } else {
            console.log('link clicked: ', link);
        }
    }

}
