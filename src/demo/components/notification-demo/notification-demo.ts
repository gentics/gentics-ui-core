import {Component} from 'angular2/core';
import {Notification, Button, GTX_FORM_DIRECTIVES} from '../../../index';

@Component({
    template: require('./notification-demo.tpl.html'),
    directives: [Button, GTX_FORM_DIRECTIVES]
})
export class NotificationDemo {

    message: string = 'Hello, this is Toast.';

    constructor(private notification: Notification) {}


    show(): void {
        this.notification.show({
            message: this.message
        });
    }
}
