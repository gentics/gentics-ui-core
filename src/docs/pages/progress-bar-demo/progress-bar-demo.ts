import {Component} from '@angular/core';
import {GTX_FORM_DIRECTIVES, ProgressBar, Button} from '../../../index';
import {Autodocs, DemoBlock, HighlightedCode} from '../../components';

@Component({
    template: require('./progress-bar-demo.tpl.html'),
    directives: [GTX_FORM_DIRECTIVES, ProgressBar, Button, Autodocs, DemoBlock, HighlightedCode]
})
export class ProgressBarDemo {
    componentSource: string = require('!!raw!../../../components/progress-bar/progress-bar.component.ts');

    fileUploading = false;
    filePercentage = 0;
    loading = false;
    progressSpeed = 500;

    startFileUpload(): void {
        this.filePercentage = 0;
        this.fileUploading = true;
        setTimeout(() => this.simulateProgress(), 300);
    }
    simulateProgress(): void {
        this.filePercentage = Math.min(100, this.filePercentage + Math.random() * 10);
        if (this.filePercentage == 100) {
            setTimeout(() => this.fileUploading = false, 300);
        } else {
            setTimeout(() => this.simulateProgress(), Math.random() * 200 + 200);
        }
    }

    waitPromise(milliseconds: number): Promise<void> {
        return new Promise<void>( (done: () => void) => {
            setTimeout(done, milliseconds);
        });
    }
}
