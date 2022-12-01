import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import {
    animate,
    animateChild,
    AnimationBuilder,
    AnimationPlayer,
    keyframes,
    query,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

import {UserAgentRef} from '../modal/user-agent-ref';

// must export and be a function (not arrow function expression) to prevent ngc errors
export function animateCubicBezier(millis: number): any {
    return animate(`${millis}ms cubic-bezier(0.215, 0.61, 0.355, 1)`);
}

/**
 * The SideMenu component is an off-canvas menu with a toggle button which can be
 * used to toggle the state. The component itself is stateless, and relies on the value passed in as
 * the `opened` prop to set its state. Toggling must also be handled by the host component.
 *
 * The toggle button must be placed within a `<gtx-side-menu-toggle>` element. All other content will be projected
 * into the main body of the menu.
 *
 * **Note**: For the side menu to be positioned correctly, its container must have the `position` CSS attribute set.
 *
 * ```html
 * <gtx-side-menu [opened]="displayMenu" (toggle)="displayMenu = $event">
 *     <gtx-side-menu-toggle>
 *         <button>Toggle</button>
 *     </gtx-side-menu-toggle>
 *     <div class="my-menu-content">
 *         <ul>
 *             <li>Menu item 1</li>
 *             <li>Menu item 2</li>
 *             <li>Menu item 3</li>
 *             <li>Menu item 4</li>
 *             <li>Menu item 5</li>
 *         </ul>
 *     </div>
 * </gtx-side-menu>
 * ```
 */
@Component({
    selector: 'gtx-side-menu',
    templateUrl: './side-menu.tpl.html',
    animations: [
        trigger('menuState', [
            // There seems to be an open Angular bug with leaving animations on IE and Edge,
            // so we only play that animation if we are not on IE or Edge.
            // https://github.com/angular/angular/issues/29463
            // https://jira.gentics.com/browse/SUP-8106
            state('void', style('*')),
            state('open', style('*')),
            state('openIE', style('*')),
            transition('void => *', [
                query('@contentState', [animateChild({ delay: 100 })]),
                animateCubicBezier(300)
            ]),
            transition('void => *', animateCubicBezier(300)),
            transition('open => *', animateCubicBezier(300)),
        ]),
        trigger('toggleState', [
            state('closed', style({ transform: '{{ transform }}' }), { params: { transform: 'translateX(0)' } }),
            state('open', style({ transform: '{{ transform }}' }), { params: { transform: 'translateX(0)' } }),
            transition('* => *', animateCubicBezier(300))
        ]),
        trigger('overlayState', [
            state('closed', style({ opacity: 0 })),
            state('open', style({ opacity: 1 })),
            transition('* => *', animateCubicBezier(600))
        ]),
        trigger('contentState', [
            state('void', style('*')),
            state('*', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('* => *', animateCubicBezier(400))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenu {

    /**
     * Sets the state of the menu: true = opened, false = closed.
     */
    @HostBinding('class.opened')
    @Input() opened: boolean = false;
    /**
     * Sets whether the menu should appear to the left or the right of the screen. Defaults to 'left'.
     */
    @Input() position: 'left' | 'right' = 'left';
    /**
     * Sets the width of the menu. Should be a valid CSS width value, e.g. '400px', '20vw', '30em'. **Note** that
     * percentage values should be avoided, since they will produce unexpected results.
     */
    @Input() width: string = '300px';
    /**
     * The distance in pixels between the edge of the container and the toggle button when the menu is closed.
     */
    @Input() toggleButtonOffset: number = 20;

    @HostBinding('class.align-left')
    get alignmentClassLeft(): boolean {
        return this.position === 'left';
    }

    @HostBinding('class.align-right')
    get alignmentClassRight(): boolean {
        return this.position === 'right';
    }

    get animationParams(): any {
        const buttonWidth = parseInt(this.toggleButton.nativeElement.offsetWidth);
        let transform = this.position === 'left' ?
            `translateX(${this.toggleButtonOffset}px)` :
            `translateX(-${this.toggleButtonOffset}px)`;
        if (this.opened) {
            // IE11 cannot use `calc()` with transform properties, so instead we can just use multiple separate
            // translateX() statements.
            transform = this.position === 'left' ?
                `translateX(${this.responsiveWidth}) translateX(-${buttonWidth}px) translateX(-${this.toggleButtonOffset}px)` :
                `translateX(-${this.responsiveWidth}) translateX(+${buttonWidth}px) translateX(+${this.toggleButtonOffset}px)`;
        }
        return {
            value: this.opened ? 'open' : 'closed',
            params: { transform }
        };
    }

    get menuAnimationState(): any {
        // There seems to be an open Angular bug with leaving animations on IE and Edge,
        // so we only play that animation if we are not on IE or Edge.
        // https://github.com/angular/angular/issues/29463
        // https://jira.gentics.com/browse/SUP-8106
        const openState = !this.userAgentRef.isEdge && !this.userAgentRef.isIE11 ? 'open' : 'openIE';
        return this.opened ? openState : 'void';
    }

    @ViewChild('toggleButton', { static: true }) toggleButton: ElementRef;

    /**
     * Fired when the toggle button is clicked. The value is equal to
     * the value of the `opened`
     */
    @Output() toggle = new EventEmitter<boolean>();

    public player: AnimationPlayer;
    private ancestorWithWidth: HTMLElement;

    /**
     * Returns the width of the menu, taking into account screen width
     */
    get responsiveWidth(): string {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) {
            return `${this.ancestorWithWidth.offsetWidth}px`;
        }
        return this.width;
    }

    get menuParams(): string {
        return this.opened ? 'open' : 'closed';
    }

    constructor(
        private animationBuilder: AnimationBuilder,
        private elementRef: ElementRef,
        private userAgentRef: UserAgentRef
    ) {}

    /**
     * We need to know the width of the element in which the SideMenu is nested. Here we traverse the DOM tree
     * looking for the first ancestor element with a non-zero offsetWidth.
     */
    ngAfterViewInit(): void {
        let ancestorWithWidth: HTMLElement | null;
        let currentElement = this.elementRef.nativeElement;
        const maxLevels = 10;
        let i = 0;
        while (!ancestorWithWidth && i < maxLevels) {
            const parent = currentElement.parentElement;
            if (0 < parent.offsetWidth) {
                ancestorWithWidth = parent;
            }
            currentElement = parent;
            i++;
        }
        this.ancestorWithWidth = ancestorWithWidth;
    }

    /**
     * The AnimationBuilder is used here because the desired animation result could not be achieved using the
     * metadata-based approach alone. This issue describes the problem: https://github.com/angular/angular/issues/20796
     *
     * If that issue gets resolved then this could be simplified and we may be able to drop the AnimationBuilder
     * and move this logic into the animationParams getter.
     */
    animationStarted(event: any): void {
        const menu = this.elementRef.nativeElement.querySelector('.menu');

        if (menu) {
            if (this.player) {
                this.player.destroy();
            }
            const sign = this.position === 'right' ? '' : '-';
            let startX = '0';
            let endX = `${sign}${this.responsiveWidth}`;
            if (event.toState === 'open') {
                [startX, endX] = [endX, startX];
            }
            const factory = this.animationBuilder.build([
                animate('0.3s', keyframes([
                    style({transform: `translateX(${startX})`, offset: 0 }),
                    style({transform: `translateX(${endX})`, offset: 0.7 })
                ]))
            ]);
            this.player = factory.create(menu, {});
            this.player.play();
        }
    }

    toggleState(): void {
        this.toggle.emit(!this.opened);
    }

    close(): void {
        if (this.opened === true) {
            this.toggleState();
        }
    }
}

@Directive({
    selector: 'gtx-side-menu-toggle'
})
export class SideMenuToggle {}
