import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component, Directive, Input} from '@angular/core';
import {async, fakeAsync, inject, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterLink, RouterLinkWithHref} from '@angular/router';

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
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A" },
                    { text: "B" }
                ]'></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(2);
                expect(linkTexts(fixture)).toEqual(['A', 'B']);
            })
        ))
    );

    it('uses the href values provided',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]='[
                    { text: "A", href: "/absolute" },
                    { text: "B", href: "./relative.html" },
                    { text: "C", href: "#hashlocation" }
                ]'></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
                fixture.detectChanges();
                let nativeLinks: HTMLAnchorElement[] = fixture.nativeElement.querySelectorAll('a');

                expect(nativeLinks.length).toBe(3);
                expect(linkHrefs(fixture)).toEqual(['/absolute', './relative.html', '#hashlocation']);
            })
        ))
    );

    it('changes the text of the created links with the bound input property',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
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
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="links"></gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
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
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.overrideTemplate(TestComponent, `
                <gtx-breadcrumbs [links]="[
                    { text: 'A', href: '/a' },
                    { text: 'B', href: '/b' },
                    { text: 'C', href: '/c' }
                ]" [disabled]="disableBreadcrumbs">
                </gtx-breadcrumbs>
            `)
            .createAsync(TestComponent)
            .then(fixture => {
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
            .then(fixture => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));

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
            .then(fixture => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));

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
            .then(fixture => {
                const component: TestComponent = fixture.componentInstance;
                const spy = spyOn(component, 'onClick');
                component.links = [
                    { text: 'X', href: '/x', someKey: 'someValue' }
                ];

                fixture.detectChanges();
                expect(spy.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                expect(linkToClick).not.toBeNull();

                linkToClick.triggerEventHandler('click', new MouseEvent('click', {}));

                expect(spy.calls.count()).toBe(1, 'click handler was not called');
                expect(spy).toHaveBeenCalledWith({ text: 'X', href: '/x', someKey: 'someValue' });
                expect(spy.calls.mostRecent().args[0]).toEqual(component.links[0]); // toEqual compares by reference
            })
        ))
    );

    describe('Router link capabilities', () => {

        let createdRouterLinks: MockRouterLink[];
        beforeEach(() => { createdRouterLinks = MockRouterLink.createdRouterLinks = []; });

        it('creates links with the text provided in "routerLinks"',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-breadcrumbs [routerLinks]="routerLinks"></gtx-breadcrumbs>
                `)
                .overrideDirective(Breadcrumbs, RouterLink, MockRouterLink)
                .overrideDirective(Breadcrumbs, RouterLinkWithHref, MockRouterLink)
                .createAsync(TestComponent)
                .then(fixture => {
                    let instance = fixture.componentRef.instance;

                    instance.routerLinks = [
                        { text: 'A', route: ['/TestA/TestB/TestC'] },
                        { text: 'B', route: ['/TestA', 'TestB', 'TestC'] }
                    ];
                    fixture.detectChanges();
                    expect(linkTexts(fixture)).toEqual(['A', 'B']);

                    instance.routerLinks.push({ text: 'C', route: ['./TestC'] });
                    fixture.detectChanges();
                    expect(linkTexts(fixture)).toEqual(['A', 'B', 'C']);
                })
            ))
        );

        it('forwards the "route" property to the routerLink directive',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "A", route: ["/TestA/TestB/TestC"] },
                        { text: "B", route: "./TestB" },
                        { text: "C", route: ["/TestA", "TestB", "TestC"] }
                    ]'></gtx-breadcrumbs>
                `)
                .overrideDirective(Breadcrumbs, RouterLink, MockRouterLink)
                .overrideDirective(Breadcrumbs, RouterLinkWithHref, MockRouterLink)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();

                    expect(createdRouterLinks.length).toBe(3);
                    expect(createdRouterLinks[0].commands).toEqual(['/TestA/TestB/TestC']);
                    expect(createdRouterLinks[1].commands).toEqual(['./TestB']);
                    expect(createdRouterLinks[2].commands).toEqual(['/TestA', 'TestB', 'TestC']);
                })
            ))
        );

        /*
         * The test below does not work yet - At the current angular revision,
         * the RouterLink directive can not be disabled. A working solution is "pointer-events: none",
         * but that does not prevent the click event in tests and is not testable.
         * This might change with a future revision of angular.
         */
        xit('does not change the URL on router link click when disabled',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
                tcb.overrideTemplate(TestComponent, `
                    <gtx-breadcrumbs [routerLinks]='[
                        { text: "C1", route: ["/TestA", "TestB", "TestC"] },
                        { text: "C2", route: ["/TestA", "TestB", "TestC-2"] }
                    ]' disabled></gtx-breadcrumbs>
                `)
                .createAsync(TestComponent)
                .then(fixture => {
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    let generatedLinks = fixture.debugElement.queryAll(By.css('a'));
                    expect(generatedLinks.length).toBe(2);
                    expect(createdRouterLinks.length).toBe(0);
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


@Directive({
    selector: '[routerLink]'
})
class MockRouterLink {
    static createdRouterLinks: MockRouterLink[] = [];
    commands: any[] = [];

    constructor() {
        MockRouterLink.createdRouterLinks.push(this);
    }

    @Input()
    set routerLink(data: any[]|string) {
        if (Array.isArray(data)) {
            this.commands = data;
        } else {
            this.commands = [data];
        }
    }
}
