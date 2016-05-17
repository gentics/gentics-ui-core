import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    NgZone
} from '@angular/core';

/**
 * A progress bar that attachs to the top of the parent container and can be used to display activity or progress.
 * It can be used for determinate tasks with a known duration and an exact progress
 * or for indeterminate tasks for which only start/end calls exist, e.g. an xhr call.
 *
 * ```html
 * <!-- a progress bar without a known progress duration (indeterminate) -->
 * <gtx-progress-bar [active]="isLoadingData">
 * </gtx-progress-bar>
 *
 * <!-- a progress bar for tasks where the progress is known (determinate)-->
 * <gtx-progress-bar [active]="isUploadingFile" [progress]="uploadProgress">
 * </gtx-progress-bar>
 * ```
 *
 * ##### Using the progress bar programmatically inside another component
 *
 * The ProgressBar instance exposes two public methods, `start()`, `complete()` which can be used
 * to manually control the progress bar visibility and progress in a parent component.
 *
 * An example usage follows:
 *
 * ```typescript
 * export class App {
 *   @ViewChild(ProgressBar)
 *   private progressBar: ProgressBar;
 *
 *   loadUserData() {
 *     this.progressBar.start();
 *     restclient.get('/users', (response, users) => {
 *       this.progressBar.complete();
 *       if (users) {
 *         doSomethingWith(users);
 *       } else {
 *         handleError(response);
 *       }
 *     });
 *   }
 * }
 * ```
 */
@Component({
    selector: 'gtx-progress-bar',
    template: require('./progress-bar.tpl.html')
})
export class ProgressBar {

    constructor(private _zone: NgZone) { }

    /**
     * Shows or hides the progress bar. When no "progress" value
     * is provided, the progress bar is in "indeterminate" mode
     * and grows until "active" is set to false.
     */
    @Input() get active(): boolean {
        return this._active;
    }
    set active(active: boolean) {
        if (active && !this._active) {
            this.start();
        } else if (!active && this._active) {
            this.complete();
        }
    }
    private _active: boolean = false;

    /**
     * Sets the progress of the progress bar in percent. When set, the progress bar
     * is in "determinate" mode and will only update when the "progress" value changes
     * or `complete()` is called.
     */
    @Input() set progress(progress: number) {
        if (progress === null) {
            this.determinate = false;
        } else {
            this.determinate = true;
            progress = Math.max(0, Math.min(progress, 100));
            if (progress !== this.progressPercentage) {
                if (progress == 100) {
                    this.complete();
                } else {
                    this.progressPercentage = progress;
                }
            }
        }
    }

    /**
     * Sets the speed of the indeterminate animation in milliseconds
     * required to reach 50% of the progress bar. *Defaults to 500 milliseconds.*
     */
    @Input() set speed(speed: string|number) {
        if (typeof speed === 'string') {
            let match = speed.match(/^(\d+(?:\.\d+)?)(ms|s)?$/);
            if (match) {
                let factor = (match[2] == 's' ? 1000 : 1);
                this.indeterminateSpeed = Number.parseFloat(match[1]) * factor;
            }
        } else if (!isNaN(speed)) {
            this.indeterminateSpeed = speed;
        }
    }

    private progressPercentage: number = 0;
    private progressBarVisible: boolean = false;
    private indeterminateSpeed: number = 500;
    private determinate: boolean = false;
    private animationRequest: number = null;
    private lastAnimationFrame: number = null;

    @ViewChild('progressBarWrapper') private fadeAnimationElement: ElementRef;
    @ViewChild('progressIndicator') private animationElement: ElementRef;

    /**
     * Starts showing the progress bar in "indeterminate" mode.
     * Can be passed a Promise that animates the progress bar when resolved or rejected.
     */
    public start(promise?: PromiseLike<any>): void {
        if (!this._active) {
            this._active = true;
            this.lastAnimationFrame = null;
            this.progressBarVisible = true;
            if (!this.determinate) {
                this.progressPercentage = 0;
                this.animateIndeterminate();
            }
        }

        if (promise && typeof promise.then == 'function') {
            promise.then(() => this.complete(), () => this.complete());
        }
    }

    /**
     * Animates the progress bar to 100% and hides it
     */
    public complete(): void {
        if (this._active) {
            this._active = false;

            if (this.determinate) {
                if (this.progressPercentage == 100) {
                    this.fadeOutProgressBar();
                } else {
                    this.transitionTo100Percent()
                        .then(() => this.fadeOutProgressBar());
                }
            }
        }
    }

    private fadeOutProgressBar(): Promise<void> {
        return new Promise<void>( (resolve: () => void) => {
            let element = this.fadeAnimationElement.nativeElement;
            let callback = () => {
                element.removeEventListener('transitionend', callback);
                this.progressPercentage = 0;
                resolve();
            };
            element.addEventListener('transitionend', callback);
            this.progressBarVisible = false;
        });
    }

    private transitionTo100Percent(): Promise<void> {
        return new Promise<void>( (resolve: () => void) => {
            let element = this.animationElement.nativeElement;
            if (this.determinate) {
                let callback = () => {
                    element.removeEventListener('transitionend', callback);
                    resolve();
                };
                element.addEventListener('transitionend', callback);
                this.progressPercentage = 100;
            } else {
                let waitUntilDone = () => {
                    if (this.progressPercentage == 100) {
                        resolve();
                    } else {
                        requestAnimationFrame(waitUntilDone);
                    }
                };
                requestAnimationFrame(waitUntilDone);
            }
        });
    }

    private animateIndeterminate(): void {
        this.animationRequest = null;
        if (this.determinate) { return; }

        let now = +(new Date());
        let delta = (now - this.lastAnimationFrame) / 1000;

        if (!this.lastAnimationFrame) {
            // Animation starting
            this.progressPercentage = 0;
        } else if (this._active) {
            // Animate "active" state
            let factor = delta * (900 / this.indeterminateSpeed);
            let percent = this.progressPercentage + factor * Math.pow(1 - Math.sqrt(100 - this.progressPercentage), 2);
            this.progressPercentage = Math.max(0, Math.min(100, percent));
        } else if (this.progressPercentage < 100) {
            // Done - animate to 100%
            let speed = (900 / this.indeterminateSpeed);
            let factor = speed + Math.max(0, 1 - speed);
            let percent = this.progressPercentage + 250 * delta * factor;
            this.progressPercentage = Math.max(0, Math.min(100, percent));
        } else {
            this.fadeOutProgressBar();
            return;
        }

        this.lastAnimationFrame = now;

        // Run animation outside of angular change detector
        this._zone.runOutsideAngular(() => {
            this.animationRequest = requestAnimationFrame(
                () => this.animateIndeterminate()
            );
        });
    }
}
