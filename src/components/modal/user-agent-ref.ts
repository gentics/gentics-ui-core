import { Injectable } from '@angular/core';

@Injectable()
export class UserAgentRef {
    static _window: any = window;
    readonly isIE11: boolean;
    readonly isEdge: boolean;

    constructor() {
        const window = UserAgentRef._window;
        this.isIE11 = !!(window.MSInputMethodContext && window.document.documentMode);
        this.isEdge = !!(window.navigator.userAgent.indexOf('Edge') > -1);
    }
}
