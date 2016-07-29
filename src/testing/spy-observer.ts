import {Observable, Observer} from 'rxjs';

interface ISubscribable {
    subscribe(observer?: any, error?: (error: any) => void, complete?: () => void): { unsubscribe(): void; };
}

export class SpyObserver<T> implements Observer<T> {
    next = jasmine.createSpy(this.name + '.next');
    error = jasmine.createSpy(this.name + '.error');
    complete = jasmine.createSpy(this.name + '.complete');

    constructor(private name: string = '<observer>') { }
    toString(): string { return `SpyObserver("${name}")`; }
}

/**
 * Returns a spy observer that is subscribed to the passed Observable.
 * When the test ends or fails, the observer is unsubscribed automatically.
 */
export function subscribeSpyObserver<T>(observable: Observable<T>): SpyObserver<T>;
export function subscribeSpyObserver<T>(subject: any, observable: Observable<any>): SpyObserver<T>;
export function subscribeSpyObserver<T>(subject: any, propertyName: string): SpyObserver<T>;
export function subscribeSpyObserver(subject: any, observableOrName?: any): SpyObserver<any> {
    let name: string = 'unknown';
    let subscribable: ISubscribable;

    if (typeof observableOrName === 'string') {
        name = observableOrName;
        subscribable = subject[name];
    } else if (observableOrName) {
        subscribable = observableOrName;
        for (let k in subject) {
            if (subject[k] === subscribable) {
                name = k;
                break;
            }
        }
    } else {
        subscribable = subject;
        name = '<observer>';
    }

    let spy = new SpyObserver(name);
    let subscription = subscribable.subscribe(spy);
    jasmine.getEnv().afterAll(() => { subscription.unsubscribe(); });

    return spy;
}
