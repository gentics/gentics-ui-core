import {Component} from '@angular/core';
import {Notification} from 'gentics-ui-core';

@Component({
    templateUrl: './notification-demo.tpl.html'
})
export class NotificationDemo {
    componentSource: string = require('!!raw-loader!../../../components/notification/notification.service.ts');

    message = 'Hello, this is Toast.';
    multilineMessage = 'Notifications may have'
        + '\nmulti-line messages'
        + '\n    and white-space for indentation'
        + '\nas well, but auto-wrap when lines are too long';
    delay = 3000;
    type = 'default';

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

    showMultiline(): void {
        const toast = this.notification.show({
            message: this.multilineMessage,
            type: this.type,
            delay: 10000,
            action: {
                label: 'Dismiss',
                onClick: () => toast.dismiss()
            }
        });
    }

}
