import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    Output,
    HostBinding,
    EventEmitter,
    ViewChild
} from '@angular/core';

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
    template: require('./side-menu.tpl.html'),
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenu {

    /**
     * Sets the state of the menu: true = opened, false = closed.
     */
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

    @HostBinding('class.opened') get hostIsOpen(): boolean {
        return this.opened;
    }

    @ViewChild('toggleButton') toggleButton: ElementRef;

    /**
     * Fired when the toggle button is clicked. The value is equal to
     * the value of the `opened`
     */
    @Output() toggle = new EventEmitter<boolean>();

    toggleState(): void {
        this.toggle.emit(!this.opened);
    }

    close(): void {
        if (this.opened === true) {
            this.toggleState();
        }
    }

    getMenuTranslateX(): string {
        let value: string = '0';
        if (!this.opened) {
            const sign = this.position === 'left' ? '-' : '';
            value = `${sign}${this.width}`;
        }
        return `translateX(${value})`;
    }

    getToggleButtonTranslateX(): string {
        const buttonWidth = this.toggleButton.nativeElement.offsetWidth;
        let value: string = '0';
        if (!this.opened) {
            const sign = this.position === 'left' ? '' : '-';
            const widthVal = Number(buttonWidth) + this.toggleButtonOffset;
            value = `${sign}${widthVal}px`;
        }
        return `translateX(${value})`;
    }
}
