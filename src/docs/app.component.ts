import {Component, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {SplitViewContainer} from '../index';
import {IPageInfo, kebabToPascal, pages} from './pageList';

// Exposed globally by the Webpack DefinePlugin
// (see webpack config)
declare var VERSION: string;
declare var LATESTBRANCH: boolean;

@Component({
    selector: 'app',
    templateUrl: './app.tpl.html'
})
export class App {
    @ViewChild(SplitViewContainer, { static: true }) splitViewContainer: SplitViewContainer;
    version: string;
    latestBranch: boolean;
    changelogBranch = 'master';
    contentItems: any[] = pages.map((page: IPageInfo) => {
        return {
            title: kebabToPascal(page.path),
            route: '/' + page.path,
            keywords: page.keywords || [],
            type: page.type
        };
    });
    filteredContentItems: any[];
    hasContent: boolean = false;
    splitFocus: string = 'left';
    searchQuery: string = '';
    subscription: Subscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private titleService: Title) {
        this.filteredContentItems = this.contentItems.slice(0);
        titleService.setTitle(`Gentics UI Core Docs v${VERSION}`);
        this.version = VERSION;
        this.latestBranch = LATESTBRANCH;

        if (!this.latestBranch) {
            this.changelogBranch = `v${VERSION}`;
        }
    }

    ngOnInit(): void {
        this.subscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                const path = this.route.snapshot.firstChild.url[0].path;
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
