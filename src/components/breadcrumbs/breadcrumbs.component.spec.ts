import {LocationStrategy} from '@angular/common';
import {Component} from '@angular/core';
import {ComponentFixture, getTestBed, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {of as observableOf} from 'rxjs';

import {componentTest, createClickEvent} from '../../testing';
import {Button} from '../button/button.component';
import {Icon} from '../icon/icon.directive';
import {UserAgentRef} from '../modal/user-agent-ref';
import {Breadcrumbs, IBreadcrumbLink, IBreadcrumbRouterLink} from './breadcrumbs.component';

/**
 * Helper function get text of all <a> tags inside a component
 */
function linkTexts(fixture: ComponentFixture<any>): string[] {
    return Array.prototype.map.call(
        fixture.nativeElement.querySelectorAll('a.breadcrumb'),
        (a: HTMLAnchorElement) => a.innerText.trim()
    );
}

/**
 * Helper function get href attribute of all <a> tags inside a component
 */
function linkHrefs(fixture: ComponentFixture<any>): string[] {
    return Array.prototype.map.call(
        fixture.nativeElement.querySelectorAll('a.breadcrumb'),
        (a: HTMLAnchorElement) => a.getAttribute('href')
    );
}


describe('Breadcrumbs:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forChild([])],
            providers: [
                UserAgentRef,
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: LocationStrategy, useClass: MockLocationStrategy }
            ],
            declarations: [Breadcrumbs, Button, Icon, TestComponent]
        });
    });

    it('creates a breadcrumbs bar with the link texts provided',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs multilineExpanded='true' [links]='[
                { text: "A" },
                { text: "B" }
            ]'></gtx-breadcrumbs>`,
            fixture => {
                fixture.detectChanges();
                tick(1000);
                let links = linkTexts(fixture);

                expect(links.length).toBe(2);
                expect(links).toEqual(['A', 'B']);
            }
        )
    );

    it('uses the href values provided',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs [links]='[
                { text: "A", href: "/absolute" },
                { text: "B", href: "./relative.html" },
                { text: "C", href: "#hashlocation" }
            ]'></gtx-breadcrumbs>`,
            fixture => {
                fixture.detectChanges();
                tick(1000);
                let hrefs = linkHrefs(fixture);

                expect(hrefs.length).toBe(3);
                expect(hrefs).toEqual(['/absolute', './relative.html', '#hashlocation']);
            }
        )
    );

    it('changes the text of the created links with the bound input property',
        componentTest(() => TestComponent, (fixture, component) => {
            let links = component.links = [
                { text: 'A' },
                { text: 'B' },
                { text: 'C' }
            ];

            fixture.detectChanges();
            tick(1000);
            expect(linkTexts(fixture)).toEqual(['A', 'B', 'C']);

            // Change by reference (changing values directly is no longer supported due to ChangeDetectionStrategy.OnPush)
            component.links = [
                { text: 'AAA' },
                { text: 'BBB' },
                { text: 'CCC' }
            ];
            fixture.detectChanges();

            expect(linkTexts(fixture)).toEqual(['AAA', 'BBB', 'CCC'],
                'text of breadcrumb links did not change by reference');
        })
    );

    it('changes the href of the created links with the bound input property',
        componentTest(() => TestComponent, (fixture, component) => {
            let links = component.links = [
                { text: 'A', href: '/a' },
                { text: 'B', href: './b' },
                { text: 'C', href: '#c' }
            ];

            fixture.detectChanges();
            tick(1000);
            expect(linkHrefs(fixture)).toEqual(['/a', './b', '#c']);

            // Change by value
            links[0].href = '/aa';
            links[1].href = './bb';
            links[2].href = '#cc';
            fixture.detectChanges();
            tick(1000);

            expect(linkHrefs(fixture)).toEqual(['/aa', './bb', '#cc'],
                'href of breadcrumb links did not change by value');

            // Change by reference
            component.links = [
                { text: 'A', href: '/aaa' },
                { text: 'B', href: './bbb' },
                { text: 'C', href: '#ccc' }
            ];
            fixture.detectChanges();
            tick(1000);

            expect(linkHrefs(fixture)).toEqual(['/aaa', './bbb', '#ccc'],
                'href of breadcrumb links did not change by reference');
        })
    );

    it('removes the href attribute of links when disabled',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs [links]="[
                { text: 'A', href: '/a' },
                { text: 'B', href: '/b' },
                { text: 'C', href: '/c' }
            ]" [disabled]="disableBreadcrumbs">
            </gtx-breadcrumbs>`,
            (fixture, component) => {
                component.disableBreadcrumbs = false;
                fixture.detectChanges();
                tick(1000);
                expect(linkHrefs(fixture)).toEqual(['/a', '/b', '/c']);

                component.disableBreadcrumbs = true;
                fixture.detectChanges();
                tick(1000);
                expect(linkHrefs(fixture)).toEqual([null, null, null]);

                component.disableBreadcrumbs = false;
                fixture.detectChanges();
                tick(1000);
                expect(linkHrefs(fixture)).toEqual(['/a', '/b', '/c']);
            }
        )
    );


    it('forwards clicks on its links to the "linkClick" EventEmitter',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs
                [links]="[{ text: 'A', href: '/a' }]"
                (linkClick)="onLinkClick($event)">
            </gtx-breadcrumbs>`,
            (fixture, component) => {
                const onLinkClick = component.onLinkClick = jasmine.createSpy('onLinkClick');

                fixture.detectChanges();
                tick(1000);
                expect(onLinkClick.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', createClickEvent());

                expect(onLinkClick).toHaveBeenCalledTimes(1);
                expect(onLinkClick).toHaveBeenCalledWith({ text: 'A', href: '/a' });
            }
        )
    );

    it('does not forward clicks to the "linkClick" EventEmitter when disabled',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs
                [links]="[{ text: 'A', href: '/a' }]"
                (linkClick)="onLinkClick($event)" disabled>
            </gtx-breadcrumbs>`,
            (fixture, component) => {
                const onLinkClick = component.onLinkClick = jasmine.createSpy('onLinkClick');

                fixture.detectChanges();
                tick(1000);
                expect(onLinkClick.calls.count()).toBe(0);

                let linkToClick = fixture.debugElement.query(By.css('a'));
                linkToClick.triggerEventHandler('click', createClickEvent());

                expect(onLinkClick.calls.count()).toBe(0);
            }
        )
    );

    it('does not create a back button when there is only one link',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs [links]="links" [routerLinks]="routerLinks">
            </gtx-breadcrumbs>`,
            (fixture, component) => {
                component.links = [
                    { text: 'X', href: '/x', someKey: 'someValue' }
                ];
                component.routerLinks = [];

                fixture.detectChanges();
                tick(1000);
                expect(fixture.nativeElement.querySelector('.back-button')).toBeNull();

                component.links = [];
                component.routerLinks = [
                    { text: 'Y', route: ['/route', 'y'] }
                ];

                fixture.detectChanges();
                tick(1000);
                expect(fixture.nativeElement.querySelector('.back-button')).toBeNull();
            }
        )
    );

    it('creates a back button when there are 2 or more links',
        componentTest(() => TestComponent, `
            <gtx-breadcrumbs [links]="links" [routerLinks]="routerLinks">
            </gtx-breadcrumbs>`,
            (fixture, component) => {

                // Links, but no router links
                component.links = [
                    { text: 'X', href: '/x', someKey: 'someValue' },
                    { text: 'Y', href: '/y', someKey: 'someOtherValue' }
                ];
                component.routerLinks = [];

                fixture.detectChanges();
                tick(1000);
                expect(fixture.nativeElement.querySelector('.back-button')).toBeDefined();

                // No links, but router links
                component.links = [];
                component.routerLinks = [
                    { text: 'A', route: ['/route', 'a'] },
                    { text: 'B', route: ['/route', 'b'] }
                ];

                fixture.detectChanges();
                tick(1000);
                expect(fixture.nativeElement.querySelector('.back-button')).toBeDefined();

                // Both links and router links
                component.links = [
                    { text: 'X', href: '/x', someKey: 'someValue' }
                ];
                component.routerLinks = [
                    { text: 'A', route: ['/route', 'a'] }
                ];

                fixture.detectChanges();
                tick(1000);
                expect(fixture.nativeElement.querySelector('.back-button')).toBeDefined();
            }
        )
    );

    it('forwards the "links" input value to the "linkClick" EventEmitter by reference',
        componentTest(() => TestComponent, (fixture, component) => {
            const onLinkClick = component.onLinkClick = jasmine.createSpy('onLinkClick');
            component.links = [
                { text: 'X', someKey: 'someValue' }
            ];

            fixture.detectChanges();
            tick(1000);
            expect(onLinkClick).not.toHaveBeenCalled();

            let linkToClick = fixture.debugElement.query(By.css('a'));
            expect(linkToClick).not.toBeNull();

            linkToClick.triggerEventHandler('click', createClickEvent());

            expect(onLinkClick).toHaveBeenCalledTimes(1);
            expect(onLinkClick).toHaveBeenCalledWith({ text: 'X', someKey: 'someValue' });
            expect(onLinkClick.calls.mostRecent().args[0]).toEqual(component.links[0]);
        })
    );

    describe('Router link capabilities', () => {

        it('creates links with the text provided in "routerLinks"',
            componentTest(() => TestComponent, `
                <gtx-breadcrumbs multilineExpanded='true' [routerLinks]="routerLinks">
                </gtx-breadcrumbs>`,
                (fixture, instance) => {
                    instance.routerLinks = [
                        { text: 'A', route: ['/TestA/TestB/TestC'] },
                        { text: 'B', route: ['/TestA', 'TestB', 'TestC'] }
                    ];
                    fixture.detectChanges();
                    tick(1000);
                    expect(linkTexts(fixture)).toEqual(['A', 'B']);

                    instance.routerLinks.push({ text: 'C', route: ['./TestC'] });
                    fixture.detectChanges();
                    tick(1000);
                    expect(linkTexts(fixture)).toEqual(['A', 'B', 'C']);
                }
            )
        );

        it('forwards the "route" property to the routerLink directive',
            componentTest(() => TestComponent, `
                <gtx-breadcrumbs [routerLinks]='[
                    { text: "A", route: ["/TestA/TestB/TestC"] },
                    { text: "B", route: "./TestB" },
                    { text: "C", route: ["/TestA", "TestB", "TestC"] }
                ]'></gtx-breadcrumbs>`,
                fixture => {
                    fixture.detectChanges();
                    tick(1000);

                    let links = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('a.breadcrumb'));
                    expect(links.length).toBe(3);

                    let hrefs = links.map(link => link.getAttribute('href'));
                    expect(hrefs).toEqual(['/TestA/TestB/TestC', './TestB', '/TestA/TestB/TestC']);
                }
            )
        );

        it('changes the URL on router link click when enabled',
            componentTest(() => TestComponent, `
                <gtx-breadcrumbs [routerLinks]='[
                    { text: "Link1", route: ["/TestA", "TestB", "TestC"] }
                ]'>
                </gtx-breadcrumbs>`,
                fixture => {
                    let router: MockRouter = getTestBed().get(Router);
                    router.createUrlTree = (commands: string[], options: any) => commands;
                    router.navigateByUrl = jasmine.createSpy('navigateByUrl');

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    tick(1000);

                    let generatedLinks = fixture.debugElement.queryAll(By.css('a'));
                    expect(generatedLinks.length).toBe(1);

                    let nativeLink: HTMLAnchorElement = generatedLinks[0].nativeElement;
                    let clickEvent = createClickEvent(nativeLink);
                    nativeLink.dispatchEvent(clickEvent);

                    expect(router.navigateByUrl)
                        .toHaveBeenCalledWith(['/TestA', 'TestB', 'TestC'], jasmine.anything());
                }
            )
        );

        it('does not change the URL on router link click when disabled',
            componentTest(() => TestComponent, `
                <gtx-breadcrumbs disabled [routerLinks]="[
                    { text: 'Link1', route: ['/TestA', 'TestB', 'TestC'] }
                ]">
                </gtx-breadcrumbs>`,
                (fixture, testComponent) => {
                    let router: MockRouter = getTestBed().get(Router);
                    router.createUrlTree = (commands: string[], options: any) => commands;
                    router.navigateByUrl = jasmine.createSpy('navigateByUrl');

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    tick(1000);

                    let generatedLinks = fixture.debugElement.queryAll(By.css('a'));
                    expect(generatedLinks.length).toBe(1);

                    expect(router.navigateByUrl).toHaveBeenCalledTimes(0);

                    let nativeLink: HTMLAnchorElement = generatedLinks[0].nativeElement;
                    let clickEvent = createClickEvent(nativeLink);
                    nativeLink.dispatchEvent(clickEvent);
                    expect(clickEvent.defaultPrevented).toBe(true);

                    expect(router.navigateByUrl).not.toHaveBeenCalled();
                }
            )
        );

    });

});


class MockRouter {
    events = observableOf([]);
    createUrlTree(commands: string[], options: any): any {
        return commands;
    }
    navigateByUrl(urlTree: any): void {}
    serializeUrl(urlTree: string[]): string {
        return urlTree.join('/');
    }
}
class MockActivatedRoute { }
class MockLocationStrategy {
    prepareExternalUrl(internal: string): string {
        return internal;
    }
}
class MockUsageActions {
    getTotalUsage(): void {}
}


@Component({
    template: `
        <gtx-breadcrumbs
            multilineExpanded="true"
            [links]="links"
            (linkClick)="onLinkClick($event)">
        </gtx-breadcrumbs>`
})
class TestComponent {
    links: IBreadcrumbLink[] = [];
    routerLinks: IBreadcrumbRouterLink[] = [];
    disableBreadcrumbs = false;
    onLinkClick(): void {}
}
