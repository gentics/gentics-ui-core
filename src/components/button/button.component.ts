import {
    Component,
    Input
} from 'angular2/core';

/**
 * A Button component.
 */ 
@Component({
    selector: 'gtx-button',
    template: require('./button.tpl.html')
})
export class Button {

    @Input() disabled: boolean = false;

}
