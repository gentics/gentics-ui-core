import {describe, expect, it} from '@angular/core/testing';
import {OverlayHostService} from './../overlay-host/overlay-host.service';

let overlayHostService: OverlayHostService;
const dummyHostView: any = 'dummy_hostview';

describe('OverlayHostService:', () => {

    beforeEach(() => {
        overlayHostService = new OverlayHostService();
    });

    describe('getHostView()', () => {
        it('should return a promise', () => {
            expect(overlayHostService.getHostView().then).toBeDefined();
        });

        it('should resolve immediately if view is already registered', (done: Function) => {
            overlayHostService.registerHostView(dummyHostView);
            let promise = overlayHostService.getHostView();
            promise.then((val: any) => {
                expect(val).toBe(dummyHostView);
                done();
            });
        });

        it('should resolve when the view is registered later', (done: Function) => {
            let promise = overlayHostService.getHostView();
            promise.then((val: any) => {
                expect(val).toBe(dummyHostView);
                done();
            });
            overlayHostService.registerHostView(dummyHostView);
        });
    });

});
