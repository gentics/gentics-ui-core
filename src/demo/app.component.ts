import {Component, Type} from 'angular2/core';
import {Router, RouteConfig, RouteDefinition, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopBar, SearchBar, SideMenu, SplitViewContainer, ContentsListItem} from '../index';
import {demos, kebabToPascal} from './demos';


const routes: RouteDefinition[] = demos.map((demo: IDemoItem) => {
   return {
       path: '/' + demo.name,
       name: kebabToPascal(demo.name),
       component: demo.component
   };
});

@Component({
    selector: 'app',
    template: require('./app.tpl.html'),
    directives: [
        ROUTER_DIRECTIVES,
        TopBar,
        SearchBar,
        SplitViewContainer,
        SideMenu,
        ContentsListItem
    ],
    styles: [require('./app.scss').toString()]
})
@RouteConfig(routes)
export class App {
    displayMenu: boolean = false;
    contentItems: any[] = demos.map((demo: IDemoItem) => {
        return {
            title: kebabToPascal(demo.name),
            route: kebabToPascal(demo.name)
        };
    });
    filteredContentItems: any[];
    hasContent: boolean = false;
    splitFocus: string = 'left';
    searchQuery: string;

    constructor(private router: Router) {
        router.subscribe(route => { this.hasContent = !!route; });
        this.filteredContentItems = this.contentItems.slice(0);
    }

    filterContentItems(query: string): any[] {
        if (query && 0 < query.length) {
            this.filteredContentItems = this.contentItems.filter((item: any) => {
                return -1 < item.title.toLowerCase().indexOf(query.toLowerCase());
            });
        } else {
            this.filteredContentItems = this.contentItems.slice(0);
        }
    }

    closeContent(): void {
        this.hasContent = false;
    }

    toggleMenu(newState: boolean): void {
        this.displayMenu = newState;
    }
}
