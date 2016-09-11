import {ComponentFixture} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {tick} from '@angular/core/testing';

import {componentTest} from '../../../testing';
import {TrustedHTMLPipe} from './trusted-html.pipe';


describe('TrustedHTMLPipe', () => {

    it('returns the passed html as trusted',
        componentTest(() => TestComponent, `
            <div [innerHTML]="html | trustedHTML"></div>`,
            fixture => {
                fixture.componentInstance.html = '<p>two</p><p>elements</p>';
                fixture.detectChanges();
                expect(fixture.nativeElement.children.length).toBe(1);
                expect(fixture.nativeElement.children[0].children.length).toBe(2);

                fixture.componentInstance.html = '<span>only one element</span>';
                fixture.detectChanges();
                expect(fixture.nativeElement.children.length).toBe(1);
                expect(fixture.nativeElement.children[0].children.length).toBe(1);
            }
        )
    );

    it('is pure', () => {
        let pipeInstance: TrustedHTMLPipe;
        const test = componentTest(() => TestComponent, fixture => {
            expect(pipeInstance).not.toBeDefined();

            fixture.componentInstance.html = 'first value';
            fixture.detectChanges();
            expect(pipeInstance).toBeDefined();
            expect(pipeInstance.transform).toHaveBeenCalledTimes(1);

            // The transform() method should only be called when the input changes
            fixture.detectChanges();
            tick();
            expect(pipeInstance.transform).toHaveBeenCalledTimes(1);

            fixture.componentInstance.html = 'other value';
            fixture.detectChanges();
            expect(pipeInstance.transform).toHaveBeenCalledTimes(2);

            fixture.componentInstance.html = 'other value';
            fixture.detectChanges();
            expect(pipeInstance.transform).toHaveBeenCalledTimes(2);
        });

        const originalTransform = TrustedHTMLPipe.prototype.transform;
        TrustedHTMLPipe.prototype.transform = jasmine
            .createSpy('transform', originalTransform)
            .and.callFake(function (html: string): any {
                pipeInstance = this;
                return originalTransform.call(this, html);
            });

        try {
            test();
        } finally {
            TrustedHTMLPipe.prototype.transform = originalTransform;
        }
    });

});


@Component({
    template: `<div [innerHTML]="html | trustedHTML"></div>`,
    pipes: [TrustedHTMLPipe]
})
class TestComponent {
    html: string = 'some html';
}
