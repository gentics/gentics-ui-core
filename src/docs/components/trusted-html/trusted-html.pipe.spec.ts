import {Component, Pipe} from '@angular/core';
import {fakeAsync, inject, tick} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {DomSanitizationService} from '@angular/platform-browser/src/security/dom_sanitization_service';

import {TrustedHTMLPipe} from './trusted-html.pipe';

describe('TrustedHTMLPipe', () => {

    it('should keep passed html', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideTemplate(TestComponent, `<div [innerHTML]="html | trustedHTML"></div>`)
        .createAsync(TestComponent).then(fixture => {

            fixture.componentInstance.html = '<p>two</p><p>elements</p>';
            fixture.detectChanges();
            expect(fixture.nativeElement.children.length).toBe(1);
            expect(fixture.nativeElement.children[0].children.length).toBe(2);

            fixture.componentInstance.html = '<span>only one element</span>';
            fixture.detectChanges();
            expect(fixture.nativeElement.children.length).toBe(1);
            expect(fixture.nativeElement.children[0].children.length).toBe(1);
        });
    }));

    it('is pure', inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
        tcb.overrideProviders(TrustedHTMLPipe, [{ provide: TrustedHTMLPipe, useClass: PipeMock }])
        .overrideTemplate(TestComponent, `<div [innerHTML]="html | pipeMock"></div>`)
        .createAsync(TestComponent).then(fixture => {

            // The transform() method should only be called when the input changes
            fixture.componentInstance.html = 'first value';
            fixture.detectChanges();
            expect(PipeMock.callsOfLastPipe()).toEqual(1);

            fixture.detectChanges();
            tick();
            expect(PipeMock.callsOfLastPipe()).toEqual(1);

            fixture.componentInstance.html = 'other value';
            fixture.detectChanges();
            expect(PipeMock.callsOfLastPipe()).toEqual(2);

            fixture.componentInstance.html = 'other value';
            fixture.detectChanges();
            expect(PipeMock.callsOfLastPipe()).toEqual(2);
        });
    })));

});

@Pipe({ name: 'pipeMock', pure: true })
class PipeMock {

    static lastPipe: PipeMock;
    transformCalls: number = 0;
    private realPipe: TrustedHTMLPipe;

    static callsOfLastPipe(): number {
        return PipeMock.lastPipe ? PipeMock.lastPipe.transformCalls : 0;
    }

    constructor (sanitizer: DomSanitizationService) {
        this.realPipe = new TrustedHTMLPipe(sanitizer);
    }

    transform(html: string): any {
        PipeMock.lastPipe = this;
        this.transformCalls += 1;
        return this.realPipe.transform(html);
    }
}

@Component({
    template: `<div [innerHTML]="html | trustedHTML"></div>`,
    pipes: [TrustedHTMLPipe, PipeMock]
})
class TestComponent {
    html: string = 'some html';
}
