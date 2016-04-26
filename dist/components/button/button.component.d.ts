/**
 * A Button component.
 *
 * ```html
 * <gtx-button>Click me</gtx-button>
 * <gtx-button size="large">Buy Now!</gtx-button>
 * <gtx-button type="alert">Delete all stuff</gtx-button>
 * ```
 */
export declare class Button {
    /**
     * Buttons can be "small", "regular" or "large"
     */
    size: string;
    /**
     * Type determines the style of the button. Can be "default", "secondary",
     * "success", "warning" or "alert".
     */
    type: string;
    /**
     * Setting the "flat" attribute gives the button a transparent background
     * and only depth on hover.
     */
    flat: boolean;
    /**
     * Controls whether the button is disabled.
     */
    disabled: boolean;
    private isFlat;
    getButtonClasses(): string;
}
