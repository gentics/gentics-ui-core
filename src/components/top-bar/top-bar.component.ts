import {Component} from '@angular/core';


/**
 * The top bar component is a container for top-level menu items, and acts as a header for the app.
 * Its immediate children will be displayed horizontally, vertically center-aligned, starting from the
 * left-hand-side.
 *
 * Items can be explicitly right-aligned by giving them the class `.gtx-top-bar-right`.
 *
 * ```html
 * <gtx-top-bar>
 *     <i class="material-icons">menu</i>
 *     <h5>Title</h5>
 *
 *     <!-- this icon will be right-aligned -->
 *     <i class="material-icons gtx-top-bar-right">person</i>
 * </gtx-top-bar>
 * ```
 */
@Component({
    selector: 'gtx-top-bar',
    template: require('./top-bar.tpl.html')
})
export class TopBar {}
