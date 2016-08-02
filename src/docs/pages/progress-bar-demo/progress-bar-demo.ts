import {Component} from '@angular/core';
import {Observable, Observer} from 'rxjs';
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
    observableProgress: Observable<number>;

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

    createObservable(): void {
        this.observableProgress = new Observable<number>((observer: Observer<number>) => {
            observer.next(0);
            setTimeout(() => observer.next(0.2), 300);
            setTimeout(() => observer.next(0.5), 800);
            setTimeout(() => observer.next(0.6), 1000);
            setTimeout(() => observer.next(0.75), 1200);
            setTimeout(() => observer.complete(), 2000);
        });
    }
}
