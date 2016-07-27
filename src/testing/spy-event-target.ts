export class SpyEventTarget implements EventTarget {

    listeners: { type: string, listener: any, useCapture: boolean }[] = [];

    constructor() {
        spyOn(this, 'addEventListener').and.callThrough();
        spyOn(this, 'dispatchEvent').and.callThrough();
        spyOn(this, 'removeEventListener').and.callThrough();
    }

    addEventListener(type: string, listener?: any, useCapture?: boolean): void {
        this.listeners.push({
            type,
            listener: listener || (() => {}),
            useCapture: useCapture !== undefined ? useCapture : false
        });
    }

    dispatchEvent(evt: Event): boolean {
        return this.triggerListeners(evt.type, evt);
    }

    removeEventListener(type: string, listener?: any, useCapture?: boolean): void {
        let index = this.listeners.findIndex(l =>
            l.type === type && l.listener === listener && l.useCapture === useCapture);
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

    triggerListeners(type: string, data?: any): boolean {
        // Add event methods
        let eventData = Object.assign(Object.create(Object.getPrototypeOf(data)), {
            defaultPrevented: false,
            preventDefault(): void { this.defaultPrevented = true; },
            stopPropagation(): void {},
            immediatePropagationStopped: false,
            stopImmediatePropagation(): void { this.immediatePropagationStopped = true; }
        }, data);

        // Run capture & bubbling phase
        let lastResult: boolean = true;
        this.listeners
            .filter(listener => listener.type === type)
            .sort((a, b) => (+b.useCapture) - (+a.useCapture))
            .forEach(l => {
                let result = lastResult = l.listener.call(this, eventData);
                if (result === false || eventData.immediatePropagationStopped) {
                    return false;
                }
            });

        return lastResult;
    }
}
