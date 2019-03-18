import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {RouterLinkWithHref} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {debounceTime, take, delay} from 'rxjs/operators';

import {UserAgentRef} from '../modal/user-agent-ref';

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
    isOverflowing: boolean = false;

    edgeOrIEIsOverflowing: boolean = false;

    isHeightSame: boolean = false;

    defaultHeight: number = 0;
    currentHeight: number = 0;

    backLink: IBreadcrumbLink | IBreadcrumbRouterLink;
    @ViewChildren(RouterLinkWithHref) routerLinkChildren: QueryList<RouterLinkWithHref>;

    @ViewChild('lastPart')
    lastPart: ElementRef;

    @ViewChild('nav')
    nav: ElementRef;

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

        this.resizeEvents.pipe(
            debounceTime(200),
            take(1)
        ).subscribe(() => {
            this.defaultHeight = this.lastPart.nativeElement.clientHeight;
        });

        const resizeSub = this.resizeEvents
            .pipe(debounceTime(200))
            .subscribe(() => {
                this.currentHeight = this.lastPart.nativeElement.clientHeight;
                this.isHeightSame = this.defaultHeight === this.currentHeight;
                if (this.userAgent.isEdge || this.userAgent.isIE11) {
                    this.shortenTexts(this.lastPart.nativeElement);
                }
                this.isOverflowing = this.checkIfOverflowing(this.lastPart.nativeElement);
            });
        this.subscriptions.add(resizeSub);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['links'] || changes['routerLinks']) {
            let allLinks = (this.links || []).concat(this.routerLinks || []);
            this.backLink = allLinks[allLinks.length - 2];
            this.resizeEvents.next(null);
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

    toggleMultilineExpanded(): void {
        this.multilineExpanded = !this.multilineExpanded;
        this.multilineExpandedChange.emit(this.multilineExpanded);
        this.resizeEvents.next(null);
    }

    private shortenTexts(element: HTMLElement) {
        const innerElements = element.querySelectorAll('a.breadcrumb');
        const defaultElements = this.getCuttableBreadcrumbsTexts();

        this.edgeOrIEIsOverflowing = false;

        // Reset all elements to their default states.
        const offset = this.multilineExpanded ? 0 : 1;
        for (let i = 0; i < innerElements.length; i++) {
            const innerElement = innerElements[i];
            innerElement.classList.remove('without');
            innerElement.classList.remove('hidden');
            innerElement.textContent = defaultElements[i + offset];
        }

        if (this.multilineExpanded) {
            return;
        }

        let i = 0;
        while (i < innerElements.length && innerElements[i].textContent.length >= 0 && ((this.nav.nativeElement.scrollWidth - element.offsetLeft) < (element.scrollWidth + 35))) {
            this.edgeOrIEIsOverflowing = true;
            if (innerElements[i].textContent.length === 0) {
                innerElements[i].classList.add('hidden');
                i++;
                if (innerElements[i]) {
                    innerElements[i].classList.add('without');
                }
            } else {
                innerElements[i].textContent = innerElements[i].textContent.substring(1);
            }
        }
    }

    private getCuttableBreadcrumbsTexts(): string[] {
        let defaultBreadcrumbs: string[] = [];
        if (this.links) {
            for (let i = 0; i < this.links.length; i++) {
                defaultBreadcrumbs.push(this.links[i].text);
            }
        }
        if (this.routerLinks) {
            for (let i = 0; i < this.routerLinks.length; i++) {
                defaultBreadcrumbs.push(this.routerLinks[i].text);
            }
        }
        return defaultBreadcrumbs;
    }

    onResize(event: any): void {
        this.resizeEvents.next(null);
    }

    ngAfterViewInit(): void {
        this.preventDisabledRouterLinks();
        this.routerLinkChildren.changes.subscribe(() => this.preventDisabledRouterLinks());
        this.resizeEvents.next(null);
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
     * Checks if the specified element is currently overflowing.
     * @returns true if the element is currently overflowing, otherwise false.
     */
    private checkIfOverflowing(element: Element): boolean {
        if (this.userAgent.isIE11 || this.userAgent.isEdge) {
            return this.edgeOrIEIsOverflowing;
        }

        const fullWidth = element.scrollWidth;
        const visibleWidth = element.clientWidth;
        return fullWidth > visibleWidth;
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
}
