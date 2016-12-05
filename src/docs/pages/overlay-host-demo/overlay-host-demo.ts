import {Component} from '@angular/core';

@Component({
    template: require('./overlay-host-demo.tpl.html')
})
export class OverlayHostDemo {
    componentSource: string = require('!!raw-loader!../../../components/overlay-host/overlay-host.component.ts');
}
