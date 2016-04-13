// Demo pages
import {ButtonDemo} from 'pages/button-demo/button-demo';
import {CheckboxDemo} from 'pages/checkbox-demo/checkbox-demo';
import {ColorsDemo} from 'pages/colors-demo/colors-demo';
import {ContentsListItemDemo} from 'pages/contents-list-item-demo/contents-list-item-demo';
import {DateTimePickerDemo} from 'pages/date-time-picker-demo/date-time-picker-demo';
import {DropdownListDemo} from 'pages/dropdown-list-demo/dropdown-list-demo';
import {InputDemo} from 'pages/input-demo/input-demo';
import {ModalDemo} from 'pages/modal-demo/modal-demo';
import {NotificationDemo} from 'pages/notification-demo/notification-demo';
import {OverlayHostDemo} from 'pages/overlay-host-demo/overlay-host-demo';
import {RadioButtonDemo} from 'pages/radio-button-demo/radio-button-demo';
import {RangeDemo} from 'pages/range-demo/range-demo';
import {SearchBarDemo} from 'pages/search-bar-demo/search-bar-demo';
import {SelectDemo} from 'pages/select-demo/select-demo';
import {SideMenuDemo} from 'pages/side-menu-demo/side-menu-demo';
import {SplitViewContainerDemo} from 'pages/split-view-container-demo/split-view-container-demo';
import {SortableListDemo} from 'pages/sortable-list-demo/sortable-list-demo';
import {TextareaDemo} from 'pages/textarea-demo/textarea-demo';
import {TopBarDemo} from 'pages/top-bar-demo/top-bar-demo';
import {TypographyDemo} from 'pages/typography-demo/typography-demo';

export interface IDemoItem {
    name: string;
    component: FunctionConstructor;
}

export const demos: IDemoItem[] = [
    {
        name: 'button',
        component: ButtonDemo
    },
    {
        name: 'checkbox',
        component: CheckboxDemo
    },
    {
        name: 'colors',
        component: ColorsDemo
    },
    {
        name: 'contents-list-item',
        component: ContentsListItemDemo
    },
    {
        name: 'date-time-picker',
        component: DateTimePickerDemo
    },
    {
        name: 'dropdown-list',
        component: DropdownListDemo
    },
    {
        name: 'input',
        component: InputDemo
    },
    {
        name: 'modal',
        component: ModalDemo
    },
    {
        name: 'notification',
        component: NotificationDemo
    },
    {
        name: 'overlay-host',
        component: OverlayHostDemo
    },
    {
        name: 'radio-button',
        component: RadioButtonDemo
    },
    {
        name: 'range',
        component: RangeDemo
    },
    {
        name: 'search-bar',
        component: SearchBarDemo
    },
    {
        name: 'select',
        component: SelectDemo
    },
    {
        name: 'side-menu',
        component: SideMenuDemo
    },
    {
        name: 'sortable-list',
        component: SortableListDemo
    },
    {
        name: 'split-view-container',
        component: SplitViewContainerDemo
    },
    {
        name: 'textarea',
        component: TextareaDemo
    },
    {
        name: 'top-bar',
        component: TopBarDemo
    },
    {
        name: 'typography',
        component: TypographyDemo
    }
];

/**
 * Convert "my-best-string" to "MyBestString"
 */
export const kebabToPascal: Function = (str: string): string => {
    let camel: string = str.replace(/\-([a-z])/g, (m) => m[1].toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
};
