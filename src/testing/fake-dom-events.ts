import {SpyEventTarget} from './spy-event-target';

export function createClickEvent(relatedTarget: HTMLElement = null): Event {
    let clickEvent = document.createEvent('MouseEvent');
    clickEvent.initMouseEvent('click',
        true, // bubble,
        true, // cancelable
        window, 0, 0, 0, 0, 0,
        false, // ctrlKey
        false, // altKey
        false, // shiftKey
        false, // metaKey
        0, // button
        relatedTarget
    );
    return clickEvent;
}

export function triggerFakeDragEvent(target: SpyEventTarget, eventType: string, mimeTypes: string[]): DragEvent {
    return <any> target.triggerListeners(eventType, {
        type: eventType,
        dataTransfer: {
            dropEffect: 'none',
            effectAllowed: 'all',
            files: mimeTypes.map((type: string, i: number) => ({ name: `unknown${i}`, type })),
            items: mimeTypes.map(type => ({ kind: 'file', type })),
            types: mimeTypes.length > 0 ? ['Files'] : []
        },
        target: target
    });
}

export function triggerFakeBubblingDragEvent(ancestry: SpyEventTarget[], eventType: string, mimeTypes: string[]): DragEvent {
    return <any> SpyEventTarget.propagateEvent(ancestry, eventType, {
        type: eventType,
        dataTransfer: {
            dropEffect: 'none',
            effectAllowed: 'all',
            files: mimeTypes.map((type: string, i: number) => ({ name: `unknown${i}`, type })),
            items: mimeTypes.map(type => ({ kind: 'file', type })),
            types: mimeTypes.length > 0 ? ['Files'] : []
        }
    });
}
