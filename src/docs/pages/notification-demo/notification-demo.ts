import {Component} from '@angular/core';
import {Notification} from '../../../index';

@Component({
    templateUrl: './notification-demo.tpl.html'
})
export class NotificationDemo {
    componentSource: string = require('!!raw-loader!../../../components/notification/notification.service.ts');

    message: string = 'Hello, this is Toast.';
    delay: number = 3000;
    type: string = 'default';

    constructor(private notification: Notification) {}


    showBasic(): void {
        this.notification.show({
            message: this.message,
            type: this.type,
            delay: this.delay
        });
    }

    showWithAction(): void {
        this.notification.show({
            message: 'Email sent',
            action: {
                label: 'Undo',
                onClick: (): any =>  this.notification.show({
                    message: 'Cancelled sending',
                    type: 'success'
                })
            }
        });
    }

}
