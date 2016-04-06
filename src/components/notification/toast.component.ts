import {Component} from 'angular2/core';

@Component({
    selector: 'gtx-toast',
    template: require('./toast.tpl.html')
})
export class Toast {
    message: string;
}
