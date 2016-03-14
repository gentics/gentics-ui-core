import {Component, Input} from 'angular2/core';

@Component({
    selector: 'gtx-split-view-container',
    template: require('./split-view-container.tpl.html')
})
export class SplitViewContainer {
    @Input() hasContent: boolean = false;
    @Input() contentFocused: boolean = false;

    toggleHasContent(): void {
        this.hasContent = !this.hasContent;
    }

    toggleFocused(): void {
        this.contentFocused = !this.contentFocused;
    }
}
