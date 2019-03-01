import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserAgentRef } from '../modal/user-agent-ref';

export interface IBreadcrumbLink {
    href?: string;
    route?: any;
    text: string;
    tooltip?: string;
    [key: string]: any;
}

export interface IBreadcrumbRouterLink {
    route: any[];
    text: string;
    tooltip?: string;
    [key: string]: any;
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
    templateUrl: './breadcrumbs.tpl.html'
})
export class Breadcrumbs implements OnChanges, OnDestroy {

    /**
     * A list of links to display
     */
    @Input() links: IBreadcrumbLink[];


    /**
     * A list of RouterLinks to display
     */
    @Input() routerLinks: IBreadcrumbRouterLink[];

    /**
     * If true all the folder names that fit into one line are shown completely and one ellipsis is shown at the end
     */
    @Input() get multiline(): boolean {
        return this.isMultiline;
    }
    set multiline(val: boolean) {
        this.isMultiline = val != undefined && val !== false;
    }

    /**
     * If true the breadcrumbs are always expanded
     */
    @Input() get multilineExpanded(): boolean {
        return this.isMultilineExpanded;
    }
    set multilineExpanded(val: boolean) {
        this.isMultilineExpanded = val != undefined && val !== false;
    }

    /**
     * Controls whether the navigation is disabled.
     */
    @Input() get disabled(): boolean {
        return this.isDisabled;
    }
    set disabled(val: boolean) {
        this.isDisabled = val != undefined && val !== false;
    }

    /**
     * Fires when a link is clicked
     */
    @Output() linkClick = new EventEmitter<IBreadcrumbLink | IBreadcrumbRouterLink>();

    /**
     * Fires when the expand button is clicked
     */
    @Output() multilineExpandedChange = new EventEmitter<boolean>();

    isMultiline: boolean = false;
    isMultilineExpanded: boolean = false;
    isDisabled: boolean = false;

    outElement: Element;
    fullWidth: number;
    visibleWidth: number;

    backLink: IBreadcrumbLink | IBreadcrumbRouterLink;
    @ViewChildren(RouterLinkWithHref) routerLinkChildren: QueryList<RouterLinkWithHref>;

    private subscriptions = new Subscription();
    private resizeEvents = new BehaviorSubject<void>(null);

    constructor(private elementRef: ElementRef,
                private userAgent: UserAgentRef) { }

    ngOnInit(): void {
        let element: HTMLElement = this.elementRef.nativeElement;
        if (element) {
            // Listen in the "capture" phase to prevent routerLinks when disabled
            element.firstElementChild.addEventListener('click', this.preventClicksWhenDisabled, true);
        }

        const resizeSub = this.resizeEvents
            .debounceTime(200)
            .subscribe(() => {
                this.fullWidth = this.outElement.scrollWidth;
                this.visibleWidth = this.outElement.clientWidth;
                this.executeIEandEdgeEllipsisWorkAround();
            });
        this.subscriptions.add(resizeSub);

        setTimeout(() => {
            this.outElement = document.getElementsByClassName('lastPart')[5];
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['links'] || changes['routerLinks']) {
            let allLinks = (this.links || []).concat(this.routerLinks || []);
            this.backLink = allLinks[allLinks.length - 2];
        }

        if (changes['multiline'] || changes['multilineExpanded']) {
            this.executeIEandEdgeEllipsisWorkAround();
        }
    }

    ngOnDestroy(): void {
        let element: HTMLElement = this.elementRef.nativeElement;
        element.firstElementChild.removeEventListener('click', this.preventClicksWhenDisabled, true);
        this.subscriptions.unsubscribe();
    }

    onLinkClicked(link: IBreadcrumbLink | IBreadcrumbRouterLink, event: Event): void {
        if (this.isDisabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.linkClick.emit(link);
        }
    }

    multilineExpandedChanged(): void {
        this.multilineExpanded = !this.multilineExpanded;
        this.multilineExpandedChange.emit(this.multilineExpanded);

        this.executeIEandEdgeEllipsisWorkAround();

        this.resizeEvents.next(null);
    }

    onResize(event: any): void {
        this.resizeEvents.next(null);
    }

    ngAfterViewInit(): void {
        this.preventDisabledRouterLinks();
        this.routerLinkChildren.changes.subscribe(() => this.preventDisabledRouterLinks());

        setTimeout(() => {
            this.fullWidth = this.outElement.scrollWidth;
            this.visibleWidth = this.outElement.clientWidth;
        });
    }

    private preventClicksWhenDisabled = (ev: Event): void => {
        if (this.isDisabled) {
            let target = ev.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' && target.classList.contains('breadcrumb')) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
            }
        }
    }

    /**
     * Workaround/Hack for the native angular "RouterLink" having no way to disable navigation on click.
     */
    private preventDisabledRouterLinks(): void {
        const thisComponent = this;
        const createsCompileErrorIfRouterLinkAPIChanges: keyof RouterLinkWithHref = 'onClick';

        for (const link of this.routerLinkChildren.filter(link => !link.hasOwnProperty('onClick'))) {
            const originalOnClick = link.onClick;
            link.onClick = function interceptedOnClick(...args: any[]): boolean {
                if (thisComponent.isDisabled) {
                    return true;
                } else {
                    return originalOnClick.apply(this, args);
                }
            };
        }
    }

    private executeIEandEdgeEllipsisWorkAround(): void {
        if (this.multiline && !this.multilineExpanded && (this.userAgent.isIE11 || this.userAgent.isEdge)) {
            // Strange, but unfortunately necessary:
            this.forceRefresh();
            setTimeout(() => this.forceRefresh());
        }
    }

    /**
     * Forces a refresh of the breadcrumbs (necessary for the IE and Edge ellipsis workaround).
     */
    private forceRefresh(): void {
        // Creating just a copy of the array is not enough, the objects need to be different as well,
        // so that Angular recognizes a change.
        if (this.links && this.links.length > 0) {
            this.links = this.links.map(link => ({
                ...link
            }));
        }
        if (this.routerLinks && this.routerLinks.length > 0) {
            this.routerLinks = this.routerLinks.map(link => ({
                ...link
            }));
        }
    }
}
