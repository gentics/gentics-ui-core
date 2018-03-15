import { Injectable } from '@angular/core';

@Injectable()
export class UserAgentRef {
    static _window: any = window;
    readonly isIE11: boolean;

    constructor() {
        const window = UserAgentRef._window;
        this.isIE11 = !!(window.MSInputMethodContext && window.document.documentMode);
    }
}
