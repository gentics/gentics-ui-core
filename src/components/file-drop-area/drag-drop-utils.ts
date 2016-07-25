export function getDataTransfer(event: any): DataTransfer {
    // if jQuery wrapped the event which contains the dropped file, unwrap it
    let ev: DragEvent = event.dataTransfer ? event : event.originalEvent;
    return ev.dataTransfer;
}

export function getEventTarget(event: any): HTMLElement {
    // if jQuery wrapped the event, unwrap it
    return (event.originalEvent ? event.originalEvent : event).target;
}

export function transferHasFiles(transfer: DataTransfer): boolean {
    if (!transfer || !transfer.types) {
        return false;
    } else if (typeof transfer.types.contains === 'function') {
        return transfer.types.contains('Files');
    } else if (typeof (<any> transfer.types).indexOf === 'function') {
        return (<any> transfer.types).indexOf('Files') >= 0;
    } else if (typeof transfer.types.length === 'number') {
        for (let i = 0; i < transfer.types.length; i++) {
            if (transfer.types.item(i) === 'Files') {
                return true;
            }
        }
    }
    return false;
}

export function clientReportsMimeTypesOnDrag(): boolean {
    return 'items' in DataTransfer.prototype;
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
