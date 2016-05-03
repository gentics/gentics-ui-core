import {Type} from '@angular/core';
// Demo pages
import {ButtonDemo} from './pages/button-demo/button-demo';
import {CheckboxDemo} from './pages/checkbox-demo/checkbox-demo';
import {ColorsDemo} from './pages/colors-demo/colors-demo';
import {ContentsListItemDemo} from './pages/contents-list-item-demo/contents-list-item-demo';
import {DateTimePickerDemo} from './pages/date-time-picker-demo/date-time-picker-demo';
import {DropdownListDemo} from './pages/dropdown-list-demo/dropdown-list-demo';
import {IconsDemo} from './pages/icons-demo/icons-demo';
import {InputDemo} from './pages/input-demo/input-demo';
import {ModalDemo} from './pages/modal-demo/modal-demo';
import {NotificationDemo} from './pages/notification-demo/notification-demo';
import {OverlayHostDemo} from './pages/overlay-host-demo/overlay-host-demo';
import {RadioButtonDemo} from './pages/radio-button-demo/radio-button-demo';
import {RangeDemo} from './pages/range-demo/range-demo';
import {SearchBarDemo} from './pages/search-bar-demo/search-bar-demo';
import {SelectDemo} from './pages/select-demo/select-demo';
import {SideMenuDemo} from './pages/side-menu-demo/side-menu-demo';
import {SplitViewContainerDemo} from './pages/split-view-container-demo/split-view-container-demo';
import {SortableListDemo} from './pages/sortable-list-demo/sortable-list-demo';
import {TextareaDemo} from './pages/textarea-demo/textarea-demo';
import {TopBarDemo} from './pages/top-bar-demo/top-bar-demo';
import {TypographyDemo} from './pages/typography-demo/typography-demo';

export interface IPageInfo {
    name: string; 
    component: Type;
    type: 'component' | 'service' | 'css';
    keywords?: string[];
}

export const pages: IPageInfo[] = [
    {
        name: 'button',
        component: ButtonDemo,
        type: 'component'
    },
    {
        name: 'checkbox',
        component: CheckboxDemo,
        type: 'component'
    },
    {
        name: 'colors',
        component: ColorsDemo,
        type: 'css'
    },
    {
        name: 'contents-list-item',
        component: ContentsListItemDemo,
        type: 'component'
    },
    {
        name: 'date-time-picker',
        component: DateTimePickerDemo,
        type: 'component',
        keywords: ['calendar']
    },
    {
        name: 'dropdown-list',
        component: DropdownListDemo,
        type: 'component',
        keywords: ['menu']
    },
    {
        name: 'icons',
        component: IconsDemo,
        type: 'css'
    },
    {
        name: 'input',
        component: InputDemo,
        type: 'component',
        keywords: ['text', 'number']
    },
    {
        name: 'modal',
        component: ModalDemo,
        type: 'component',
        keywords: ['dialog', 'overlay']
    },
    {
        name: 'notification',
        component: NotificationDemo,
        type: 'service',
        keywords: ['toast', 'message']
    },
    {
        name: 'overlay-host',
        component: OverlayHostDemo,
        type: 'component'
    },
    {
        name: 'radio-button',
        component: RadioButtonDemo,
        type: 'component'
    },
    {
        name: 'range',
        component: RangeDemo,
        type: 'component',
        keywords: ['slider']
    },
    {
        name: 'search-bar',
        component: SearchBarDemo,
        type: 'component'
    },
    {
        name: 'select',
        component: SelectDemo,
        type: 'component',
        keywords: ['options']
    },
    {
        name: 'side-menu',
        component: SideMenuDemo,
        type: 'component',
        keywords: ['off-canvas', 'hamburger']
    },
    {
        name: 'sortable-list',
        component: SortableListDemo,
        type: 'component',
        keywords: ['drag', 'drop']
    },
    {
        name: 'split-view-container',
        component: SplitViewContainerDemo,
        type: 'component',
        keywords: ['panel', 'master-detail']
    },
    {
        name: 'textarea',
        component: TextareaDemo,
        type: 'component'
    },
    {
        name: 'top-bar',
        component: TopBarDemo,
        type: 'component',
        keywords: ['main', 'menu']
    },
    {
        name: 'typography',
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
