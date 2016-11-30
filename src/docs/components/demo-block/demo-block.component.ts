import {Component, Input, ElementRef} from '@angular/core';

@Component({
    selector: 'gtx-demo-block',
    template: require('./demo-block.tpl.html')
})
export class DemoBlock {

    @Input() demoTitle: string;
    wrapperMaxHeight: number = 0;

    constructor(private elementRef: ElementRef) {}

    toggleCode(): void {
        if (this.wrapperMaxHeight === 0) {
            let code = this.elementRef.nativeElement.querySelector('div.demo-code');
            this.wrapperMaxHeight = code.getBoundingClientRect().height + 30;
        } else {
            this.wrapperMaxHeight = 0;
        }
    }
}
