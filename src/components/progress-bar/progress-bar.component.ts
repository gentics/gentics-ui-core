import {Component, ElementRef, Input, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {Subscribable} from 'rxjs/Observable';

function isPromise(obj: any): obj is PromiseLike<any> {
    return typeof obj === 'object' && obj != null && typeof obj.then === 'function';
}

function isSubscribable(obj: any): obj is Subscribable<any> {
    return typeof obj === 'object' && obj != null && typeof obj.subscribe === 'function';
}

function noop(): void {}

/**
 * A progress bar that attachs to the top of the parent container and can be used to display activity or progress.
 * It can be used for determinate tasks with a known duration and an exact progress
 * or for indeterminate tasks for which only start/end calls exist, e.g. an xhr call.
 *
 * ```html
 * <!-- progress bar without a known progress duration (indeterminate) -->
 * <gtx-progress-bar [active]="isLoadingData"></gtx-progress-bar>
 *
 * <!-- progress bar for tasks where the progress is known (determinate)-->
 * <gtx-progress-bar [active]="isUploadingFile" [progress]="uploadProgress"></gtx-progress-bar>
 *
 * <!-- progress bar for a Promise or Observable -->
 * <gtx-progress-bar [for]="backgroundProgress$"></gtx-progress-bar>
 * ```
 *
 * ##### Using the progress bar programmatically inside another component
 *
 * The ProgressBar instance exposes two public methods, `start()`, `complete()` which can be used
 * to manually control the progress bar visibility and progress in a parent component.
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
    templateUrl: './progress-bar.tpl.html'
})
export class ProgressBar implements OnDestroy {

    /**
     * Shows or hides the progress bar. When no "progress" value
     * is provided, the progress bar is in "indeterminate" mode
     * and grows until "active" is set to false.
     */
    @Input() get active(): boolean {
        return this.isActive;
    }
    set active(active: boolean) {
        if (active && !this.isActive) {
            this.start();
        } else if (!active && this.isActive) {
            this.complete();
        }
    }
    private isActive: boolean = false;

    /**
     * Sets the progress of the progress bar as a fraction [0...1].
     * When set, the progress bar is in "determinate" mode and will only update
     * when the "progress" value changes or `complete()` is called.
     */
    @Input() set progress(progress: number) {
        if (progress == null) {
            this.determinate = false;
            this.wrapperClasses.add('is-indeterminate');
            this.wrapperClasses.remove('is-determinate');
        } else {
            this.determinate = true;
            this.wrapperClasses.add('is-determinate');
            this.wrapperClasses.remove('is-indeterminate');

            progress = Math.max(0, Math.min(100 * progress, 100));
            if (progress !== this.progressPercentage) {
                if (progress == 100) {
                    this.complete();
                } else {
                    this.setProgressBarWidth(progress);
                }
            }
        }
    }

    /**
     * Sets the speed of the indeterminate animation required to reach
     * 50% of the progress bar. Accepts values like "500ms", "0.5s", 500.
     * *Default: 500ms*
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

    /**
     * Automatically starts, stops and updates the progress bar for a Promise
     * or when an Observable emits values or completes.
     */
    @Input() set for(promiseOrObservable: Promise<any> | Subscribable<number>) {
        this.cleanup();

        if (promiseOrObservable) {
            this.setProgressBarWidth(0, 'immediate');
            this.start(promiseOrObservable);
        } else if (this.isActive) {
            this.complete();
        }
    }

    private progressPercentage: number = 0;
    private indeterminateSpeed: number = 500;
    private determinate: boolean = false;
    private animationRequest: number = undefined;
    private lastAnimationFrame: number = undefined;
    private removePendingHandler: () => void = noop;
    private cleanupSubscription: () => void = noop;

    @ViewChild('progressBarWrapper') private progressBarWrapper: ElementRef;
    @ViewChild('progressIndicator') private progressIndicator: ElementRef;

    private wrapperClasses = { add(...cls: string[]): void {}, remove(...cls: string[]): void {} };



    constructor(private zone: NgZone) { }

    ngAfterViewInit(): void {
        let wrapper: HTMLElement = this.progressBarWrapper && this.progressBarWrapper.nativeElement;
        if (wrapper) {
            this.wrapperClasses = wrapper.classList;
            if (this.isActive) {
                this.wrapperClasses.add('visible', this.determinate ? 'is-determinate' : 'is-indeterminate');
                this.setProgressBarWidth(this.determinate ? this.progressPercentage : 0, 'immediate');
            }
        }
    }

    /**
     * Starts showing the progress bar in "indeterminate" mode.
     * Can be passed a Promise or an Observable which animates the progress bar when resolved or rejected.
     */
    public start(promiseOrObservable?: PromiseLike<any> | Subscribable<any>): void {
        this.cleanupSubscription();

        if (!this.isActive) {
            this.isActive = true;
            this.lastAnimationFrame = undefined;
            this.wrapperClasses.add('visible', this.determinate ? 'is-determinate' : 'is-indeterminate');
            this.wrapperClasses.remove(this.determinate ? 'is-indeterminate' : 'is-determinate');

            if (this.determinate) {
                this.setProgressBarWidth(this.progressPercentage, 'immediate');
            } else {
                this.setProgressBarWidth(0, 'immediate');
                this.animateIndeterminate();
            }
        }

        if (isPromise(promiseOrObservable)) {
            let observing = true;
            promiseOrObservable.then(
                () => observing && this.complete(),
                () => observing && this.complete()
            );
            this.cleanupSubscription = () => {
                observing = false;
                this.cleanupSubscription = noop;
            };
        } else if (isSubscribable(promiseOrObservable)) {
            let sub = promiseOrObservable.subscribe(
                (value: any) => {
                    if (typeof value === 'number') {
                        this.progress = value;
                    }
                },
                (error: any) => this.complete(),
                () => this.complete()
            );
            this.cleanupSubscription = () => {
                sub.unsubscribe();
                this.cleanupSubscription = noop;
            };
        }
    }

    /**
     * Animates the progress bar to 100% and hides it
     */
    public complete(): void {
        if (this.isActive) {
            this.isActive = false;

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

    ngOnDestroy(): void {
        this.cleanup();
    }

    private cleanup(): void {
        if (this.animationRequest) {
            cancelAnimationFrame(this.animationRequest);
            this.animationRequest = undefined;
        }

        this.removePendingHandler();
        this.cleanupSubscription();
    }

    private fadeOutProgressBar(): Promise<void> {
        if (this.removePendingHandler) {
            this.removePendingHandler();
        }

        return new Promise<void>( (resolve: () => void) => this.zone.run(() => {
            let element = this.progressBarWrapper.nativeElement;
            const callback = () => {
                this.removePendingHandler();
                this.setProgressBarWidth(0, 'immediate');
                this.zone.run(resolve);
            };
            this.removePendingHandler = () => {
                element.removeEventListener('transitionend', callback);
                this.removePendingHandler = noop;
            };
            element.addEventListener('transitionend', callback);
            this.wrapperClasses.remove('visible');
        }));
    }

    private setProgressBarWidth(percent: number, immediate?: string): void {
        this.progressPercentage = percent;

        const nativeElement: HTMLElement = this.progressIndicator && this.progressIndicator.nativeElement;
        if (nativeElement) {
            const style = nativeElement.style;
            if (immediate) {
                // Don't animate the change
                style.transitionDuration = style.webkitTransitionDuration = '0s';
                style.width = percent + '%';
                let getWidthOnce = nativeElement.offsetWidth;
                style.transitionDuration = style.webkitTransitionDuration = '';
            } else {
                style.width = percent + '%';
            }
        }
    }

    private transitionTo100Percent(): Promise<void> {
        if (this.removePendingHandler) {
            this.removePendingHandler();
        }
        return new Promise<void>(resolve => {
            let element = this.progressIndicator.nativeElement;
            if (this.determinate) {
                // transition the progress indicator in a cancelable way
                let callback = () => {
                    this.removePendingHandler();
                    this.zone.run(resolve);
                };
                this.removePendingHandler = () => {
                    element.removeEventListener('transitionend', callback);
                    this.removePendingHandler = noop;
                };
                element.addEventListener('transitionend', callback);
                this.setProgressBarWidth(100);
            } else {
                // Use requestAnimationFrame() in a cancelable way
                let frameRequest: number;
                let waitUntilDone = () => {
                    if (this.progressPercentage === 100) {
                        frameRequest = undefined;
                        resolve();
                    } else {
                        frameRequest = requestAnimationFrame(waitUntilDone);
                    }
                };
                frameRequest = requestAnimationFrame(waitUntilDone);
                this.removePendingHandler = () => {
                    cancelAnimationFrame(frameRequest);
                    this.removePendingHandler = noop;
                };
            }
        });
    }

    private animateIndeterminate(): void {
        this.animationRequest = undefined;
        if (this.determinate) { return; }

        let now = typeof performance === 'object' ? performance.now() : Date.now();
        let delta = (now - this.lastAnimationFrame) / 1000;

        if (!this.lastAnimationFrame) {
            // Animation starting
            this.setProgressBarWidth(0);
        } else if (this.isActive) {
            // Animate "active" state
            let factor = delta * (900 / this.indeterminateSpeed);
            let percent = this.progressPercentage + factor * Math.pow(1 - Math.sqrt(100 - this.progressPercentage), 2);
            this.setProgressBarWidth(Math.max(0, Math.min(100, percent)));
        } else if (this.progressPercentage < 100) {
            // Done - animate to 100%
            let speed = (900 / this.indeterminateSpeed);
            let factor = speed + Math.max(0, 1 - speed);
            let percent = this.progressPercentage + 250 * delta * factor;
            this.setProgressBarWidth(Math.max(0, Math.min(100, percent)));
        } else {
            this.fadeOutProgressBar();
            return;
        }

        this.lastAnimationFrame = now;
        this.animationRequest = requestAnimationFrame(
            () => this.animateIndeterminate()
        );
    }
}
