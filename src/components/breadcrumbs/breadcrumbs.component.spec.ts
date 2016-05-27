import {Component, provide} from '@angular/core';
import {By} from '@angular/platform-browser';
import {beforeEach, beforeEachProviders, describe, expect, fakeAsync, inject, it, xit, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
// Dependencies that will change when replacing router-deprecated
import {Location} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
import {Router, RouteConfig, RouteRegistry, ROUTER_DIRECTIVES, ROUTER_PRIMARY_COMPONENT} from '@angular/router-deprecated';
import {RootRouter} from '@angular/router-deprecated/src/router';

import {
    Breadcrumbs,
    IBreadcrumbLink,
    IBreadcrumbRouterLink
} from './breadcrumbs.component';


/**
 * Helper function get text of all <a> tags inside a component
 */
function linkTexts(fixture: ComponentFixture<any>): string[] {
    return Array.prototype.map.call(
        fixture.nativeElement.querySelectorAll('a'),
        (a: HTMLAnchorElement) => a.innerText
    );
}

/**
 * Helper function get href attribute of all <a> tags inside a component
 */
function linkHrefs(fixture: ComponentFixture<any>): string[] {
    return Array.prototype.map.call(
        fixture.nativeElement.querySelectorAll('a'),
        (a: HTMLAnchorElement) => a.getAttribute('href')
    );
}


describe('Breadcrumbs:', () => {

    it('creates a breadcrumbs bar with the link texts provided', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A" },
                    { text: "B" }
                ]'></gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(2);
                expect(linkTexts(fixture)).toEqual(['A', 'B']);
            });
        })
    ));

    it('uses the href values provided', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A", href: "/absolute" },
                    { text: "B", href: "./relative.html" },
                    { text: "C", href: "#hashlocation" }
                ]'></gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(3);
                expect(linkHrefs(fixture)).toEqual(['/absolute', './relative.html', '#hashlocation']);
            });
        })
    ));

    it('changes the text of the created links with the bound input property', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let component: TestComponent = fixture.componentInstance;
                let links = component.links = [
                    { text: 'A' },
                    { text: 'B' },
                    { text: 'C' }
                ];

                fixture.detectChanges();
                expect(linkTexts(fixture)).toEqual(['A', 'B', 'C']);

                // Change by value
                links[0].text = 'AA';
                links[1].text = 'BB';
                links[2].text = 'CC';
                fixture.detectChanges();

                expect(linkTexts(fixture)).toEqual(['AA', 'BB', 'CC'],
                    'text of breadcrumb links did not change by value');

                // Change by reference
                component.links = [
                    { text: 'AAA' },
                    { text: 'BBB' },
                    { text: 'CCC' }
                ];
                fixture.detectChanges();

                expect(linkTexts(fixture)).toEqual(['AAA', 'BBB', 'CCC'],
                    'text of breadcrumb links did not change by reference');
            });
        })
    ));

    it('changes the href of the created links with the bound input property', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let component: TestComponent = fixture.componentInstance;
                let links = component.links = [
                    { text: 'A', href: '/a' },
                    { text: 'B', href: './b' },
                    { text: 'C', href: '#c' }
                ];

                fixture.detectChanges();
                expect(linkHrefs(fixture)).toEqual(['/a', './b', '#c']);

                // Change by value
                links[0].href = '/aa';
                links[1].href = './bb';
                links[2].href = '#cc';
                fixture.detectChanges();

                expect(linkHrefs(fixture)).toEqual(['/aa', './bb', '#cc'],
                    'href of breadcrumb links did not change by value');

                // Change by reference
                component.links = [
                    { text: 'A', href: '/aaa' },
                    { text: 'B', href: './bbb' },
                    { text: 'C', href: '#ccc' }
                ];
                fixture.detectChanges();

                expect(linkHrefs(fixture)).toEqual(['/aaa', './bbb', '#ccc'],
                    'href of breadcrumb links did not change by reference');
            });
        })
    ));

    it('removes the href attribute of links when disabled', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' },
                    { text: 'B', href: '/b' },
                    { text: 'C', href: '/c' }
                ]" [disabled]="disableBreadcrumbs">
                </gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                let component: TestComponent = fixture.componentInstance;

                component.disableBreadcrumbs = false;
                fixture.detectChanges();
                expect(linkHrefs(fixture)).toEqual(['/a', '/b', '/c']);

                component.disableBreadcrumbs = true;
                fixture.detectChanges();
                expect(linkHrefs(fixture)).toEqual([null, null, null]);

                component.disableBreadcrumbs = false;
                fixture.detectChanges();
                expect(linkHrefs(fixture)).toEqual(['/a', '/b', '/c']);
            });
        })
    ));


    it('forwards clicks on its links to the "clicked" EventEmitter', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' }
                ]" (clicked)="onClick($event)">
                </gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));
                tick(50);

                expect(spy.calls.count()).toBe(1);
                expect(spy).toHaveBeenCalledWith({ text: 'A', href: '/a' });
            });
        })
    ));

    it('does not forward clicks to the "clicked" EventEmitter when disabled', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' }
                ]" (clicked)="onClick($event)" disabled>
                </gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));
                tick(50);

                expect(spy.calls.count()).toBe(0);
            });
        })
    ));

    it('forwards the "links" input value to the "clicked" EventEmitter by reference', fakeAsync(
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links" (clicked)="onClick($event)"></gtx-breadcrumbs>
            `).createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');
                component.links = [
                    { text: 'X', href: '/x', someKey: 'someValue' }
                ];

                fixture.detectChanges();
                tick();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                expect(linkToClick).not.toBeNull();

                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));
                tick(50);

                expect(spy.calls.count()).toBe(1, 'click handler was not called');
                expect(spy).toHaveBeenCalledWith({ text: 'X', href: '/x', someKey: 'someValue' });
                expect(spy.calls.mostRecent().args[0]).toEqual(component.links[0]); // toEqual compares by reference
            });
        })
    ));

    // describe('Router link capabilities', () => {
    //     beforeEachProviders(() => [
    //         RouteRegistry,
    //         { provide: Location, useClass: SpyLocation },
    //         { provide: ROUTER_PRIMARY_COMPONENT, useValue: TestRoutingComponent },
    //         { provide: Router, useClass: RootRouter }
    //     ]);
    //
    //     // TODO
    // });

});

@Component({
    template: `<gtx-breadcrumbs></gtx-breadcrumbs>`,
    directives: [Breadcrumbs]
})
class TestComponent {
    links: IBreadcrumbLink[] = [];
    routerLinks: IBreadcrumbRouterLink[] = [];
    disableBreadcrumbs = false;
    onClick(): void {}
}

/* 3-ancestor component setup to test routing */

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [TestComponent]
})
@RouteConfig([
    { name: 'TestC', path: 'component-C-url', component: TestComponent }
])
class RoutedTestComponentB { }

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { name: 'TestB', path: 'component-B-url', component: RoutedTestComponentB }
])
class RoutedTestComponentA { }

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { name: 'TestA', path: 'component-A-url', component: RoutedTestComponentA }
])
class TestRoutingComponent { }
