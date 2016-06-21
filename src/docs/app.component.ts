import {Component, ViewChild} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';
import {ActivatedRoute, Router, ROUTER_DIRECTIVES, RouterState} from '@angular/router';
import {TopBar, SearchBar, SideMenu, SplitViewContainer, ContentsListItem, Notification, OverlayHost} from '../index';
import {pages, kebabToPascal, IPageInfo} from './pageList';
import {OverlayHostService} from '../components/overlay-host/overlay-host.service';

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [
        ROUTER_DIRECTIVES,
        TopBar,
        SearchBar,
        SplitViewContainer,
        SideMenu,
        ContentsListItem,
        OverlayHost
    ],
    providers: [Notification, OverlayHostService]
})
export class App {
    @ViewChild(SplitViewContainer) splitViewContainer: SplitViewContainer;
    displayMenu: boolean = false;
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
    searchQuery: string;
    subscription: any;
    logoSvg: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizationService) {
        this.filteredContentItems = this.contentItems.slice(0);
        this.logoSvg = sanitizer.bypassSecurityTrustHtml(require('./assets/gentics-logo.svg'));
    }

    ngOnInit(): void {
        this.subscription = this.route.url.subscribe((route) => {
            console.log('route', route);
            this.hasContent = route[0].path !== '';
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

    goToRoute(route: string): void {
        this.focusRightPanel();
    }

    closeContent(): void {
        this.hasContent = false;
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }

    private focusRightPanel(): void {
        this.hasContent = true;
        setTimeout(() => this.splitFocus = 'right');
    }
}
