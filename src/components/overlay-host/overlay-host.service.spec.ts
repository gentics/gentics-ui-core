import {OverlayHostService} from './../overlay-host/overlay-host.service';

let overlayHostService: OverlayHostService;
const dummyHostView: any = 'dummy_hostview';

describe('OverlayHostService:', () => {

    beforeEach(() => {
        overlayHostService = new OverlayHostService();
    });

    describe('getHostView()', () => {
        it('should return a promise', () => {
            expect(typeof overlayHostService.getHostView().then).toBe('function');
        });

        it('should resolve immediately if view is already registered', (done) => {
            overlayHostService.registerHostView(dummyHostView);
            let promise = overlayHostService.getHostView();
            promise.then(
                (val: any) => {
                    expect(val).toBe(dummyHostView);
                    done();
                },
                error => done.fail(error)
            );
        });

        it('should resolve when the view is registered later', (done) => {
            let promise = overlayHostService.getHostView();
            promise.then(
                (val: any) => {
                    expect(val).toBe(dummyHostView);
                    done();
                },
                error => done.fail(error)
            );
            overlayHostService.registerHostView(dummyHostView);
        });
    });

});
