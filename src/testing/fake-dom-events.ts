import {SpyEventTarget} from './spy-event-target';

export function triggerFakeDragEvent(target: SpyEventTarget, eventType: string, mimeTypes: string[]): boolean {
    return target.triggerListeners(eventType, {
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
