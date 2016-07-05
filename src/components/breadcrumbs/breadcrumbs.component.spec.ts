import {Location} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {addProviders, fakeAsync, inject, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router, Route, ROUTER_DIRECTIVES, provideRouter} from '@angular/router';

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

    it('creates a breadcrumbs bar with the link texts provided',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A" },
                    { text: "B" }
                ]'></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(2);
                expect(linkTexts(fixture)).toEqual(['A', 'B']);
            })
        )
    );

    it('uses the href values provided',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A", href: "/absolute" },
                    { text: "B", href: "./relative.html" },
                    { text: "C", href: "#hashlocation" }
                ]'></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(3);
                expect(linkHrefs(fixture)).toEqual(['/absolute', './relative.html', '#hashlocation']);
            })
        )
    );

    it('changes the text of the created links with the bound input property',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
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
            })
        ))
    );

    it('changes the href of the created links with the bound input property',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
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
            })
        ))
    );

    it('removes the href attribute of links when disabled',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' },
                    { text: 'B', href: '/b' },
                    { text: 'C', href: '/c' }
                ]" [disabled]="disableBreadcrumbs">
                </gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
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
            })
        ))
    );


    it('forwards clicks on its links to the "linkClick" EventEmitter',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' }
                ]" (linkClick)="onClick($event)">
                </gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
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
            })
        ))
    );

    it('does not forward clicks to the "linkClick" EventEmitter when disabled',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' }
                ]" (linkClick)="onClick($event)" disabled>
                </gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then((fixture: ComponentFixture<TestComponent>) => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));
                tick(50);

                expect(spy.calls.count()).toBe(0);
            })
        ))
    );

    it('forwards the "links" input value to the "linkClick" EventEmitter by reference',
        fakeAsync(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs
                    [links]="links"
                    (linkClick)="onClick($event)">
                </gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
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
            })
        ))
    );

    /**
     * Since upgrading to the v3 router (with rc.2) these tests no longer work.
     * Needs some investigation to figure out how to fix.
     * Possibly helpful: https://github.com/angular/vladivostok/issues/45
     */
    describe('Router link capabilities', () => {
        beforeEach(() => addProviders([
            ROUTER_DIRECTIVES,
            provideRouter(getRoutes()),
            { provide: Location, useClass: SpyLocation }
        ]));

        xit('creates links with the text provided in "routerLinks"',
            fakeAsync(inject([TestComponentBuilder, Location], (tcb: TestComponentBuilder, spyLocation: SpyLocation) =>
                tcb.overrideTemplate(TestRoutingComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "A", route: ["/TestA/TestB/TestC"] },
                        { text: "B", route: ["/TestA", "TestB", "TestC"] }
                    ]'></gtx-breadcrumbs>
                    <router-outlet></router-outlet>
                `)
                .createAsync(TestRoutingComponent)
                .then((fixture: ComponentFixture<TestRoutingComponent>) => {
                    fixture.detectChanges();
                    spyLocation.simulateUrlPop('component-A-url/component-B-url/component-C-url');
                    tick();
                    fixture.detectChanges();
                    let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                    expect(nativeLinks.length).toBe(2);
                    expect(linkTexts(fixture)).toEqual(['A', 'B']);
                })
            ))
        );

        xit('sets the "href" of links created via "routerLinks" to their router URL',
            fakeAsync(inject([TestComponentBuilder, Location], (tcb: TestComponentBuilder, spyLocation: SpyLocation) =>
                tcb.overrideTemplate(TestRoutingComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "A", route: ["/TestA/TestB/TestC"] },
                        { text: "B", route: ["/TestA", "TestB", "TestC"] }
                    ]'></gtx-breadcrumbs>
                    <router-outlet></router-outlet>
                `)
                .createAsync(TestRoutingComponent)
                .then((fixture: ComponentFixture<TestRoutingComponent>) => {
                    fixture.detectChanges();
                    spyLocation.simulateUrlPop('component-A-url/component-B-url/component-C-url');
                    tick();
                    fixture.detectChanges();

                    expect(linkHrefs(fixture)).toEqual([
                        '/component-A-url/component-B-url/component-C-url',
                        '/component-A-url/component-B-url/component-C-url'
                    ]);
                })
            ))
        );

        xit('changes to the correct URL when clicking links created via "routerLink"',
            fakeAsync(inject([TestComponentBuilder, Location], (tcb: TestComponentBuilder, spyLocation: SpyLocation) =>
                tcb.overrideTemplate(TestRoutingComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "1", route: ["/TestA", "TestB", "TestC"] },
                        { text: "2", route: ["/TestA", "TestB", "TestC-2"] },
                        { text: "3", route: ["/TestA", "TestB", "TestC-3"] }
                    ]'></gtx-breadcrumbs>
                    <router-outlet></router-outlet>
                `)
                .createAsync(TestRoutingComponent)
                .then((fixture: ComponentFixture<TestRoutingComponent>) => {
                    fixture.detectChanges();
                    spyLocation.simulateUrlPop('component-A-url/component-B-url/component-C-url');
                    tick();
                    fixture.detectChanges();

                    let generatedLinks = fixture.debugElement.queryAll(By.css('a'));
                    expect(generatedLinks.length).toBe(3);

                    generatedLinks[1].triggerEventHandler('click', new MouseEvent('click', {}));
                    tick(50);
                    expect(spyLocation.urlChanges).toEqual([
                        '/component-A-url/component-B-url/component-C-2-url'
                    ]);

                    generatedLinks[2].triggerEventHandler('click', new MouseEvent('click', {}));
                    tick(50);
                    expect(spyLocation.urlChanges).toEqual([
                        '/component-A-url/component-B-url/component-C-2-url',
                        '/component-A-url/component-B-url/component-C-3-url'
                    ]);
                })
            ))
        );

        /*
         * The test below does not work yet.
         * At the current angular revision, the RouterLink directive can not be disabled.
         * Only working solution is "pointer-events: none", which does not prevent the click event.
         * This might change with a future revision of angular.
         */
        xit('does not change the URL on router link click when disabled',
            fakeAsync(inject([TestComponentBuilder, Location], (tcb: TestComponentBuilder, spyLocation: SpyLocation) =>
                tcb.overrideTemplate(TestRoutingComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "C1", route: ["/TestA", "TestB", "TestC"] },
                        { text: "C2", route: ["/TestA", "TestB", "TestC-2"] }
                    ]' disabled></gtx-breadcrumbs>
                    <router-outlet></router-outlet>
                `)
                .createAsync(TestRoutingComponent)
                .then((fixture: ComponentFixture<TestRoutingComponent>) => {
                    fixture.detectChanges();
                    spyLocation.simulateUrlPop('component-A-url/component-B-url/component-C-url');
                    tick();
                    fixture.detectChanges();

                    let generatedLinks = fixture.debugElement.queryAll(By.css('a'));
                    expect(generatedLinks.length).toBe(2);

                    generatedLinks[1].triggerEventHandler('click', new MouseEvent('click', {}));
                    tick(50);
                    expect(spyLocation.urlChanges).toEqual([]);
                })
            ))
        );

    });

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
    template: `no content`
})
class RoutedTestComponentC { }

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [TestComponent]
})
class RoutedTestComponentB { }

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: []
})
class RoutedTestComponentA { }

@Component({
    template: `<router-outlet></router-outlet>`,
    directives: [Breadcrumbs]
})
class TestRoutingComponent { }

function getRoutes(): Route[] {
    return [
        { path: 'component-C-url', component: RoutedTestComponentC },
        { path: 'component-C-2-url', component: RoutedTestComponentC },
        { path: 'component-C-3-url', component: RoutedTestComponentC },
        { path: 'component-B-url/...', component: RoutedTestComponentB },
        { path: 'component-A-url/...', component: RoutedTestComponentA }
    ];
}
