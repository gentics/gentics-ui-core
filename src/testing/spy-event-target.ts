/**
 * A spy that can be used instead of real EventTargets, HTML elements etc.
 * when the expected events can not be tested with HTMLElement.dispatchEvent().
 */
export class SpyEventTarget implements EventTarget {

    listeners: { type: string, listener: any, useCapture: boolean }[] = [];

    static propagateEvent<T>(ancestry: SpyEventTarget[], type: string, data?: T): T & Event {
        // Add event methods
        let proto = data ? Object.create(Object.getPrototypeOf(data)) : {};
        let eventData = Object.assign(proto, {
            currentTarget: null,
            defaultPrevented: false,
            preventDefault(): void { this.defaultPrevented = true; },
            propagationStopped: false,
            stopPropagation(): void {
                this.propagationStopped = true;
            },
            immediatePropagationStopped: false,
            stopImmediatePropagation(): void {
                this.immediatePropagationStopped = true;
            },
            returnValue: true,
            target: ancestry[ancestry.length - 1]
        }, data);

        const propagate = (target: SpyEventTarget, capture: boolean) => {
            eventData.currentTarget = target;
            target.listeners
                .filter(listener => listener.type === type && listener.useCapture === capture)
                .every(l => {
                    let result = l.listener.call(target, eventData);
                    if (result !== undefined) {
                        eventData.returnValue = result;
                    }
                    if (result === false) {
                        eventData.defaultPrevented = true;
                    }
                    return !eventData.immediatePropagationStopped;
                });
        };

        // capture phase
        for (let i = 0; i < ancestry.length; i++) {
            propagate(ancestry[i], true);
            if (eventData.propagationStopped || eventData.immediatePropagationStopped) {
                return eventData;
            }
        }

        // bubbling phase
        for (let i = ancestry.length - 1; i >= 0; i--) {
            propagate(ancestry[i], false);
            if (eventData.propagationStopped || eventData.immediatePropagationStopped) {
                return eventData;
            }
        }

        return eventData;
    }

    constructor(public name: string = '') {
        spyOn(this as EventTarget, 'addEventListener').and.callThrough();
        spyOn(this as EventTarget, 'dispatchEvent').and.callThrough();
        spyOn(this as EventTarget, 'removeEventListener').and.callThrough();
    }

    addEventListener(type: string, listener?: any, useCapture: boolean = false): void {
        this.listeners.push({
            type,
            listener: listener || (() => {}),
            useCapture: useCapture !== undefined ? useCapture : false
        });
    }

    dispatchEvent(evt: Event): boolean {
        let result = this.triggerListeners(evt.type, evt);
        return result.returnValue;
    }

    removeAllEventListeners(type?: string): void {
        if (type === undefined) {
            this.listeners = [];
        } else {
            this.listeners = this.listeners.filter(l => l.type !== type);
        }
    }

    removeEventListener(type: string, listener: any, useCapture: boolean = false): void {
        let index = this.listeners.findIndex(l =>
            l.type === type &&
            (listener === undefined || (listener === l.listener && l.useCapture === !!useCapture))
        );

        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    hasListener(type: string, useCapture?: boolean): boolean {
        if (useCapture == undefined) {
            return this.listeners.some(l => l.type === type);
        } else {
            return this.listeners.some(l => l.type === type && l.useCapture === useCapture);
        }
    }

    triggerListeners<T>(type: string, data?: T): T & Event {
        // Add event methods
        let proto = data ? Object.create(Object.getPrototypeOf(data)) : {};
        let eventData = Object.assign(proto, {
            currentTarget: this,
            defaultPrevented: false,
            preventDefault(): void { this.defaultPrevented = true; },
            propagationStopped: false,
            stopPropagation(): void {
                this.propagationStopped = true;
            },
            immediatePropagationStopped: false,
            stopImmediatePropagation(): void {
                this.immediatePropagationStopped = true;
            },
            returnValue: true,
            target: this
        }, data);

        // Run capture & bubbling phase
        this.listeners
            .filter(listener => listener.type === type)
            .sort((a, b) => (+b.useCapture) - (+a.useCapture))
            .every(l => {
                let result = l.listener.call(this, eventData);
                if (result !== undefined) {
                    eventData.returnValue = result;
                }
                if (result === false) {
                    eventData.defaultPrevented = true;
                }
                return !eventData.immediatePropagationStopped;
            });

        return eventData;
    }
}
