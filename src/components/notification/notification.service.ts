import {Injectable, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs';
import {Toast} from './toast.component';


export interface INotificationOptions {
    message: string;
    type?: 'default' | 'error' | 'success';
    dismiss?: number;
    action?: {
        label: string;
        onClick: Function;
    };
}

const defaultOptions: INotificationOptions = {
    message: '',
    type: 'default',
    dismiss: 3000
};

@Injectable()
export class Notification {

    open$: EventEmitter<INotificationOptions> = new EventEmitter();

    constructor() {}

    show(options: INotificationOptions): void {
        let mergedOptions: INotificationOptions = Object.assign({}, defaultOptions, options);
        this.open$.emit(mergedOptions);
    }

    /*private createToastAnchor(): Promise<ComponentRef> {
        let id: string = 'gtx-toast-anchor-' + Math.random().toString(36).substr(2);
        // HACK ALERT - in order to be able to load a Toast component somewhere
        // in the DOM, we are (ab)using DynamicComponentLoader.loadAsRoot() and
        // loading it into this 'gtx-toast-anchor' element. Surely there is a
        // better way to do this: http://stackoverflow.com/q/36447334/772859
        let toastAnchor = document.createElement('div');
        toastAnchor.id = id;
        toastAnchor.classList.add('gtx-toast');
        document.body.appendChild(toastAnchor);

        return this.loader.loadAsRoot(Toast, '#' + id, this.injector);
    }*/
}
