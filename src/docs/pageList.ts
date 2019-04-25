import {Type} from '@angular/core';
// Demo pages
import {BreadcrumbsDemo} from './pages/breadcrumbs-demo/breadcrumbs-demo';
import {ButtonDemo} from './pages/button-demo/button-demo';
import {CheckboxDemo} from './pages/checkbox-demo/checkbox-demo';
import {ColorsDemo} from './pages/colors-demo/colors-demo';
import {ContentsListItemDemo} from './pages/contents-list-item-demo/contents-list-item-demo';
import {DateTimePickerControlsDemo} from './pages/date-time-picker-controls-demo/date-time-picker-controls-demo';
import {DateTimePickerDemo} from './pages/date-time-picker-demo/date-time-picker-demo';
import {DropdownListDemo} from './pages/dropdown-list-demo/dropdown-list-demo';
import {FileDropAreaDemo} from './pages/file-drop-area-demo/file-drop-area-demo';
import {FilePickerDemo} from './pages/file-picker-demo/file-picker-demo';
import {GridDemo} from './pages/grid-demo/grid-demo';
import {IconsDemo} from './pages/icons-demo/icons-demo';
import {InputDemo} from './pages/input-demo/input-demo';
import {Instructions} from './pages/instructions/instructions';
import {MenuToggleButtonDemo} from './pages/menu-toggle-button-demo/menu-toggle-button-demo';
import {ModalServiceDemo} from './pages/modal-service-demo/modal-service-demo';
import {NotificationDemo} from './pages/notification-demo/notification-demo';
import {OverlayHostDemo} from './pages/overlay-host-demo/overlay-host-demo';
import {ProgressBarDemo} from './pages/progress-bar-demo/progress-bar-demo';
import {RadioButtonDemo} from './pages/radio-button-demo/radio-button-demo';
import {RangeDemo} from './pages/range-demo/range-demo';
import {SearchBarDemo} from './pages/search-bar-demo/search-bar-demo';
import {SelectDemo} from './pages/select-demo/select-demo';
import {SideMenuDemo} from './pages/side-menu-demo/side-menu-demo';
import {SortableListDemo} from './pages/sortable-list-demo/sortable-list-demo';
import {SplitViewContainerDemo} from './pages/split-view-container-demo/split-view-container-demo';
import {TabsDemo} from './pages/tabs-demo/tabs-demo';
import {TextareaDemo} from './pages/textarea-demo/textarea-demo';
import {TopBarDemo} from './pages/top-bar-demo/top-bar-demo';
import {TypographyDemo} from './pages/typography-demo/typography-demo';
import { GroupedTabsDemo } from './pages/grouped-tabs-demo/grouped-tabs-demo';

export interface IPageInfo {
    path: string;
    component: Type<any>;
    type: 'component' | 'service' | 'css' | 'info';
    keywords?: string[];
}

export const pages: IPageInfo[] = [
    {
        path: 'instructions',
        component: Instructions,
        type: 'info'
    },
    {
        path: 'breadcrumbs',
        component: BreadcrumbsDemo,
        type: 'component'
    },
    {
        path: 'button',
        component: ButtonDemo,
        type: 'component'
    },
    {
        path: 'checkbox',
        component: CheckboxDemo,
        type: 'component'
    },
    {
        path: 'colors',
        component: ColorsDemo,
        type: 'css'
    },
    {
        path: 'contents-list-item',
        component: ContentsListItemDemo,
        type: 'component'
    },
    {
        path: 'date-time-picker',
        component: DateTimePickerDemo,
        type: 'component',
        keywords: ['calendar']
    },
    {
        path: 'date-time-picker-controls',
        component: DateTimePickerControlsDemo,
        type: 'component',
        keywords: ['calendar']
    },
    {
        path: 'dropdown-list',
        component: DropdownListDemo,
        type: 'component',
        keywords: ['menu']
    },
    {
        path: 'file-drop-area',
        component: FileDropAreaDemo,
        type: 'component',
        keywords: ['file', 'upload', 'drag', 'drop']
    },
    {
        path: 'file-picker',
        component: FilePickerDemo,
        type: 'component',
        keywords: ['file', 'pick', 'upload']
    },
    {
        path: 'grid',
        component: GridDemo,
        type: 'css'
    },
    {
        path: 'grouped-tabs',
        component: GroupedTabsDemo,
        type: 'component'
    },
    {
        path: 'icons',
        component: IconsDemo,
        type: 'css'
    },
    {
        path: 'input',
        component: InputDemo,
        type: 'component',
        keywords: ['text', 'number']
    },
    {
        path: 'menu-toggle-button',
        component: MenuToggleButtonDemo,
        type: 'component',
        keywords: ['hamburger']
    },
    {
        path: 'modal-service',
        component: ModalServiceDemo,
        type: 'service',
        keywords: ['dialog', 'overlay']
    },
    {
        path: 'notification',
        component: NotificationDemo,
        type: 'service',
        keywords: ['toast', 'message']
    },
    {
        path: 'overlay-host',
        component: OverlayHostDemo,
        type: 'component'
    },
    {
        path: 'progress-bar',
        component: ProgressBarDemo,
        type: 'component'
    },
    {
        path: 'radio-button',
        component: RadioButtonDemo,
        type: 'component'
    },
    {
        path: 'range',
        component: RangeDemo,
        type: 'component',
        keywords: ['slider']
    },
    {
        path: 'search-bar',
        component: SearchBarDemo,
        type: 'component'
    },
    {
        path: 'select',
        component: SelectDemo,
        type: 'component',
        keywords: ['options']
    },
    {
        path: 'side-menu',
        component: SideMenuDemo,
        type: 'component',
        keywords: ['off-canvas', 'hamburger']
    },
    {
        path: 'sortable-list',
        component: SortableListDemo,
        type: 'component',
        keywords: ['drag', 'drop']
    },
    {
        path: 'split-view-container',
        component: SplitViewContainerDemo,
        type: 'component',
        keywords: ['panel', 'master-detail']
    },
    {
        path: 'textarea',
        component: TextareaDemo,
        type: 'component'
    },
    {
        path: 'tabs',
        component: TabsDemo,
        type: 'component',
        keywords: ['']
    },
    {
        path: 'top-bar',
        component: TopBarDemo,
        type: 'component',
        keywords: ['main', 'menu']
    },
    {
        path: 'typography',
        component: TypographyDemo,
        type: 'css',
        keywords: ['fonts']
    }
];

/**
 * Convert "my-best-string" to "MyBestString"
 */
export const kebabToPascal: Function = (str: string): string => {
    let camel: string = str.replace(/\-([a-z])/g, (m: string) => m[1].toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
};
