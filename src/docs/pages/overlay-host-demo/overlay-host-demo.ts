import {Component} from '@angular/core';

@Component({
    templateUrl: './overlay-host-demo.tpl.html'
})
export class OverlayHostDemo {
    componentSource: string = require('!!raw-loader!../../../components/overlay-host/overlay-host.component.ts');
}
