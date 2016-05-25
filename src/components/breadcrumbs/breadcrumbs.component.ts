import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {isPresent} from '@angular/core/src/facade/lang';

export interface IBreadcrumbLink {
    href?: string;
    text: string;
}

export interface IBreadcrumbRouterLink {
    route: any[];
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
    template: require('./breadcrumbs.tpl.html'),
    directives: [RouterLink]
})
export class Breadcrumbs {

    /**
     * A list of links to display
     */
    @Input() links: IBreadcrumbLink[] = null;


    /**
     * A list of RouterLinks to display
     */
    @Input() routerLinks: IBreadcrumbRouterLink[] = null;

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
    @Output() clicked = new EventEmitter<IBreadcrumbLink | IBreadcrumbRouterLink>();


    private isDisabled: boolean = false;

    private linkClicked(link: IBreadcrumbLink | IBreadcrumbRouterLink, event: Event): void {
        if (this.isDisabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.clicked.emit(link);
        }
    }
}
