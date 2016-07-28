import {SpyEventTarget} from './spy-event-target.ts';

describe('SpyEventTarget', () => {

    let spy: SpyEventTarget;
    let eventHandlerA: jasmine.Spy;
    let eventHandlerB: jasmine.Spy;

    beforeEach(() => {
        spy = new SpyEventTarget();
        eventHandlerA = jasmine.createSpy('eventHandlerA');
        eventHandlerB = jasmine.createSpy('eventHandlerB');
    });

    it('.listeners is a list of all added event listeners', () => {
        spy.addEventListener('eventType', eventHandlerA);
        expect(spy.listeners).toEqual([
            { type: 'eventType', listener: eventHandlerA, useCapture: false }
        ]);
        spy.addEventListener('eventType', eventHandlerA);
        spy.addEventListener('eventType', eventHandlerB, true);
        expect(spy.listeners).toEqual([
            { type: 'eventType', listener: eventHandlerA, useCapture: false },
            { type: 'eventType', listener: eventHandlerA, useCapture: false },
            { type: 'eventType', listener: eventHandlerB, useCapture: true }
        ]);
    });

    it('hasListener() checks for a registered event listener', () => {
        spy.addEventListener('eventType', eventHandlerA);
        expect(spy.hasListener('eventType')).toEqual(true, 'hasListener(eventType)');
        expect(spy.hasListener('eventType', false)).toEqual(true, 'hasListener(eventType, false)');
        expect(spy.hasListener('eventType', true)).toEqual(false, 'hasListener(eventType, true)');
        expect(spy.hasListener('otherEvent')).toEqual(false, 'hasListener(otherEvent)');
    });

    describe('triggerListeners()', () => {

        it('executes all registered event listeners', () => {
            spy.addEventListener('eventType', eventHandlerA);
            spy.addEventListener('eventType', eventHandlerB);
            spy.addEventListener('eventType', eventHandlerB);

            spy.triggerListeners('otherType');
            expect(eventHandlerA).not.toHaveBeenCalled();

            spy.triggerListeners('eventType', { data: 42 });
            expect(eventHandlerA).toHaveBeenCalledWith(jasmine.objectContaining({ data: 42 }));
            expect(eventHandlerB).toHaveBeenCalledTimes(2);
        });

        it('executes "capture" listeners before "bubbling" listeners', () => {
            let called: string[] = [];
            spy.addEventListener('eventType', () => called.push('first'), false);
            spy.addEventListener('eventType', () => called.push('second'), true);

            spy.triggerListeners('eventType');
            expect(called).toEqual(['second', 'first']);
            expect(called).not.toEqual(['first', 'second']);
        });

        it('simulates preventDefault() & defaultPrevented', () => {
            spy.addEventListener('eventName', (ev: Event) => { ev.preventDefault(); });
            let result = spy.triggerListeners('eventName');
            expect(result.defaultPrevented).toBe(true);
        });

        it('forwards returnValue', () => {
            spy.addEventListener('eventName', (ev: Event) => false);
            let result = spy.triggerListeners('eventName');
            expect(result.defaultPrevented).toBe(true);
            expect(result.returnValue).toBe(false);
        });

        it('simulates stopImmediatePropagation()', () => {
            spy.addEventListener('eventName', (ev: Event) => ev.stopImmediatePropagation());
            spy.addEventListener('eventName', eventHandlerA);
            spy.addEventListener('eventName', eventHandlerB);

            let result = spy.triggerListeners('eventName');
            expect(eventHandlerA).not.toHaveBeenCalled();
            expect(eventHandlerB).not.toHaveBeenCalled();
        });

    });

    it('removeEventListener() removes a previously added event handler from all lists', () => {
        spy.addEventListener('eventType', eventHandlerA);
        spy.removeEventListener('eventType', eventHandlerA);
        expect(spy.hasListener('eventType')).toBe(false);
        expect(spy.listeners).toEqual([]);

        spy.triggerListeners('eventType');
        expect(eventHandlerA).not.toHaveBeenCalled();
    });

    it('removeAllEventListeners() removes all listeners for an event type', () => {
        spy.addEventListener('eventType', eventHandlerA);
        spy.addEventListener('eventType', eventHandlerB);
        spy.removeAllEventListeners('eventType');
        expect(spy.hasListener('eventType')).toBe(false);
        expect(spy.listeners).toEqual([]);

        spy.triggerListeners('eventType');
        expect(eventHandlerA).not.toHaveBeenCalled();
        expect(eventHandlerB).not.toHaveBeenCalled();
    });

    it('removeAllEventListeners() with no event name removes all listeners', () => {
        spy.addEventListener('firstEventType', eventHandlerA);
        spy.addEventListener('secondEventType', eventHandlerB);
        spy.removeAllEventListeners();
        expect(spy.hasListener('firstEventType')).toBe(false);
        expect(spy.hasListener('secondEventType')).toBe(false);
        expect(spy.listeners).toEqual([]);

        spy.triggerListeners('firstEventType');
        spy.triggerListeners('secondEventType');
        expect(eventHandlerA).not.toHaveBeenCalled();
        expect(eventHandlerB).not.toHaveBeenCalled();
    });

    describe('propagateEvent():', () => {

        // Pretend to have <div><a><span></span></a></div>
        let div: SpyEventTarget;
        let a: SpyEventTarget;
        let span: SpyEventTarget;
        let fakeAncestry: SpyEventTarget[];

        beforeEach(() => {
            div = new SpyEventTarget('div');
            a = new SpyEventTarget('a');
            span = new SpyEventTarget('span');
            fakeAncestry = [div, a, span];
        });

        it('calls passed handlers', () => {
            div.addEventListener('customEvent', eventHandlerA);
            SpyEventTarget.propagateEvent([div], 'customEvent');
            expect(eventHandlerA).toHaveBeenCalled();
        });

        it('calls multiple handlers', () => {
            div.addEventListener('customEvent', eventHandlerA);
            a.addEventListener('customEvent', eventHandlerB);
            SpyEventTarget.propagateEvent([div, a], 'customEvent');
            expect(eventHandlerA).toHaveBeenCalled();
            expect(eventHandlerB).toHaveBeenCalled();
        });

        it('simulates capture and bubbling phase', () => {
            let list: string[] = [];
            div.addEventListener('customEvent', () => list.push('div-capture'), true);
            a.addEventListener('customEvent', () => list.push('a-capture'), true);
            div.addEventListener('customEvent', () => list.push('div-bubble'), false);
            a.addEventListener('customEvent', () => list.push('a-bubble'), false);

            SpyEventTarget.propagateEvent([div, a], 'customEvent');
            expect(list).toEqual(['div-capture', 'a-capture', 'a-bubble', 'div-bubble']);
        });

        it('simulates a complete event flow with parents and children', () => {
            let events: Event[] = [];
            let elementOrder: string[] = [];
            function handle (ev: Event): void {
                events.push(ev);
                elementOrder.push(this.name);
            }

            div.addEventListener('bubbleEvent', handle);
            a.addEventListener('bubbleEvent', handle);
            span.addEventListener('bubbleEvent', handle);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent', { data: 42 });

            expect(events.length).toBe(3);
            expect(events.map((ev: any) => ev.data)).toEqual([42, 42, 42]);
            expect(elementOrder).toEqual(['span', 'a', 'div']);
        });

        it('allows to use capture and bubbling phase', () => {
            let elementOrder: string[] = [];
            function handle (ev: Event): void {
                elementOrder.push(this.name);
            }

            div.addEventListener('bubbleEvent', handle, true);
            div.addEventListener('bubbleEvent', handle, false);
            a.addEventListener('bubbleEvent', handle, true);
            a.addEventListener('bubbleEvent', handle, false);
            span.addEventListener('bubbleEvent', handle, true);
            span.addEventListener('bubbleEvent', handle, false);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent');

            expect(elementOrder).toEqual(['div', 'a', 'span', 'span', 'a', 'div']);
        });

        it('simulates stopPropagation()', () => {
            let elementOrder: string[] = [];
            function handle (ev: Event): void {
                elementOrder.push(this.name);
            }
            function handleAndStop (ev: Event): void {
                elementOrder.push(this.name);
                ev.stopPropagation();
            }

            div.addEventListener('bubbleEvent', handle);
            a.addEventListener('bubbleEvent', handleAndStop);
            span.addEventListener('bubbleEvent', handle);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent');
            expect(elementOrder).toEqual(['span', 'a']);

            fakeAncestry.forEach(el => el.removeAllEventListeners());
            elementOrder = [];

            div.addEventListener('bubbleEvent', handle, true);
            a.addEventListener('bubbleEvent', handleAndStop, true);
            span.addEventListener('bubbleEvent', handle, true);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent');
            expect(elementOrder).toEqual(['div', 'a']);
        });

        it('simulates stopImmediatePropagation()', () => {
            let elementOrder: string[] = [];
            function handle (ev: Event): void {
                elementOrder.push(this.name);
            }
            function handleAndStop (ev: Event): void {
                elementOrder.push(this.name);
                ev.stopImmediatePropagation();
            }

            div.addEventListener('bubbleEvent', handle);
            div.addEventListener('bubbleEvent', handle);
            a.addEventListener('bubbleEvent', handleAndStop);
            a.addEventListener('bubbleEvent', handle);
            span.addEventListener('bubbleEvent', handle);
            span.addEventListener('bubbleEvent', handle);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent');
            expect(elementOrder).toEqual(['span', 'span', 'a']);

            fakeAncestry.forEach(el => el.removeAllEventListeners());
            elementOrder = [];

            div.addEventListener('bubbleEvent', handle, true);
            div.addEventListener('bubbleEvent', handle, true);
            a.addEventListener('bubbleEvent', handleAndStop, true);
            a.addEventListener('bubbleEvent', handle, true);
            span.addEventListener('bubbleEvent', handle, true);
            span.addEventListener('bubbleEvent', handle, true);

            SpyEventTarget.propagateEvent(fakeAncestry, 'bubbleEvent');
            expect(elementOrder).toEqual(['div', 'div', 'a']);
        });

    });


});
