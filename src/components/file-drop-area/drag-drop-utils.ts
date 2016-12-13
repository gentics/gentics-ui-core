export function getDataTransfer(event: any): DataTransfer {
    // if jQuery wrapped the event which contains the dropped file, unwrap it
    let ev: DragEvent = event.dataTransfer ? event : event.originalEvent;
    return ev.dataTransfer;
}

export function getEventTarget(event: any): HTMLElement {
    // if jQuery wrapped the event, unwrap it
    return (event.originalEvent ? event.originalEvent : event).target;
}

/**
 * Note: there are issues with current TypeScript lib defs for the DataTransfer interface, which
 * seems to define the `types` property as a `string[]` rather than a DOMStringList.
 * See https://github.com/Microsoft/TypeScript/issues/12069
 */
export function transferHasFiles(transfer: DataTransfer): boolean {
    let types: any = transfer.types;
    if (!transfer || !transfer.types) {
        return false;
    } else if (typeof types.contains === 'function') {
        return types.contains('Files');
    } else if (typeof types.indexOf === 'function') {
        return types.indexOf('Files') >= 0;
    } else if (typeof types.length === 'number') {
        for (let i = 0; i < types.length; i++) {
            if (types.item(i) === 'Files') {
                return true;
            }
        }
    }
    return false;
}

let _mimeTypeSupport: boolean;
export function clientReportsMimeTypesOnDrag(): boolean {
    if (_mimeTypeSupport === undefined) {
        _mimeTypeSupport = 'items' in DataTransfer.prototype;
    }
    return _mimeTypeSupport;
}

/**
 * If the browser does not report a MIME type, match against this value instead.
 */
export const FALLBACK_MIME_TYPE = 'unknown/unknown';

/**
 * Returns a list of mime types in a DataTransfer if supported by the browser.
 *
 * This is a workaround for missing DataTransfer.items support in Firefox
 * https://bugzilla.mozilla.org/show_bug.cgi?id=906420
 */
export function getTransferMimeTypes(transfer: DataTransfer): string[] {
    if (!transfer) {
        return [];
    } else if (transfer.items && transfer.items.length > 0) {
        return Array.from(transfer.items)
            .filter(item => item.kind === 'file')
            .map(item => item.type || FALLBACK_MIME_TYPE);
    } else if ('mozItemCount' in transfer) {
        return new Array((<any> transfer).mozItemCount).fill(FALLBACK_MIME_TYPE);
    } else {
        console.error('Client does not provide number of items during drag event');
        return [];
    }
}
