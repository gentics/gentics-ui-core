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
