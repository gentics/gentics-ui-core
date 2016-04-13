import {Component} from 'angular2/core';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./overlay-host-demo.tpl.html'),
    directives: [Autodocs, DemoBlock, HighlightedCode]
})
export class OverlayHostDemo {
    componentSource: string = require('!!raw!../../../components/overlay-host/overlay-host.component.ts');
}
