/**
 * A wrapper around items that appear in the list pane of the SplitViewComponent.
 *
 * Two component-specific classes can be used:
 *
 * * `.item-avatar`: The content of this element will be styled in a circular container.
 * * `.item-primary`: The primary content of the item, which will take up all the remaining space via `flex: 1`.
 * * `.show-on-hover`: Any element with this class will appear faded out until the user hovers the list item.
 *
 *
 * ```html
 * <gtx-contents-list-item *ngFor="let item of listItems">
 *     <!-- this will be styled as a circular icon -->
 *     <div class="item-avatar"><i class="material-icons">{{ item.icon }}</i></div>
 *     <!-- this will stretch to use all available space -->
 *     <div class="item-primary"><a [routerLink]="[item.route]">{{ item.title }}</a></div>
 *     <!-- these will use remaining space to the right -->
 *     <i class="material-icons show-on-hover">edit</i>
 *     <i class="material-icons show-on-hover">star</i>
 * </gtx-contents-list-item>
 * ```
 */
export declare class ContentsListItem {
}
