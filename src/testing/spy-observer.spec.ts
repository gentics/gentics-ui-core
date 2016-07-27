import {Observable, Subscriber} from 'rxjs';

import {SpyObserver, subscribeSpyObserver} from './spy-observer';

describe('SpyObserver', () => {
    it('creates an object with next, error & complete spies', () => {
        let observer = new SpyObserver();
        function expectSpy(obj: any): boolean {
            return expect(typeof obj).toBe('function', 'spy is not a function') &&
            expect(typeof obj.and).toBe('function', 'spy.and is not a function') &&
            expect('identity' in obj).toBe(true, 'no identity property') &&
            expect('calls' in obj).toBe(true, 'no calls property');
        }
        expectSpy(observer.next);
        expectSpy(observer.error);
        expectSpy(observer.complete);
    });
});

describe('subscribeSpyObserver()', () => {

    it('creates an spyobserver subscribed to an observable', () => {
        let subscribed = false;
        let observable = new Observable<number>((subscriber: Subscriber<number>) => {
            subscribed = true;
        });

        expect(subscribed).toBe(false);
        let spy = subscribeSpyObserver(observable);
        expect(subscribed).toBe(true);
    });

    it('tracks emitted values on .next / .error / .complete', () => {
        let observable = new Observable<number>((subscriber: Subscriber<number>) => {
            subscriber.next(47);
            subscriber.complete();
        });

        let spy = subscribeSpyObserver(observable);
        expect(spy.next).toHaveBeenCalledWith(47);
        expect(spy.error).not.toHaveBeenCalled();
        expect(spy.complete).toHaveBeenCalled();
    });

    it('automatically unsubscribes when the current test ends', () => {
        let originalAfterAll = jasmine.getEnv().afterAll;
        let cleanupFn: any;
        jasmine.getEnv().afterAll = (callback: any) => cleanupFn = callback;

        try {
            let subscribed = false;
            let unsubscribed = false;
            let observable = new Observable<number>((subscriber: Subscriber<number>) => {
                subscribed = true;
                return subscriber.add(() => unsubscribed = true);
            });

            expect(subscribed).toBe(false);
            expect(cleanupFn).toBeUndefined();

            let spy = subscribeSpyObserver(observable);
            expect(subscribed).toBe(true);
            expect(typeof cleanupFn).toBe('function');

            expect(unsubscribed).toBe(false);
            cleanupFn();
            expect(unsubscribed).toBe(true);
        }
        finally {
            jasmine.getEnv().afterAll = originalAfterAll;
        }
    });

});
