import {Component, ViewChild} from '@angular/core';
import {DomSanitizationService, SafeHtml, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, ROUTER_DIRECTIVES, NavigationEnd, PRIMARY_OUTLET} from '@angular/router';
import {Subscription} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {ContentsListItem, Notification, OverlayHost, OverlayHostService,
    PageFileDragHandler, SearchBar, SplitViewContainer, TopBar} from '../index';
import {pages, kebabToPascal, IPageInfo} from './pageList';


// Exposed globally by the Webpack DefinePlugin
// (see webpack config)
declare var VERSION: string;

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [
        ROUTER_DIRECTIVES,
        TopBar,
        SearchBar,
        SplitViewContainer,
        ContentsListItem,
        OverlayHost
    ],
    providers: [Notification, OverlayHostService, PageFileDragHandler]
})
export class App {
    @ViewChild(SplitViewContainer) splitViewContainer: SplitViewContainer;
    version: string;
    contentItems: any[] = pages.map((page: IPageInfo) => {
        return {
            title: kebabToPascal(page.name),
            route: '/' + page.name,
            keywords: page.keywords || [],
            type: page.type
        };
    });
    filteredContentItems: any[];
    hasContent: boolean = false;
    splitFocus: string = 'left';
    searchQuery: string = '';
    subscription: Subscription;
    logoSvg: SafeHtml;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private titleService: Title,
                private sanitizer: DomSanitizationService) {
        this.filteredContentItems = this.contentItems.slice(0);
        this.logoSvg = sanitizer.bypassSecurityTrustHtml(require('./assets/gentics-logo.svg'));
        titleService.setTitle(`Gentics UI Core Docs v${VERSION}`);
        this.version = VERSION;
    }

    ngOnInit(): void {
        this.subscription = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(_ => this.router.routerState)
            .map(state => {
                let route = this.route;
                while (state.firstChild(route)) {
                    route = state.firstChild(route);
                }
                return route;
            })
            .filter(route => route.outlet === PRIMARY_OUTLET)
            .subscribe((route: ActivatedRoute) => {
                const path = route.snapshot.url[0].path;
                this.hasContent = (path !== '' && path !== 'index');
                if (this.hasContent) {
                    this.splitFocus = 'right';
                }
                this.splitViewContainer.scrollRightPanelTo(0);
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    filterContentItems(query: string): void {
        const match = (needle: string, haystack: string): boolean => {
            return -1 < haystack.toLowerCase().indexOf(needle.toLowerCase());
        };

        if (query && 0 < query.length) {
            this.filteredContentItems = this.contentItems.filter((item: any) => {
                let titleMatch = match(query, item.title);
                let keywordMatch = item.keywords.reduce((res: boolean, keyword: string) => {
                    return res || match(query, keyword);
                }, false);
                return titleMatch || keywordMatch;
            });
        } else {
            this.filteredContentItems = this.contentItems.slice(0);
        }
    }

    resetFilter(): void {
        this.searchQuery = '';
        this.filterContentItems('');
    }

    goToRoute(route: string): void {
        this.focusRightPanel();
    }

    closeContent(): void {
        this.hasContent = false;
    }

    private focusRightPanel(): void {
        this.hasContent = true;
        setTimeout(() => this.splitFocus = 'right');
    }
}
