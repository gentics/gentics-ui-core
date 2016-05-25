import {
    Component,
    EventEmitter,
    Input,
    Output,
    Pipe,
    PipeTransform
} from '@angular/core';
import {isPresent} from '@angular/core/src/facade/lang';

export interface IBreadcrumbLink {
    href?: string;
    text: string;
}

export type BreadcrumbLink = IBreadcrumbLink | string;

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
    @Input() links: BreadcrumbLink[] = [];

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
    @Output() clicked = new EventEmitter<BreadcrumbLink>();


    private isDisabled: boolean = false;

    private textOfLink(link: BreadcrumbLink): string {
        if (link != null && typeof (<IBreadcrumbLink> link).text == 'string') {
            return (<IBreadcrumbLink> link).text;
        }
        return link.toString();
    }

    private linkClicked(link: BreadcrumbLink, event: Event) {
        if (this.isDisabled) {
            event.preventDefault();
        } else {
            this.clicked.emit(link);
        }
    }

}
